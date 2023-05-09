import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { endsWith, floor } from "lodash";

const margin = { top: 10, right: 15, bottom: 30, left: 10 };

const Bar = ({
  value,
  target,
  targetRounded,
  tierName,
  currency,
  title,
  width,
  height,
}) => {
  const xAxisRef = useRef();
  const rectRef = useRef();
  const lineRef = useRef();
  const textRef = useRef();
  // const [isExecded, setExeceded] = useState(false);
  // const [barValue, setbarValue] = useState(value);
  const [x, setx] = useState(0);

  var Title_y = 40;

  // if(window.innerWidth > 1400){
  //   height=250;
  //  // Title_y= 40;
  // }
  if (window.innerWidth < 1200) {
    // alert(window.innerWidth)
    height = 200;
    //  Title_y= 40;
  }
  if (window.innerWidth < 1200) {
    // alert(window.innerWidth)
    height = 210;
    //  Title_y= 40;
  }
  if (window.innerWidth < 769) {
    // alert(window.innerWidth)
    height = 170;
    Title_y = 15;
  }

  const xMaxlimit = d3.max([
    Number(value) > Number(target) ? Number(value) : Number(target),
  ]);

  const xScale = useMemo(() => {
    if (width !== undefined) {
      //const xMaxlimit = d3.max([barValue, target]);

      // const xMaxlimit = d3.max([
      //   Number(value) > Number(target) ? Number(value) : Number(target),
      // ]);

      // console.log("barValue", value);
      // console.log("xMaxlimit", xMaxlimit);

      //const xMax = xMaxlimit * 1.2;
      //if target is grater than 1 million change the max value
      //  const xxMax = (target > 1000000)? xMax * 2 : xMax * 1.2;
      // const xMax =(target > 10000000)? xMaxlimit * 20 : xMaxlimit * 2;
      // const xMax =
      //   target > 1000000
      //     ? target > 10000000
      //       ? xMaxlimit * 20
      //       : xMaxlimit * 2
      //     : xMaxlimit * 1.2;

      const xMax = target > xMaxlimit ? xMaxlimit * 2 : xMaxlimit;

      // console.log("xMax", xMax);

      const x = d3
        .scaleLinear()
        // .domain([0, xMaxlimit * 1.2])
        .domain([0, xMax])
        .range([margin.left, width - margin.right]);

      // if (barValue > xMax) {
      //   if (barValue > xMax) {
      //   //value = xMax;
      //   setbarValue(xMax);
      //   setExeceded(true);
      // }

      return x;
    }
  }, [width, value, target]);

  useEffect(() => {
    if (width !== undefined) {
      var xAxis = d3.axisBottom(xScale).ticks(3).tickFormat(d3.format(".2s"));
      if (window.innerWidth < 769) {
        xAxis = d3.axisBottom(xScale).ticks(2).tickFormat(d3.format(".2s"));
      }

      // console.log(xAxisRef.current);
      d3.select(xAxisRef.current).call(xAxis);
    }
  }, [xScale, width]);

  function kFormatter(number) {
    //  console.log("number", number);
    // return Math.abs(number) > 999
    //   ? Math.sign(number) * (Math.abs(number) / 1000).toFixed(1) + "k"
    //   : Math.sign(num) * Math.abs(num);
    if (number < 1000) {
      return number;
    } else if (number >= 1000 && number < 1_000_000) {
      return (number / 1000).toFixed(1) + "K";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
      return (number / 1_000_000).toFixed(1) + "M";
    } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
      return (number / 1_000_000_000).toFixed(1) + "B";
    } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
      return (number / 1_000_000_000_000).toFixed(1) + "T";
    }
  }

  var lblValueXScale = 0;
  if (xScale && xMaxlimit) {
    // console.log("---");
    // console.log("Target", target);
    // console.log("barValue", value);
    // console.log("xMaxlimit", xMaxlimit);
    // console.log("diff", target - value);

    // console.log("x", xScale(value) - margin.left * 0.8);
    // console.log("lne x", xScale(target));
    // console.log("d", xScale(value) - margin.left * 0.8 - xScale(target));

    //difference between the refline(target) x and the value
    var xScaleDif = Math.abs(
      xScale(value) - margin.left * 0.8 - xScale(target)
    );
    //console.log(xScaleDif);

    lblValueXScale = xScale(value) - margin.left * 0.8;
    // lblValueXScale = margin.right;

    if (xScaleDif < 50) {
      lblValueXScale = margin.right;
      //lblValueXScale = xScale(target);
    }
    if (target - value == 0) {
      // lblValueXScale = xScale(value) / 3;
      lblValueXScale = xScale(value) - margin.left * 0.8;
    }
  }

  return (
    <>
      <svg
        width={"90%"}
        height={height}
        className="svg"
        style={{
          overflow: "visible",
          color: "black",
          paddingLeft: "10px",
          paddingTop: "10px",
        }}
      >
        {/* titles */}
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

        {/* subtitle */}
        <g>
          {width !== undefined && width > 0 ? (
            <text y={Title_y} fill="black" className="subtitle">
              {title}
            </text>
          ) : null}
        </g>

        {/* scale */}
        <g
          ref={xAxisRef}
          className="xAxisContainer"
          transform={`translate(0, ${height / 1.5})`}
        />

        {/* rect */}
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
            />
            <text
              y={height / 7}
              x={lblValueXScale}
              fill="black"
              className="subtitle"
            >
              {kFormatter(Math.trunc(value))}
            </text>
            <text
              y={height / 5}
              x={lblValueXScale}
              fill="black"
              className="subtitle"
            >
              {currency}
            </text>
          </g>
        ) : null}

        {/* ref line- target */}
        <g ref={lineRef} className="lineContainer">
          {width !== undefined && width > 0 ? (
            <line
              x1={xScale(target)}
              x2={xScale(target)}
              y1={height / 1.5}
              y2={height / 2.8}
              stroke="black"
              strokeWidth={"3px"}
            />
          ) : null}
        </g>

        {/* cut  */}
        {/* <g>
          <path
            d="M 10 0 L 34 60"
            stroke="red"
            stroke-width="4"
            transform={`translate(${width / 1.2}, ${height / 2.5} )`}
            display={isExecded ? "block" : "none"}
          />
        </g> */}
      </svg>
    </>
  );
};

export default Bar;
