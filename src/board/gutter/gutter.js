import "./gutter.css";
import React from "react";

class Gutter extends React.Component {
    render() {
      if (this.props.type === "vertical") {
        return <button className="gutter vertical">{/* TODO */}</button>;
      } else {
        return <button className="gutter horizontal">{/* TODO */}</button>;
      }
    }
  }

  export default Gutter;