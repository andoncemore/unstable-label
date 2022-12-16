import React, { useState } from "react";
import "./ModelDropdown.css";
import HelpTip from "./stateless/HelpTip";

function ModelDropdown({ dropType, filter, sessions, setFilter }) {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3>view model:</h3>
        {dropType === 0 && (
          <div
            className={`dropdown list ${open ? "active" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <h2>{filter.name === "" ? "all categories" : filter.name}</h2>
            {open && (
              <div className="results">
                <div className="header">
                  <h4>created from:</h4>
                </div>
                <div className="listing">
                  <div
                    className={filter.name === "" ? "active" : ""}
                    onClick={() => setFilter("", 0)}
                  >
                    <h2>all</h2>
                  </div>
                  {sessions.map(sess => (
                    <div
                      key={sess.id}
                      className={filter.id === sess.id ? "active" : ""}
                      onClick={() => setFilter(sess.location, sess.id)}
                    >
                      <h2>{sess.location}</h2>
                      {sess.categories !== null && <span>{sess.categories.split(",").length}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {dropType === 1 && (
          <div className="dropdown choice" onClick={() => setFilter("", 0)}>
            <h2>{filter.name}</h2>
          </div>
        )}
      </div>

      <HelpTip
        title="View Model"
        text="this is a listing of all the categories currently in the system, along with a link to their history. Explore the model by reading some of the categories."
      />
    </nav>
  );
}

export default ModelDropdown;
