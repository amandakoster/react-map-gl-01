import React from "react";
import { BaseControl } from "react-map-gl";

export class CustomMarker extends BaseControl {
  _render() {
    const { longitude, latitude } = this.props;

    const [x, y] = this._context.viewport.project([longitude, latitude]);

    const markerStyle = {
      position: "absolute",
      background: "#fff",
      left: x,
      top: y,
    };

    return (
      <div ref={this._containerRef} style={markerStyle}>
        ({longitude}, {latitude})
      </div>
    );
  }
}

export default CustomMarker;
