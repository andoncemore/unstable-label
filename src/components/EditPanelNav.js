import React from 'react'
import './EditPanelNav.css'

function EditPanelNav(props){
  return(
    <nav>
      <div className="locations">
        <h3>creating data from:</h3>
        <h2>{props.location}</h2>
        <button className="linkButton" onClick={props.restart}>restart</button>
      </div>
      <div className="actions">
        <button className="large" onClick={props.openCategories} disabled={props.loading ? true : null}>create categories</button>
        <button className="large" onClick={props.openData} disabled={props.loading ? true : null}>draw data</button>
      </div>
    </nav>
  )
}

export default EditPanelNav;