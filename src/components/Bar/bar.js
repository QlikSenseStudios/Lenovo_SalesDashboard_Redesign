import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";

const margin = { top: 10, right: 15, bottom: 30, left: 10 };

const Bar = ({
  value,
  target,
  targetRounded,
  tierName,
  title,
  width,
  height,
}) => {
  const xAxisRef = useRef();
  const rectRef = useRef();
  const lineRef = useRef();
  const textRef = useRef();

  var Title_y= 40;

 // if(window.innerWidth > 1400){
  //   height=250;
  //  // Title_y= 40;
  // }
  if(window.innerWidth < 1200){
    // alert(window.innerWidth)
    height=200;
  //  Title_y= 40;
   }
   if(window.innerWidth < 1200){
    // alert(window.innerWidth)
    height=210;
  //  Title_y= 40;
   }
   if(window.innerWidth < 769){
    // alert(window.innerWidth)
    height=170;
    Title_y= 15;
   }

   
  const xScale = useMemo(() => {
    if (width !== undefined) {
      const xMaxlimit = d3.max([value, target]);

      //const xMax = xMaxlimit * 1.2;
      //if target is grater than 1 million change the max value
    //  const xxMax = (target > 1000000)? xMax * 2 : xMax * 1.2;
     // const xMax =(target > 10000000)? xMaxlimit * 20 : xMaxlimit * 2;
      const xMax = (target > 1000000)? ((target > 10000000)? xMaxlimit * 20 : xMaxlimit * 2) : xMaxlimit * 1.2;

      const x = d3
        .scaleLinear()
      // .domain([0, xMaxlimit * 1.2])
       .domain([0,xMax])
        .range([margin.left, width - margin.right]);
      return x;
    }
  }, [width, value, target]);

  useEffect(() => {
   
    if (width !== undefined) {
      const xAxis = d3.axisBottom(xScale).ticks(2).tickFormat(d3.format(".2s"));
      d3.select(xAxisRef.current).call(xAxis);
    }
  
  }, [xScale, width]);
  return (
    <svg
      width={"90%"}
      height={height}
      className="svg"
      style={{ overflow: "visible", color:"black", paddingLeft:"30px", paddingTop:"10px" }}
    >
      <g>
        {width !== undefined && width > 0 ? (
          <text x={10} y={Title_y} fill="black" className="subtitle">
            {title}
          </text>
        ) : null}
      </g>
      <g
        ref={xAxisRef}
        className="xAxisContainer"
        transform={`translate(0, ${height / 1.5})`}
      />
      {width !== undefined && width > 0 ? (
        <g
          className="rectContainer"
          ref={rectRef}
          transform={`translate(${margin.left}, ${height / 2.5} )`}
        >
          <rect
            ref={rectRef}
            width={xScale(value) - margin.left}
            height={height / 4}
            className="rect"
            fill={"#ff6a00"} //orange
            //fill={"#F04187"} //megenta
            // fill={"#FF7675"} //red
          
          />
        </g>
      ) : null}
      <g ref={lineRef} className="lineContainer">
        {width !== undefined && width > 0 ? (
          <line
            x1={xScale(target)}
            x2={xScale(target)}
            y1={height / 1.5}
            y2={height / 3}
            stroke="black"
            strokeWidth={"2px"}
          />
        ) : null}
      </g>
      <g ref={textRef} className="textContainer">
        {width !== undefined && width > 0 ? (
          <text
            // x={xScale(target) - 70}
            y={height / 3 - 10}
            fill="black"
            className="subtitle"
          >
            {tierName} ({targetRounded})
          </text>
        ) : null}
      </g>
    </svg>
    
  );
};

export default Bar;
