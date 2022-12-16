import React, { useState, useEffect } from "react";
import ModelDropdown from "./ModelDropdown";
import ModelListBlock from "./stateless/ModelListBlock";
import "./ModelList.css";

function ViewPanel({ categories, sessions, active }) {
  const [dropType, setDropType] = useState(0);
  const [filter, setFilter] = useState({ name: "", id: 0 });
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    fetch("/api/getUniqueLabels")
      .then(res => res.json())
      .then(results => setShapes(results));
  }, [categories]);

  function findRelabel(index) {
    if (index === null) {
      return null;
    } else {
      return categories.find(o => o.id === index).name;
    }
  }

  function getSessionDetails(index) {
    let sess = sessions.find(o => o.id === index);
    return { location: sess.location, time: sess.date };
  }

  function filteredResults() {
    if (filter.name === "") {
      return categories;
    } else {
      if (dropType === 0) {
        return categories.filter(category => filter.id === category.session);
      } else {
        return categories.filter(
          category =>
            filter.id === category.id || filter.id === category.relabel
        );
      }
    }
  }
  
  function findShape(categoryID){
    let found = shapes.find(elt => elt.category === categoryID);
    return found;
  }

  return (
    <div id="viewPanel" style={viewPanelStyle}>
      <ModelDropdown
        sessions={sessions}
        dropType={dropType}
        filter={filter}
        setFilter={(name, id) => {
          setDropType(0);
          setFilter({ name: name, id: id });
        }}
      />
      <div className="modelList">
        {filteredResults().map((block, index) => (
          <ModelListBlock
            category={block.name}
            relabel={findRelabel(block.relabel)}
            {...getSessionDetails(block.session)}
            description={block.description}
            key={block.id}
            sessionid={block.session}
            selected={active === block.id}
            categoryid={block.id}
            relabelid={block.relabel}
            setFilter={(mode, name, id) => {
              setDropType(mode);
              setFilter({ name: name, id: id });
            }}
            labelCount={
              block.labels !== null ? block.labels.split(",").length : 0
            }
            shape={findShape(block.id)}
          />
        ))}
      </div>
    </div>
  );
}

const viewPanelStyle = {
  gridArea: "model",
  position: "relative",
  display: "flex",
  flexFlow: "column nowrap"
};

export default ViewPanel;
