import React from "react";
import Draggable from "react-draggable";
import SVGLabel from "./SVGLabel";
import simplify from "simplify-js";

function CreatedLabel({
  name,
  pos,
  selected,
  handleClick,
  id,
  shapes,
  drawWidth,
  updateLabelPosition,
  addLabelDatabase,
  categoryIndex,
  deleteSelf
}) {
  function onStop(e, ui) {
    // console.log(e, ui);
    const { x, y } = pos;
    updateLabelPosition({ x: ui.x, y: ui.y });
    if (Math.sqrt((x - ui.x) * (x - ui.x) + (y - ui.y) * (y - ui.y)) < 2) {
      handleClick(id);
    }
  }

  function savePath(shp) {
    let scalingX = drawWidth * shp.w;
    let scalingY = drawWidth * shp.h;

    let scaled = shp.points.map(p => ({
      x: p.x * scalingX,
      y: p.y * scalingY
    }));
    let simplified = simplify(scaled, 8, false);

    //     Draw Simplest
    let simp = `M ${simplified[0].x / scalingX} ${simplified[0].y / scalingY}`;
    for (let i = 1; i < simplified.length; i++) {
      simp += ` L ${simplified[i].x / scalingX} ${simplified[i].y / scalingY}`;
    }
    simp += " Z";
    return {
      path: simp,
      width: shp.w * 100,
      height: shp.h * 100,
      x: shp.x * 100,
      y: shp.y * 100,
      type:shp.type
    };
  }

  return (
    <React.Fragment>
      <Draggable
        defaultPosition={{ x: pos.x, y: pos.y }}
        bounds="parent"
        handle="h4"
        onStop={onStop}
      >
        <div className={`createdLabel ${selected ? "selected" : ""}`}>
          <div>
            <h4>{name}</h4>
            <button
              disabled={shapes.length === 0 ? true : null}
              onClick={() => {
                let formatted = shapes.map(s => savePath(s));
                addLabelDatabase(categoryIndex, formatted);
                deleteSelf();
              }}
            >
              add data
            </button>
            {selected && shapes.length === 0 && (
              <p>draw on image to create data</p>
            )}
          </div>
        </div>
      </Draggable>
      {shapes.map((svg, index) => (
        <SVGLabel
          width={svg.w}
          height={svg.h}
          x={svg.x}
          y={svg.y}
          drawWidth={drawWidth}
          points={svg.points}
          key={index}
          brush={svg.type}
          selected={selected}
        />
      ))}
    </React.Fragment>
  );
}

export default CreatedLabel;
