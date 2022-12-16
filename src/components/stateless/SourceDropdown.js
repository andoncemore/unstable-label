import React from 'react'

function SourceDropdown({ open, choice, updateChoice, toggle}){
  
  return(
    <div onClick={toggle} className={`sourceDropdown ${open ? "active" : ""}`}>
      <h4 >{choice=== "" ? "Choose Input Source" : choice}</h4>
      {open &&
        <div className="results">
          <div className="disabled">
            <div className="image">
              <img alt="Neighborhood Surveyor" src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2Fwalking-stick.png?v=1587510741822" />
            </div>
            <div>
              <h4>Neighborhood Surveyor</h4>
              <h4>(Coming Soon)</h4>
            </div>
          </div>
          
          <div className="disabled">
            <div className="image">
              <img alt="Roaming View Shoes" src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2Froaming-shoes.png?v=1587510783731" />
            </div>
            <div>
              <h4>Roaming View Shoes</h4>
              <h4>(Coming Soon)</h4>
            </div>
          </div>
          
          <div className={choice === "Google Street View" ? "selected" : ""} onClick={() => updateChoice("Google Street View")}>
            <div className="image">
              <img alt="Google Street View" src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2Fstreetview.png?v=1587510765389" />
            </div>
            <div>
              <h4>Google Street View</h4>
            </div>
          </div>
          
        </div>
      }
    </div>
  )
  
}

export default SourceDropdown