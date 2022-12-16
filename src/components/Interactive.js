import React from "react";
import CategoriesDialog from "./CategoriesDialog";
import NetworkDiagram from "./NetworkDiagram";
import EditPanel from "./EditPanel";
import ViewPanel from "./ViewPanel";
import Toolbar from "./Toolbar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

class Interactive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: 0,
      onboarding: true,
      sessionName: "",
      sessionID: null,
      activeListElement: null,
      allCategories: [],
      sessions: [],
      brush: 1,
      yourCategories: []
    };
  }

  componentDidMount() {
    fetch("/api/getCategories", {})
      .then(res => res.json())
      .then(categories => {
        fetch("/api/getSessions", {})
          .then(res => res.json())
          .then(sessions => {
            this.setState({
              allCategories: categories,
              sessions: sessions
            });
          });
      });
  }

  changeEditMode(mode) {
    this.setState({ editMode: mode });
  }

  addYourCategories(name, description, relabelID, relabel) {
    this.setState({
      yourCategories: [{
        name: name,
        relabel: relabel,
        description: description,
        relabelID: relabelID,
        id: null
      }, ...this.state.yourCategories]
    })
  }
  
  setStart(name){
    this.setState({
      sessionName:name,
      onboarding:false,
      yourCategories:[]
    })
  }
  

  setActiveListElement(id){
    this.setState({
      activeListElement:id
    })

  }
  
  async addLabelDatabase(categoryIndex,shapes){
    console.log(shapes);
    let options={
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    let sessionID = this.state.sessionID;
    let categoryID = this.state.yourCategories[categoryIndex].id;
    
    if(sessionID === null){
      //Go and add a session to get an new ID
      let data = {
        location: this.state.sessionName
      }
      
      let response = await fetch('/api/addSession', {...options,body:JSON.stringify(data)});
      let resjson = await response.json();
      sessionID = resjson.id;
      this.setState({sessionID:sessionID});
    }
    if(categoryID === null){
      // Go and get a category ID if it doesn't already exist
      let data = {
        name: this.state.yourCategories[categoryIndex].name,
        description: this.state.yourCategories[categoryIndex].description,
        relabel: this.state.yourCategories[categoryIndex].relabelID,
        session: sessionID
      }
      let response = await fetch('/api/addCategory', {...options,body:JSON.stringify(data)});
      let resjson = await response.json();
      categoryID = resjson.id;
      
      let newYour = [...this.state.yourCategories];
      newYour[categoryIndex] = {...this.state.yourCategories[categoryIndex],id:categoryID};
      this.setState({yourCategories: newYour})
    }
    
    // Now Add all the Labels
    // await Promise.all(shapes.map(s => {
    //   let data = {
    //     category: categoryID,
    //     type: s.type,
    //     shape: s.path,
    //     width: s.width,
    //     height: s.height,
    //     x: s.x,
    //     y: s.y
    //   }
    //   return fetch("./api/addLabel", {...options,body:JSON.stringify(data)})
    // }))
    
    for(let i=0; i< shapes.length; i++){
      let data = {
        category: categoryID,
        type: shapes[i].type,
        shape: shapes[i].path,
        width: shapes[i].width,
        height: shapes[i].height,
        x: shapes[i].x,
        y: shapes[i].y
      }
      await fetch("./api/addLabel", {...options,body:JSON.stringify(data)})
    }
    
    // And Finally Update Your State with the New Values
    fetch("/api/getCategories", {})
      .then(res => res.json())
      .then(categories => {
        fetch("/api/getSessions", {})
          .then(res => res.json())
          .then(sessions => {
            console.log(sessions);
            this.setState({
              allCategories: categories,
              sessions: sessions,
            });
          });
      });
    
  }
  

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <main>
          <div className="panelContainer">
            {!this.state.onboarding &&
              <CategoriesDialog
              editMode={this.state.editMode}
              categories={this.state.yourCategories}
            />
            }
            {<NetworkDiagram data={this.state.allCategories} />}
            {this.state.editMode === 1 && <Toolbar setBrush={(b) => this.setState({brush:b})} brush={this.state.brush} />}
            <EditPanel
              handleEditMode={mode => this.changeEditMode(mode)}
              editMode={this.state.editMode}
              categories={this.state.allCategories}
              addYourCategories={(name, description, relabelID, relabel) =>
                this.addYourCategories(name, description, relabelID, relabel)
              }
              setActiveListElement={(id) => this.setActiveListElement(id)}
              brush={this.state.brush}
              newStart={(name) => this.setStart(name)}
              restart={() => this.setState({onboarding:true})}
              onboarding={this.state.onboarding}
              sessionName={this.state.sessionName}
              addLabelDatabase={(catIndex,shapes) => this.addLabelDatabase(catIndex, shapes)}
              demo={this.state.sessionName.includes("demo")}
            />
            <ViewPanel
              categories={this.state.allCategories}
              sessions={this.state.sessions}
              active = {this.state.activeListElement}
            />
          </div>
        </main>
      </DndProvider>
    );
  }
}

export default Interactive;
