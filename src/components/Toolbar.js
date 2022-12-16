import React from "react";
import HelpTip from "./stateless/HelpTip";
import "./Toolbar.css";
import Draggable from "react-draggable";

function Toolbar({ brush, setBrush}) {
  
  return (
    <Draggable bounds="parent">
      <div className="toolbar">
        <div className="titleBlock">
          <h4>brushes</h4>
          <HelpTip
            title="brushes"
            text="When drawing, you can choose to label the image as it exists or you can imagine how your neighborhood could be."
          />
        </div>
        <div className="brushes">
          <input id="label" type="radio" name="brush" value="0" checked={brush === 0} onChange={(evt) => setBrush(parseInt(evt.target.value))}/>
          <label htmlFor="label">
            <span>
              <i className="far fa-circle"></i>
            </span>
            <h4>label</h4>
          </label>
          <input id="imagine" type="radio" name="brush" value="1" checked={brush === 1} onChange={(evt) => setBrush(parseInt(evt.target.value))}/>
          <label htmlFor="imagine">
            <span>
              <i className="fas fa-circle"></i>
            </span>
            <h4>imagine</h4>
          </label>
        </div>
      </div>
    </Draggable>
  );
}

export default Toolbar;
