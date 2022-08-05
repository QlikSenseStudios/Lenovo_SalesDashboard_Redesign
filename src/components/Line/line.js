import React, { useRef, useEffect, useMemo, useState } from "react";
import * as d3 from "d3";

const margin = { top: 20, right: 10, bottom: 20, left: 20 };

const Line = ({
  data,
  width,
  height,
  refLine,
  title,
  upperTarget,
  lowerTarget,
  colorTheme = "black",
  //colorTheme,
}) => {
  
  const [d3Data, setD3Data] = useState({});

  const yAxisRef = useRef();
  const xAxisRef = useRef();
  const svgRef = useRef();
  const lineRef = useRef();
  const refLineRef = useRef();
  const circleRef = useRef();

  const urlRoot = window.location.href.slice(
    0,
    window.location.href.lastIndexOf("/")
  );

  useEffect(() => {
    let debug = false;
    const referenceLineData = refLine ? [upperTarget, lowerTarget] : null;

    if(debug)
    console.debug("reflineData",referenceLineData);
    
    const latestPointData = refLine ? data[data.length - 1] : null;

    if(debug)
    console.log("last DataPoint",latestPointData);
    

    const refLineMax = refLine ? d3.max(referenceLineData) : null;
    const refLineMin = refLine ? d3.min(referenceLineData) : null;

    setD3Data({
      referenceLineData: referenceLineData,
      latestPointData: latestPointData,
      refLineMax: refLineMax,
      refLineMin: refLineMin,
      data: data,
    });
  }, [data, refLine, upperTarget, lowerTarget]);

  const xScale = useMemo(() => {
    if (width !== undefined) {
      var x = d3
        .scalePoint()
        .domain([...d3Data.data.map((d) => d[1].qNum)])
        .range([margin.left, width - margin.right]);

      return x;
    }
  }, [width, d3Data.data]);
  const yScale = useMemo(() => {
    if (height !== undefined) {
      var yMax = d3.max(d3Data.data, (d) => d[2].qNum + 1);
      var yMin = d3.min(d3Data.data, (d) => d[2].qNum);
      var y = d3
        .scaleLinear()
        .domain([Math.min(yMin, 0), (d3Data.referenceLineData && d3Data.referenceLineData[0] > yMax ) ? d3Data.referenceLineData[0] + 1 : yMax])
        .range([height - margin.bottom, margin.top]);

      return y;
    }
  }, [height, d3Data.data, d3Data.referenceLineData]);

  useEffect(() => {
    if (width && height !== 0) {
      var xMin = d3.min(d3Data.data, (d) => d[1].qNum);

      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale).ticks(5);

      //line
      const lineFunction = d3
        .line()
        .x((d, i) => xScale(d[1].qNum))
        .y((d, i) => yScale(d[2].qNum));

      const gPath = d3
        .select(lineRef.current)
        .selectAll(".lineSVG")
        .data([d3Data.data]);

      gPath.exit().remove();

      gPath
        .enter()
        .append("path")
        .attr("stroke-width", 2)
       .attr("stroke", "#ff6a00") //orange
       // .attr("stroke", "#F04187") // megenta
      //  .attr("stroke", "#FF7675") // red

        .attr("fill", "none")
        .merge(gPath)
        .classed("lineSVG", true)
        .attr("d", lineFunction);

      //ref line
      if (refLine) {
        const gRefline = d3
          .select(refLineRef.current)
          .selectAll(".refLine")
          .data(d3Data.referenceLineData);
        gRefline.exit().remove();
        gRefline
          .enter()
          .append("line")
          .attr("stroke-width", 2)
          .attr("stroke", colorTheme)
          .classed("refLine", true)
          .merge(gRefline)
          .attr("x1", xScale(xMin))
          .attr("x2", width)
          .attr("y1", yScale(d3Data.referenceLineData[0]))
          .attr("y2", yScale(d3Data.referenceLineData[0]));

        d3.select(refLineRef.current)
          .append("line")
          .attr("stroke-width", 2)
          .attr("stroke", colorTheme)
          .merge(gRefline)
          .classed("refLine", true)
          .attr("x1", xScale(xMin))
          .attr("x2", width)
          .attr("y1", yScale(d3Data.referenceLineData[1]))
          .attr("y2", yScale(d3Data.referenceLineData[1]));
      }

      //symbols
      const gSymbol = d3
        .select(circleRef.current)
        .selectAll(".circle")
        .data(d3Data.data);

      gSymbol.exit().remove();

      gSymbol
        .enter()
        .append("circle")
        .attr("stroke", "#ff6a00")
        .attr("fill", "#ff6a00")
        // .attr("stroke", "#F04187") // megenta
        // .attr("fill", "#F04187") //megenta
        // .attr("stroke", "#FF7675") // red
        // .attr("fill", "#FF7675")//red
        .attr("stroke-width", 2)
        .attr("r", 3)
        .merge(gSymbol)
        .classed("circle", true)
        .attr("opacity", (d) => {
          if (d[2].qNum === "NaN") {
            return "0";
          } else {
            return "1";
          }
        })
        .attr("cx", (d) => xScale(d[1].qNum))
        .attr("cy", (d) => yScale(d[2].qNum));
      //image !
      if (
        (refLine === true &&
          d3Data.latestPointData[2].qNum > d3Data.refLineMax) ||
        (refLine === true && d3Data.latestPointData[2].qNum < d3Data.refLineMin)
      ) {
        const gWarningImage = d3
          .select(svgRef.current)
          .selectAll(".warning_image")
          .data(d3Data.latestPointData);

        gWarningImage.exit().remove();

        gWarningImage
          .enter()
          .append("image")
          .attr("xlink:href", `${urlRoot}/images/mark-warning.svg`)
          .attr("width", 20)
          .attr("height", 28.5)
          .merge(gWarningImage)
          .attr("x", xScale(d3Data.latestPointData[1].qNum) - 10)
          .attr("y", () => {
            if (d3Data.latestPointData[2].qNum > d3Data.refLineMax) {
              return yScale(d3Data.latestPointData[2].qNum) + 5;
            } else return yScale(d3Data.latestPointData[2].qNum) - 35;
          })
          .classed("warning_image", true);

        const gText = d3
          .select(svgRef.current)
          .selectAll(".warning_text")
          .data(d3Data.latestPointData);

        gText.exit().remove();

        gText
          .enter()
          .append("text")
          .text(`${d3Data.latestPointData[2].qNum}`)
          .attr("font-size", "15px")
          .attr("font-weight", "bold")
          .attr("stroke", "black")
          .attr("stroke-width", "0.2px")
          .merge(gText)
          .attr("x", xScale(d3Data.latestPointData[1].qNum) - 30)
          .attr("y", () => {
            if (d3Data.latestPointData[2].qNum > d3Data.refLineMax) {
              return yScale(d3Data.latestPointData[2].qNum) + 25;
            } else return yScale(d3Data.latestPointData[2].qNum) - 15;
          })
          .attr("fill", colorTheme)
          .classed("warning_text", true);
      }
      //axis
      d3.select(xAxisRef.current)
        .call(xAxis)
        .attr("transform", `translate(0,${height - margin.bottom})`);

      d3.select(yAxisRef.current)
        .call(yAxis)
        .attr("transform", `translate(${margin.left}, 0)`);

      d3.select(yAxisRef.current)
        .selectAll("line")
        .attr("x2", width - margin.left)
        .attr("stroke-dasharray", "2.2");
    }
  }, [d3Data, refLine, width, height, urlRoot, colorTheme, xScale, yScale]);
  return (
    <div className="d3-line-container">
       <div className="utilization_container">
            <div style={{ height: "10%" }} className={`subtitle`}>
              {title}
            </div>
            <svg
              ref={svgRef}
              style={{
                width: "100%",
                height: "100%",
              }}
              className="svg"
            >
              <g ref={yAxisRef} className="yAxis"></g>
              <g ref={xAxisRef} className="xAxis"></g>
              <g ref={lineRef} className="lineG"></g>
              <g ref={refLineRef} className="refLineG"></g>
              <g ref={circleRef} className="circleG"></g>
            </svg>
      </div>
    </div>
  );
};

export default Line;
