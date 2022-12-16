import React, { useState, useEffect, useRef } from "react";
import DrawingCanvas from "./DrawingCanvas";
import HelpTip from "./stateless/HelpTip";
import CreatedLabel from "./CreatedLabel";
import "./CreateData.css";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./stateless/items";

function CreateData({ closePanel, isMapLatest, staticMap, brush, addLabelDatabase }) {
  const [drawSize, setDrawSize] = useState({ width: 0, height: 0 });
  const [labels, setLabels] = useState({});
  const [selectedLabel, setSelectedLabel] = useState("");
  const drawContainer = useRef(null);

  //   Dragging
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CATEGORY,
    drop: (item, monitor) => addLabel(item, monitor),
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  function addLabel(item, monitor) {
    var absolutePos = monitor.getSourceClientOffset();
    var clientRect = drawContainer.current.getBoundingClientRect();
    var xpos = absolutePos.x - clientRect.left;
    var ypos = absolutePos.y - clientRect.top;

    let id = Date.now();
    let newLabel = { ...labels };
    // console.log(item.id)
    newLabel[id] = {
      id: id,
      category: item.name,
      categoryIndex: item.id,
      position: { x: Math.max(0, xpos), y: Math.max(0, ypos) },
      shapes: []
    };
    setLabels(newLabel);
    setSelectedLabel(id.toString());
  }

  function changeSelected(newID) {
    if (newID === selectedLabel) {
      setSelectedLabel("");
    } else {
      setSelectedLabel(newID);
    }
  }

  function updateLabelPosition(id, pos) {
    setLabels({ ...labels, [id]: { ...labels[id], position: pos } });
  }

  function addShape(shape) {
    shape.type = brush;
    let change = { ...labels };
    change[selectedLabel] = {
      ...change[selectedLabel],
      shapes: [...change[selectedLabel].shapes, shape]
    };
    // console.log(shape);
    setLabels(change);
  }

  function handleResize() {
    setDrawSize({
      width: drawContainer.current.clientWidth,
      height: drawContainer.current.clientHeight
    });
  }
  
  function deleteLabel(id){
    delete labels[id];
  }

  function drawWeb(shapes) {
    return (
      <svg viewBox="0 0 100 100" className="connect">
        {Object.keys(labels).map(key => {
          let corner = {
            x: (labels[key].position.x / drawSize.width) * 100
          };
          return labels[key].shapes.map((shape, index) => {
            let midHeight = (shape.y + shape.h / 2) * 100;
            let minDistance = { dist: 100 };
            corner.y = (labels[key].position.y / drawSize.width) * 100;
            if (midHeight > corner.y) {
              corner.y = ((labels[key].position.y + 24) / drawSize.width) * 100;
            }

            shape.points.forEach(p => {
              let x2 = (shape.w * p.x + shape.x) * 100;
              let y2 = (shape.h * p.y + shape.y) * 100;

              let a = corner.x - x2;
              let b = corner.y - y2;
              let dist = Math.sqrt(a * a + b * b);
              if (dist < minDistance.dist) {
                minDistance = {
                  dist: dist,
                  x: x2,
                  y: y2
                };
              }
            });
            let slope = (corner.y - minDistance.y) / (corner.x - minDistance.x);
            let midY = corner.y + (minDistance.y - corner.y) / 2;
            let midX = corner.x + (minDistance.x - corner.x) / 2;
            let midDist = minDistance.dist / 2 - 1.5;
            let offX = Math.sqrt((midDist * midDist) / (1 + slope * slope));
            return (
              <path
                d={`M ${midX + offX} ${midY + offX * slope} L ${midX -
                  offX} ${midY - offX * slope}`}
                key={index}
                stroke={selectedLabel === key ? "var(--green-teal)" : "#E2E2E2"}
              />
            );
          });
        })}
      </svg>
    );
  }

  //   Add Event Handler to listen for canvas resize
  useEffect(() => {
    if (drawSize.height === 0) {
      handleResize();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div className="popOut">
      <div id="createData">
        <nav>
          <div>
            <h2>draw data</h2>
            <HelpTip
              title="draw data mode"
              text="this is the mode where you draw the data"
            />
          </div>
          <button className="gray" onClick={closePanel}>
            close
          </button>
        </nav>
        <div className="image-container" ref={drawContainer}>
          {drawWeb(labels)}
          {Object.keys(labels).map(key => (
            <CreatedLabel
              name={labels[key].category}
              pos={labels[key].position}
              key={key}
              id={key}
              categoryIndex={labels[key].categoryIndex}
              selected={selectedLabel === key}
              handleClick={update => changeSelected(update)}
              shapes={labels[key].shapes}
              drawWidth={drawSize.width}
              updateLabelPosition={pos => updateLabelPosition(key, pos)}
              addLabelDatabase={addLabelDatabase}
              deleteSelf={() => deleteLabel(key)}
            />
          ))}
          {Object.keys(labels).length === 0 &&
            <h1>Drag a category from the dialog box to start</h1>
          }
          <div className="dropTarget" ref={drop}>
            <DrawingCanvas
              width={drawSize.width}
              height={drawSize.height}
              addNewShape={addShape}
              active={selectedLabel !== ""}
            />
          </div>
          <div className="placeholder">
          {isMapLatest &&  <img alt="Google Street View For Annotation" src={staticMap} />}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default CreateData;

// <img src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2F9e635e73-c652-4685-bc5d-6554280fb692.image.png?v=1586302888544" />
