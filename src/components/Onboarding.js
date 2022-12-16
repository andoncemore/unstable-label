import React from "react";
import "./Onboarding.css";
import WrappedMap from "./Map";
import SourceDropdown from "./stateless/SourceDropdown";
import Draggable from "react-draggable";
import HelpTip from "./stateless/HelpTip";

class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: false,
      dropdownOpen: false,
      inputSource: "",
      mapName: ""
    };
  }

  render() {
    if (this.state.map) {
      return (
        <div className="onboarding">
          <WrappedMap
            setLocation={loc => this.props.updateLocation(loc)}
            initialLocation={this.props.initialLocation}
            googleMapURL={
              "https://maps.googleapis.com/maps/api/js?key=AIzaSyDz-wPsGB_lG2dyNjUmHnR97jzA4QCZeF4&libraries=geometry,drawing,places"
            }
            loadingElement={<div style={{ height: "100%" }} />}
            containerElement={
              <div className="map" />
            }
            mapElement={<div style={{ height: "100%" }} />}
          />
          <Draggable bounds=".panelContainer">
            <div className="sessionStart">
              <div className="instructions">
                <div>
                  <h2
                    style={{
                      display: "inline-block",
                      marginRight: "4px",
                      marginBottom: "4px"
                    }}
                  >
                    Choose a Location
                  </h2>
                  <HelpTip
                    title="Picking a Location"
                    text="Chose a location that is meaningful"
                  />
                </div>
                <p>
                  Put the marker on a location that you would like to explore
                  and collect from. Choose some place that is meaningful to you
                </p>
              </div>
              <input
                placeholder="Give the location a name (eg. Fenway)"
                value={this.state.mapName}
                onChange={e => this.setState({ mapName: e.target.value })}
              />
              <button
                className="large"
                disabled={this.state.mapName === "" ? true : null}
                onClick={() => this.props.startEditing(this.state.mapName)}
              >
                Go
              </button>
            </div>
          </Draggable>
        </div>
      );
    } else {
      return (
        <div className="onboarding">
          <div className="contributing"><a href="#slide0">start contributing</a></div>
          <div className="slide home" id="slide0">
            <h1>Unstable <span style={{textDecoration:"line-through"}}>Label</span></h1>
            <h4>A collective process of building a machine learning algorithm that creates spaces for contesting meaning rather than spaces of efficiency and optimization.</h4>
            <h5>* works best on desktop Chrome or Safari</h5>
            <div className="start">
              <SourceDropdown
                open={this.state.dropdownOpen}
                choice={this.state.inputSource}
                updateChoice={c =>
                  this.setState({ inputSource: c, dropdownOpen: false })
                }
                toggle={() =>
                  this.setState({
                    dropdownOpen: !this.state.dropdownOpen
                  })
                }
              />
              <button
                disabled={this.state.inputSource === "" ? true : null}
                className="large"
                onClick={() => this.setState({ map: true })}
              >
                get started
              </button>
            </div>
            <div className="walkthrough">
              <a href="#slide1">or start with a walkthrough <i className="fas fa-long-arrow-alt-right" style={{marginLeft:"6px"}}></i></a>
            </div>
          </div>
          <div className="walk" id="slide1">
            <h2>Choosing a Data Source <a href="#slide2"><i className="fas fa-arrow-right fa-xs"></i></a></h2>
            <p>Start by loading the source dataset that you would like to label. In the future, you will be able to load image data from your own local data collection devices. For the purposes of this prototype, the only option is to use Google Street View. </p>
            <p>Use the search box to find a personally relevant location to start collecting from. Then, give that location a name to start contributing.</p>
            <div className="walkthroughImages two">
              <img src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2FFrame%204.png?v=1595202271480" />
              <img src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2FFrame%206.png?v=1595202304932" />
            </div>
          </div>
          <div className="walk" id="slide2">
            <h2><a href="#slide1"><i className="fas fa-arrow-left fa-xs"></i></a> Layout and Navigation <a href="#slide3"><i className="fas fa-arrow-right fa-xs"></i></a></h2>
            <p>Within the App, there are two major panels. The data creation panel on the left, allows you to navigate through the selected google street view location. After finding an image, use the buttons at the top to create categories, and then draw data to add to the model.</p>
            <p>The right panel is a displays all the data that has informed the model thus far. You can filter and read through data from specific locations, or related to specific categories. </p>
            <div className="walkthroughImages">
              <img src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2FUntitled_Artwork.png?v=1595211513685" />
            </div>
          </div>
          <div className="walk" id="slide3">
            <h2><a href="#slide2"><i className="fas fa-arrow-left fa-xs"></i></a> Creating Categories <a href="#slide4"><i className="fas fa-arrow-right fa-xs"></i></a></h2>
            <p>After clicking on the create categories button, an overlay will appear, loading the current model's labeled predictions of the image. Create categories by clicking on any one of the labels to relabel it using the dialog box. Created categories are added to "your categories dialog" for later use.</p>
            <p>The process of creating categories isn't about "correcting the algorithm." It's about bringing your personal, local stories to the dataset. Typically, this process of category creation is a conversation amongst a small group, with the existing label acting as a discussion prompt.</p>
            <p>What experiences does the label remind you of? What stories does the label make you think of?</p>
            <div className="walkthroughImages">
              <img src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2FFrame%209.png?v=1595213160558" />
            </div>
          </div>
          <div className="walk" id="slide4">
            <h2><a href="#slide3"><i className="fas fa-arrow-left fa-xs"></i></a> Drawing Data <a href="#slide5"><i className="fas fa-arrow-right fa-xs"></i></a></h2>
            <p>After creating at least one category, you can click on the draw data button to create data to inform the model. Drag and drop categories from the "your categories" dialog. Then annotate the image by drawing boxes around things you want to label. Once you are done, click submit to add the data to the model.</p>
            <p>There are two brush options: label and imagine. As you are annotating, don't feel restricted to label the image as it exists today. Instead, use the "imagine" brush to draw things as you wish it existed.</p>
            <div className="walkthroughImages">
              <img src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2FFrame%208.png?v=1595213141485" />
            </div>
          </div>
          <div className="walk" id="slide5">
            <h2><a href="#slide4"><i className="fas fa-arrow-left fa-xs"></i></a> Exploring the Model</h2>
            <p>After submitting data, it will be added to the model list on the right panel. To explore further, you can filter data by location collected, or by clicking on any category, you can see any of the related categories.</p>
            <p>You can also explore the existing model via the network diagram overlaid ontop of the entire interface. It spatially displays the relationship between all the categories. Hover over any node to see category names, and click to see associated descriptions and stories.</p>
            <div className="walkthroughImages">
              <img src="https://cdn.glitch.com/34ca575e-f2f2-482d-8ef3-97bf7d5f4b40%2FFrame%2010.png?v=1595213293225" />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Onboarding;
