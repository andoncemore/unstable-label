import React from 'react'
import './HelpTip.css'

function HelpTip({title, text}){
  return(
    <div className="helptip">
      <span className="icon">?</span>
      <span className="helptext"><b>{`${title}: `}</b>{text}</span>
    </div>
  )
}

export default HelpTip;