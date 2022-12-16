const express = require("express");
var cors = require('cors');
const path = require("path");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// PWAs want HTTPS!
function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

app.all("*", checkHttps);

// A test route to make sure the server is up.
app.get("/api/ping", (request, response) => {
  console.log("❇️ Received GET request to /api/ping");
  response.send("pong!");
});

// Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});

// Database Handling

// const dbFile = "./data/test.db";
// const fs = require("fs");
// const exists = fs.existsSync(dbFile);
// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database(dbFile);

const dbFile = "./.data/demo.db";
const fs = require("fs");
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (exists) {
    console.log("Database is ready to go");
    db.all("SELECT * from Sessions", (err, row) => {
      console.log(JSON.stringify(row));
    });
    db.all("SELECT * from Categories", (err, row) => {
      console.log(JSON.stringify(row));
    });
    // db.all("SELECT * from Labels", (err, row) => {
    //   console.log(JSON.stringify(row));
    // });
  }
});

// Endpoint to get all categories in the database
app.get("/api/getCategories", (request, response) => {
  db.all("SELECT * from Categories ORDER BY id DESC", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// Endpoint to get all sessions
app.get("/api/getSessions", (request, response) => {
  db.all("SELECT * from Sessions ORDER BY id DESC", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// Endpoint to get a label, by id
app.get("/api/getLabel", (request, response) => {
  console.log();
  db.each(
    `SELECT shape, width, height FROM Labels WHERE id=${request.query.label}`,
    (err, row) => {
      if (err) {
        response.send({ message: "error" });
      } else {
        response.send(JSON.stringify(row));
      }
    }
  );
});

// Endpoint to get a label per category
app.get("/api/getUniqueLabels", (request, response) => {
  db.all("SELECT * from Labels group by category", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// Endpoint to add a category into the database
app.post("/api/addCategory", (request, response) => {
  console.log(`add to categories ${request.body.session}`);
  let details = request.body;
  db.run(
    `INSERT INTO Categories (name,description,relabel,session) VALUES(?,?,?,?)`, details.name, details.description, details.relabel, details.session,
    function(error){
      if (error) {
        console.log(details.description, details.name, details.relabel, details.session);
        console.log(error, "Inserting Category");
        response.send({ message: "error" });
      } else {
        let count = this.lastID;
        response.json({ id: count });
        db.run(
          `UPDATE Sessions SET categories = CASE WHEN categories IS NULL THEN '${count}' ELSE categories || ',${count}' END WHERE id=${details.session}`,
          error => {
            if (error) {
              console.log(error, "Updating Session with New Category");
            } else {
              console.log("Successfully Added Category, Logged in Session");
            }
          }
        );
      }
    }
  );
});

// Endpoint to add a session into the database
app.post("/api/addSession", (request, response) => {
  let d = new Date();
  let date = `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
    .getDate()
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;

  db.run(
    `INSERT INTO Sessions (location,date) VALUES(?,?)`, request.body.location, date,
    function(error){
      if (error) {
        console.log(error, "Inserting Session");
        response.send({ message: "error" });
      } else {
        console.log("Successfully added a session");
        console.log(this.lastID);
        response.json({ id: this.lastID });
      }
    }
  );
});

// Endpoint to add a label into the database
app.post("/api/addLabel", (request, response) => {
  let d = request.body;
  db.run(
    `INSERT INTO Labels (category,type,shape,width,height,x,y) VALUES(${d.category},${d.type},'${d.shape}',${d.width},${d.height},${d.x},${d.y})`,
    function(error){
      if (error) {
        console.log(error, "Inserting Label");
        response.send({ message: "error" });
      } else {
        let newID = this.lastID;
        db.run(
          `UPDATE Categories SET labels = CASE WHEN labels is null then '${newID}' ELSE labels || ',${newID}' END WHERE id=${d.category}`,
          err => {
            if (err) {
              console.log(err, "Updating categories with new label");
              response.send({ message: "error" });
            } else {
              console.log("Successfully added a new Label");
              response.end();
            }
          }
        );
      }
    }
  );
});
