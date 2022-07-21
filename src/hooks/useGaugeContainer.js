import { useEffect, useRef } from "react";
import * as d3 from "d3";


const twoPi = 2 * Math.PI;

//D3 code for gauge object
export default (data) => {
  //console.log("useGaugeContainer",data)
  const container = useRef();

  useEffect(() => {
    if (data !== null && data.note2Value !== "NaN") {
      var arc = d3.arc();

      //background circle
      var gContainerBackground = d3
        .selectAll(".background-container")
        .selectAll(".circle-max")
        .data([data]);

      gContainerBackground.exit().remove();

      gContainerBackground
        .enter()
        .append("path")
        .classed("circle-max", true)
        .attr(
          "d",
          arc({
            endAngle: twoPi * 0.75,
            startAngle: 0,
            innerRadius: 45,
            outerRadius: 45,
          })
        )
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", 1)
        .attr("transform", "translate(48,48) rotate(225)");

      //filled portion of the gauge
      var circleCurrentPath = d3
        .select(container.current)
        .selectAll(`.circle-current`)
        .data([data]);

      circleCurrentPath.exit().remove();

      circleCurrentPath
        .enter()
        .append("path")
        .classed(`circle-current`, true)
        .merge(circleCurrentPath)
        .attr("transform", "translate(48,48) rotate(225)")
        .attr("d", (d) => {
          if (d.note2Value < 0) {
            return arc({
              endAngle: 0,
              startAngle: 0,
              innerRadius: 45,
              outerRadius: 45,
            });
          } else
            return arc({
          //if d.note2Value > 1, which means target achived is higher that the target
         //make the guage 100%
              endAngle: twoPi * (d.note2Value> 1 ? 1 * 0.75 : d.note2Value  * 0.75), 
              startAngle: 0,
              innerRadius: 45,
              outerRadius: 45,
            });
        });
    }
  }, [data, container]);

  return container;
};
