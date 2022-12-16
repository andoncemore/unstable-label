import React, { useState, useRef } from "react";
import HelpTip from "./stateless/HelpTip";
import MakeCategoryDialog from "./MakeCategoryDialog";
import "./CreateCategories.css";

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function CreateCategories({
  closePanel,
  isMapLatest,
  staticMap,
  categories,
  objectDetector,
  addYourCategories,
  setActiveList,
  demo
}) {
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState(null);
  const [selected, setSelected] = useState(null);
  const [active, setActive] = useState(null);
  const imageRef = useRef(null);
  
  let demoCategories = categories.filter(cat => cat.id === 18 || cat.id === 15 || cat.id === 29 || cat.id === 34);
  
  const evaluateImage = async ({ image }) => {
    let usergenerated = categories.filter(cat => cat.labels !== null);
    let results = await objectDetector.detect(image);
    console.log(demoCategories);
    // let largeResults = results.filter(
    //   res => res.normalized.width * res.normalized.height > 0.0075
    // );
    let lessResults = results.slice(-4);

    let modifiedResults = await Promise.all(
      lessResults.map((entry, index) => {
        let randomCategory = randomChoice(usergenerated);
        if(demo){
          randomCategory = demoCategories.pop();
        }
        console.log(randomCategory);
        if (randomCategory.labels === null) {
          return {
            ...entry,
            label: randomCategory.name,
            id: randomCategory.id,
            shape: { shape: "M 0 0 L 1 0 L 1 1 L 0 1 Z" }
          };
        } else {
          return fetch(
            `/api/getLabel?label=${randomChoice(
              randomCategory.labels.split(",")
            )}`
          )
            .then(res => res.json())
            .then(response => {
              // console.log(response);
              return {
                ...entry,
                label: randomCategory.name,
                id: randomCategory.id,
                shape: response
              };
            });
        }
      })
    );
    let ratioResults = modifiedResults.map(res => {
      let ratio = res.shape.width / res.shape.height;
      let resized = { ...res.normalized };

      if (ratio < res.normalized.width / res.normalized.height) {
        resized.height = resized.width / ratio;
        resized.y = resized.y - (resized.height - res.normalized.height) / 2;
      } else {
        resized.width = resized.height * ratio;
        resized.x = resized.x - (resized.width - res.normalized.height) / 2;
      }
      return { ...res, normalized: resized };
    });

    let resizedResults = ratioResults.map(res => {
      if (res.normalized.width * res.normalized.height > 0.015) {
        return res;
      } else {
        let scaling = 3;
        let resized = { ...res.normalized };
        // console.log(res.normalized);
        resized.width = res.normalized.width * scaling;
        resized.height = res.normalized.height * scaling;
        resized.x =
          res.normalized.x - (res.normalized.width * (scaling - 1)) / 2;
        resized.y =
          res.normalized.y - (res.normalized.height * (scaling - 1)) / 2;
        return { ...res, normalized: resized };
      }
    });

    return resizedResults;
  };

  function getModelResults() {
    if (labels === null) {
      console.log(imageRef.current);
      evaluateImage({ image: imageRef.current }).then(results => {
        setLabels(results);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }

  function makePath(data) {
    return {
      d: data.shape.shape,
      transform: `translate(${data.normalized.x * 100} ${data.normalized.y *
        100}) scale(${data.normalized.width * 100} ${data.normalized.height *
        100})`
    };
  }

  function getHistory(id) {
    let history = [];
    let currentid = id;
    while (currentid !== null) {
      let h = categories.find(o => o.id === currentid);
      history.push({ name: h.name, id: h.id });
      currentid = h.relabel;
    }
    return history.reverse();
  }

  function addCategory(name, description) {
    console.log(labels,active)
    addYourCategories(name, description, labels[active].id, labels[active].label);
    setActive(null);
    setActiveList(null);
  }

  const loadingScreen = (
    <div className="pending">
      <div className="loader"></div>
      <h1>evaluating model at current location</h1>
    </div>
  );

  const formattedData = data => (
    <React.Fragment>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMinYMin slice">
        <mask id="labelMask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          {data.map((label, index) => (
            <path {...makePath(label)} fill="black" key={index} />
          ))}
        </mask>
        <rect
          fill="rgba(255,0,0,0.8)"
          x="0"
          y="0"
          width="100"
          height="100"
          mask="url(#labelMask)"
        />
        <g mask="url(#selectedMask)">
          {data.map((label, index) => (
            <path {...makePath(label)} className="labelOutline" key={index} />
          ))}
        </g>
        {(selected !== null || active !== null) && (
          <React.Fragment>
            <mask id="selectedMask">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              <path
                {...makePath(data[active === null ? selected : active])}
                fill="black"
              />
            </mask>
            <path
              {...makePath(data[active === null ? selected : active])}
              className="selectedShape"
            />
          </React.Fragment>
        )}
      </svg>
      <div style={{ mask: "url(#selectedMask)" }}>
        {data.map((label, index) => {
          const { width, height, y, x } = label.normalized;
          let positioning = {};
          if (y < 0.5) {
            positioning.top = `${Math.min(y + height, 1) * 100}%`;
          } else {
            positioning.bottom = `${(1 - Math.max(y, 0)) * 100}%`;
          }
          if (x > 0.5) {
            positioning.right = `${(1 - Math.min(x + width, 1)) * 100}%`;
            positioning.maxWidth = `${x * 100}%`;
          } else {
            positioning.left = `${Math.max(x, 0) * 100}%`;
            positioning.maxWidth = `${(1 - Math.max(x, 0)) * 100}%`;
          }

          return (
            <h4
              style={positioning}
              className={`textLabel ${
                selected !== index && selected !== null ? "invisible" : ""
              } ${active === index ? "active" : ""}`}
              key={index}
              onMouseEnter={() => setSelected(index)}
              onMouseLeave={() => setSelected(null)}
              onClick={() => {setActive(index); setActiveList(labels[index].id)}}
            >
              {label.label}
            </h4>
          );
        })}
      </div>
    </React.Fragment>
  );

  return (
    <div className="popOut">
      {active !== null && (
        <MakeCategoryDialog
          relabel={labels[active].label}
          history={getHistory(labels[active].id)}
          close={() => {setActive(null); setActiveList(null);}}
          submit={(name, description) => addCategory(name, description)}
        />
      )}
      <div id="createCategories">
        <nav>
          <div>
            <h2>create categories</h2>
            <HelpTip
              title="create categories mode"
              text="this is the mode where you create categories"
            />
          </div>
          <button className="gray" onClick={closePanel}>
            close
          </button>
        </nav>

        <div className="image-container">
          {loading ? loadingScreen : formattedData(labels)}
          <div className="placeholder">
            {isMapLatest && (
              <img alt="Google Street View for Annotation" onLoad={getModelResults} src={staticMap} ref={imageRef} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCategories;
