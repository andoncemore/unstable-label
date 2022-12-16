import React from "react";
import simplify from "simplify-js";

class SVGLabel extends React.Component {

  drawShapePath(points, scalingX, scalingY) {
    let scaled = points.map(p => ({ x: p.x * scalingX, y: p.y * scalingY }));
    let simplified = simplify(scaled, 8, false);

    //     Draw Normal
    // let path = `M ${scaled[0].x} ${scaled[0].y}`;
    // for(let i=1; i<points.length; i++){
    //   path += ` L ${scaled[i].x} ${scaled[i].y}`;
    // }
    // path += " Z";

    //     Draw Simplified
    let path = `M ${simplified[0].x} ${simplified[0].y}`;
    for (let i = 1; i < simplified.length; i++) {
      path += ` L ${simplified[i].x} ${simplified[i].y}`;
    }
    path += " Z";

    //     Draw Simplest
    // let simp = `M ${simplified[0].x / scalingX} ${simplified[0].y / scalingY}`;
    // for (let i = 1; i < simplified.length; i++) {
    //   simp += ` L ${simplified[i].x / scalingX} ${simplified[i].y / scalingY}`;
    // }
    // simp += " Z";
    // console.log(simp);
    // console.log(this.props.width * 100, this.props.height * 100);
    // console.log(this.props.x * 100, this.props.y * 100);

    return path;
  }

  render() {
    return (
      <svg
        width={this.props.width * this.props.drawWidth}
        height={this.props.height * this.props.drawWidth}
        style={{
          left: `${this.props.x * this.props.drawWidth}px`,
          top: `${this.props.y * this.props.drawWidth}px`
        }}
      >
        <path
          className="svglabel"
          d={this.drawShapePath(
            this.props.points,
            this.props.drawWidth * this.props.width,
            this.props.drawWidth * this.props.height
          )}
          fill={
            this.props.brush === 0
              ? "transparent"
              : this.props.selected
              ? "var(--green-teal)"
              : "#E2E2E2"
          }
          stroke={
            this.props.selected
              ? this.props.brush === 0
                ? "var(--green-teal)"
                : "#52E8B2"
              : "#E2E2E2"
          }
        />
      </svg>
    );
  }
}

export default SVGLabel;
