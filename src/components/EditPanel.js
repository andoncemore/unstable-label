import React from 'react'
import CreateData from  './CreateData'
import CreateCategories from './CreateCategories'
import NavigateMap from './NavigateMap'
import Onboarding from './Onboarding'
import EditPanelNav from './EditPanelNav'
// import "./CreatePanel.css"

class EditPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      objectDetector: null,
      loading: true,
      mapLocation:{
        position:{lat: 42.345573,lng: -71.098326},
        pov:{pitch:34, heading:10},
        id:0
      },
      latestImage: false,
      staticMap: null
    }
  }
  
  componentDidMount(){
    
    window.ml5.objectDetector("yolo", {
      filterBoxesThreshold: 0.01,
      IOUThreshold: 0.4,
      classProbThreshold: 0.4
    }).then(res => {
      this.setState({loading:false, objectDetector:res});
      console.log(res);
    });
  }
  
  changeMode(mode){
    if(mode === this.state.editMode){
      this.props.handleEditMode(0);
    }
    else{
      this.props.handleEditMode(mode);
      if(mode !== 0){
        this.updateStaticImage()
      }
    }
  }
  
  async updateStaticImage(){
    if(!this.state.latestImage){
      let url = `https://maps.googleapis.com/maps/api/streetview?location=${this.state.mapLocation.position.lat},${this.state.mapLocation.position.lng}&size=640x640&source=outdoor&fov=75&heading=${this.state.mapLocation.pov.heading}&pitch=${this.state.mapLocation.pov.pitch}&key=AIzaSyDz-wPsGB_lG2dyNjUmHnR97jzA4QCZeF4`;
      let response = await fetch(url);
      // let arrayBuffer = await response.arrayBuffer()
      console.log(response);
      let blob_response = await response.blob();
      let im = URL.createObjectURL(blob_response)
      URL.revokeObjectURL(this.state.staticMap);
      this.setState({latestImage:true, staticMap:im})
    }
  }
  
  
  changeLocation(key,newLocation){
    console.log(newLocation);
    if(this.props.editMode === 0){
      let coords = {...this.state.mapLocation, [key]:newLocation};
      this.setState({
        mapLocation: coords,
        latestImage: false
      })
    }
  }
  
  render(){
    if(this.props.onboarding){
      return (
        <div id="createPanel" style={createPanelStyle}>
          <Onboarding
            startEditing={(sessionName) => this.props.newStart(sessionName)}
            updateLocation={(loc) => this.changeLocation("position",loc)}
            initialLocation={this.state.mapLocation.position}
            />
        </div>
      )
    }
    else{
      return(
        <div id="createPanel" style={createPanelStyle}>
          <EditPanelNav 
            location={this.props.sessionName}
            openCategories={() => this.changeMode(2)}
            openData={() => this.changeMode(1)}
            restart={() => this.props.restart()}
            loading={this.state.loading}
          />
          
          {<NavigateMap
            startingLocation={this.state.mapLocation}
            changeLocation={(key,value) => this.changeLocation(key,value)}
            />}
          {this.props.editMode === 1 &&
            <CreateData
              closePanel={() => this.changeMode(0)}
              isMapLatest={this.state.latestImage}
              staticMap={this.state.staticMap}
              brush={this.props.brush}
              addLabelDatabase={this.props.addLabelDatabase}
            />
          }
          {this.props.editMode === 2 &&
            <CreateCategories
              closePanel={() => this.changeMode(0)}
              isMapLatest={this.state.latestImage}
              staticMap={this.state.staticMap}
              categories={this.props.categories}
              objectDetector={this.state.objectDetector}
              addYourCategories={this.props.addYourCategories}
              setActiveList={this.props.setActiveListElement}
              demo={this.props.demo}
            />
          }  
        </div>
      ) 
    }
  }
}

const createPanelStyle = {
  gridArea: "data",
  position:"relative",
  display: "flex",
  flexFlow: "column nowrap"
}


export default EditPanel;
