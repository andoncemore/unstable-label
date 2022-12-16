import React from 'react';
import Interactive from './Interactive.js'
import HelpTip from './stateless/HelpTip'
import './App.css';


function App() {
  return (
    <React.Fragment>
      <header>
        <h4>Unstable Label</h4>
        <HelpTip title="Unstable Label" text="This is a speculative data labeling application created by Adit Dhanushkodi as a part of an MFA Thesis Project" />
      </header>
      <Interactive />
    </React.Fragment>
  );
}

export default App;
