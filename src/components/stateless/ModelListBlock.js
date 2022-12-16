import React from "react";

function ModelListBlock({
  selected,
  category,
  relabel,
  location,
  time,
  description,
  setFilter,
  sessionid,
  relabelid,
  categoryid,
  labelCount,
  shape
}) {

  
  function convertShape(s, ratio){
    let scaled = s.split("M")[1].split("Z")[0].split("L").map((point) => {
      let p = point.trim().split(" ");
      p[1] = p[1]*ratio;
      return p.join(" ");
    }).join(" L ");
    return "M " + scaled + " Z";
  }
  
  
  return (
    <div className={`modelListBlock ${selected ? "selected" : ""}`}>
      <div className="blockTitle">
        <div className="categoryName">
          <h1
            className="modelFilter"
            onClick={() => setFilter(1, category, categoryid)}
          >
            {category}
          </h1>
          <h1
            className="relabel modelFilter"
            onClick={() => setFilter(1, relabel, relabelid)}
            style={shape !== undefined && shape.type === 1 ? {color:"gray"} : {}}
          >
            {relabel}
          </h1>
        </div>
        <div>
          <h4
            className="modelFilter"
            onClick={() => setFilter(0, location, sessionid)}
          >
            {location}
          </h4>
          <p>{time}</p>
        </div>
        {shape !== undefined &&
          <div className="shape">
            <svg viewBox={`0 0 1 ${shape.height/shape.width}`} height="100%" width="100%" preserveAspectRatio="xMidYMid">
              <path d={convertShape(shape.shape,shape.height/shape.width)} stroke={shape.type === 0 ? "var(--green-teal)" : "#52E8B2"} strokeWidth={Math.max(shape.height/shape.width,1)*0.04} fill={shape.type === 0 ? "transparent" : "var(--green-teal)"}></path>
            </svg>
          </div>
        }
        
      </div>
      <div className="blockDescription">
        <p>{description}</p>
      </div>
      <div className="labelCount">{labelCount !== 0 && <span>{labelCount}</span>}</div>
    </div>
  );
}

export default ModelListBlock;
