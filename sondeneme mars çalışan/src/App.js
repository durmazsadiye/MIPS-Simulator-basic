import React, { Component } from "react";
import "./App.css";
import IDE from "./Views/IDE";
import Registers from "./Views/Registers";
import Memory from "./Code/Memory";

class App extends Component {
  state = { toggle: false };
  toggleView = () => {
    this.setState((state) => ({ toggle: !state.toggle }));
  };
  render() {
    return (
      <div id="App">
        <IDE toggleView={this.toggleView} />
        {/* <Registers /> */}
        {!this.state.toggle ? <Registers /> : ""}
        <Memory />
      </div>
    );
  }
}

export default App;
