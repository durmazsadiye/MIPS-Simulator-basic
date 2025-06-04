import React, { Component } from "react";
import Draggable from "react-draggable";

class Toolbar extends Component {
  render() {
    let elements = [];
    let items = this.props.items;

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      elements.push(
        <button
          style={{
            background: item.color ? item.color : "",
            border: "none",
            outline: "none",
            padding: "5px 10px",
            margin: "5px",
          }}
          key={`button-` + i}
          onClick={item.onClick}
        >
          {item.name}
        </button>
      );
    }

    return (
      <Draggable>
        <div
          className={"toolbar"}
          name={this.props.name || "toolbar"}
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: "10px",
            cursor: "move",
            zIndex: 1000, 
          }}
        >
          {elements}
        </div>
      </Draggable>
    );
  }
}

export default Toolbar;
