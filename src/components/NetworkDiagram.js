import React, { useRef, useEffect, useState } from "react";
import "./NetworkDiagram.css";
import * as d3 from "d3";

function NetworkDiagram({ data }) {
  const height = 100;
  const [width, setWidth] = useState(200)
  
  const mountPoint = useRef(null);
  const scrollRef = useRef(null);
  const scrollBox = useRef(null);
  
  useEffect(() => {
    function scrollPage(event){
      scrollRef.current.scrollLeft += event.deltaX;
    }
    
    window.addEventListener('wheel',scrollPage);
    
    return () => window.removeEventListener("wheel", scrollPage);
    
  })
  

  useEffect(() => {
    const vizData = formatData(data);
    const simulation = d3.forceSimulation()
                      .nodes(vizData.nodes)
                      .force("charge_force", d3.forceManyBody().strength(-2))
                      .force("center_force", d3.forceCenter(100,height/2))
                      .force("x_force", d3.forceY().y(height/2).strength(0.05))
                      .force("link_force", d3.forceLink(vizData.links).id(d => d.id).distance(12))
                      .stop();
                      
    simulation.tick(300);
    
    const min = d3.min(vizData.nodes, d => d.x)
    const simWidth =  d3.max(vizData.nodes, d => d.x) - min;
    if(!isNaN(simWidth)){
      setWidth(simWidth+20);
    }
    
    const svg = d3.select(mountPoint.current)
    
    const  tooltip = d3.select(scrollBox.current).append("div")
     .attr("class", "tooltip")
    
    
    const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(vizData.links)
            .enter().append("line")
            .attr("stroke-width",0.1)
            .style("stroke", "black")
            .attr('x1', d => d.source.x-min+10)
            .attr('y1', d => d.source.y)
            .attr('x2', d=> d.target.x-min+10)
            .attr('y2', d => d.target.y);
    
    
    const node = svg.append("g")
                  .attr("class", "nodes")
                  .selectAll("circle")
                  .data(vizData.nodes)
                  .enter().append("circle")
                  .attr("r", "1")
                  .attr("fill", "black")
                  .attr('cx', d => d.x-min+10)
                  .attr('cy', d => d.y)
                  .on('mouseover', function (d, i) {
                      tooltip.html(d.name)
                              .style("left", (d3.event.offsetX) + "px")
                              .style("top", (d3.event.offsetY) + "px");
                      d3.select(this).transition()
                       .duration('50')
                       .attr('fill', 'var(--blue)')
                       .style('opacity',1);
                      tooltip.transition()
                            .duration('50')
                            .style('opacity', 1);
                            
                  })
                  .on('mouseout', function (d,i) {
                    d3.select(this).transition()
                      .duration('50')
                      .attr('fill', 'black')
                      .style('opacity',0.8);
                    tooltip.transition()
                      .duration('50')
                      .style('opacity',0)
                  
                  });
    

    
//     simulation.on("tick", () => {
//       node
//         .attr('cx', (d) => d.x-min+10)
//         .attr('cy', d => d.y);
      
//       link
//         .attr('x1', d => d.source.x-min+10)
//         .attr('y1', d => d.source.y)
//         .attr('x2', d => d.target.x-min+10)
//         .attr('y2', d => d.target.y);
//     })
    
    return () => {node.remove(); link.remove(); tooltip.remove();}
    
  },[data]);

  function formatData(d) {
    let nodes = d.map(el => {
      return { id: el.id, name: el.name };
    });
    let nonBase = d.filter(el => el.relabel !== null);
    let links = nonBase.map(el => {
      return { source: el.id, target: el.relabel };
    });
    return {nodes:nodes,links:links};
  }

  return (
    <div id="networkDiagram" ref={scrollRef} >
      <div style={{width:`${width/100}vh`}} ref={scrollBox} className="scrollContainer">
        <svg viewBox={`0 0 ${width} ${height}`} height="100%" preserveAspectRatio="xMinYMin meet" ref={mountPoint}></svg>
      </div>
    </div>
  );
}

export default NetworkDiagram;
