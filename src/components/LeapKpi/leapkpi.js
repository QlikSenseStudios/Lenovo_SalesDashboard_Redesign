import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useResizeObserver from "../../hooks/useResizeObserver";

/**
 * Component that renders a StackedBarChart
 */

function LeapKpi({ data, keys, colors}) {
 // console.log("Leap");

  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

    // stacks / layers
    const stackGenerator = d3.stack()
      .keys(keys)
      .order(d3.stackOrderAscending);
    const layers = stackGenerator(data);

    const extent = [
      0,
        (d3.max(layers, layer => d3.max(layer, sequence => sequence[1]) * 1.40) > 0)? d3.max(layers, layer => d3.max(layer, sequence => sequence[1]) * 1.40) : 500
    ];

    // scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.points))      
      .range([0, width])
      .padding(0.25);

    const yScale = d3.scaleLinear()
      .domain(extent)
      .range([height, 0]);

    // rendering
    svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", layer => colors[layer.key])
      .selectAll("rect")
      .data(layer => layer)
      .join("rect")
      .attr("x", sequence => xScale(sequence.data.points))
      .attr("width", xScale.bandwidth())
      .attr("y", sequence => yScale(sequence[1]))
      .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]) );

    // axes
    const xAxis = d3.axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale)
    .ticks(4)
    .tickSize(-width,0,10).tickSizeOuter(0);        
    // tickValues(yScale.ticks(2).concat(yScale.domain()));
    svg.select(".y-axis").call(yAxis)

  }, [colors, data, dimensions, keys]);  
   

  const values = Object.entries(colors);

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}  height={110}>
          <g className="x-axis" />
          <g className="y-axis" />        
        </svg>       
      </div> 
      <div id="leapkpi-legend">   
      <div className="leapkpi-legend">         
            { 
            
            values.map((value, index) => {
              return (<React.Fragment key={index}>
                {index >= 1 && <br></br>} <span className={"key-dot"} style={{ background: value[1] }} />  { value[0] } </React.Fragment>)                
            })
            }        
      </div>
      </div>
      </React.Fragment>
  );
}

export default LeapKpi;