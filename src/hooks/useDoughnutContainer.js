import { useEffect, useRef } from "react";
import * as d3 from "d3";


//const twoPi = 2 * Math.PI;

function nFormatter(num) {
  if (num >= 999999999) {
     return ((Math.abs(num) / 1000000000).toFixed(1) + 'B');
  }
  if (num >= 999999) {
   return  ((Math.abs(num) / 1000000).toFixed(1) + 'M');
  }
  if (num >= 999) {
     return ((Math.abs(num) / 1000).toFixed(1) + 'K');
  }
  return Math.sign(num)*Math.abs(num);
}

//D3 code for gauge object
export default (data) => {
 // console.log(data)
 // console.log("useGaugeContainer",data)
  const container = useRef();

  // var createPie = d3
  // .pie()
  // .sort(null) 
  // .startAngle(1.1*Math.PI)
  // .endAngle(3.1*Math.PI)  
  // .value(d => d.value);

  

  // const createArc = d3
  // .arc()
  // .innerRadius(radius)
  // .outerRadius(radius-15);
 

  // const colors = d3.scaleOrdinal(d3.schemeCategory10);"#FFB43D"
  //var colors = ["#FF6A00","#8246AF","#F04187"   ]; 
  //var colors =  ["#FF6A00","#3e4b55","#0099e6"]; 
  var colors = ["#FF7675","#8246AF","#F04187"];

  //const format = d3.format(".2f");

  useEffect(() => {
    // let s= generateData()
    // console.log(s);
    var radius = 30;
    var transformx = 10;
    var transformy = 45;
    var totalFontSize = "10px";
  
    if(window.innerWidth > 1500){
      radius = 30;
      transformx =10;
      transformy =45;
    }
  
    if(window.innerWidth < 1300){
      // alert(window.innerWidth)
       radius = 30;
       transformx = 40;
       transformy =30;
     }
    if(window.innerWidth < 1200){
     // alert(window.innerWidth)
      radius = 28;
      transformx = 40;
      transformy =25;
    }
    if(window.innerWidth < 1100){
      // alert(window.innerWidth)
       radius = 25;
       transformx = 45;
       transformy =25;
     }
    if(window.innerWidth < 770){
      //alert(window.innerWidth)
       radius = 25;
       transformx = 45;
       transformy =25;
       totalFontSize = "8px"
    }
      if (data !== null) {

                  const group = d3.select(container.current);

                  var Tooltip = group.select(".toolTipContainer")
                  .append("div")
                  .style("opacity", 0)
                  .attr("class", "tooltip")
                  .style("background-color", "white")
                  .style("border", "solid")
                  .style("border-width", "2px")
                  .style("border-radius", "5px")
                  .style("padding", "5px")
                  .style("z-index","200");

                  //group.select("svg").
                  const groupWithData = group.select("svg").selectAll("g.arc").data(data);
                  groupWithData.exit().remove();

                   var chart = group.select("svg");
                 //  var chart = group

                    var arc = d3.arc()
                    .innerRadius(radius)
                    .outerRadius(radius-8);  //8

                    var pie = d3.pie()
                        .sort(null)
                        .startAngle(1.1*Math.PI)
                        .endAngle(3.1*Math.PI)
                        .value(function(d) { return d.value });

                     var mouseover = function(d) {
                      // console.log(Tooltip);
                      // console.log(container.current)
                      Tooltip
                        .style("opacity", 1)
                    }

                    var mousemove = function(d) {
                      // console.log(d3.event)
                      //console.log(d.value)
                      Tooltip
                        .html(d.value)
                        .style("top",(d3.event.offsetY)+"px").style("left",(d3.event.offsetX)+"px");
                    }

                    var mouseleave = function(d) {
                      Tooltip
                        .style("opacity", 0)
                    }
                  
                  var g = chart.selectAll(".arc")
                    .data(pie(data))
                    .enter().append("g")
                    .attr("transform",  "translate("+transformx+","+transformy+")")
                    .attr("class", "arc")
                
                    
                    g.append("path")
                    .style("fill",(d, i) => colors[i])
                    // .on("mouseover", mouseover)
                    // .on("mousemove", mousemove)
                    // .on("mouseleave", mouseleave)
                    .transition().delay(function(d, i) { return i * 200; }).duration(500)
                    .attrTween('d', function(d) {
                        var i = d3.interpolate(d.startAngle+0.0, d.endAngle);
                        return function(t) {
                            d.endAngle = i(t);
                          return arc(d);
                        }
                      
                  });

                  var total = d3.sum(data, d => d.value)

                  g.append("text")
                  // .attr("dx", function(d){return -20})
                  .text(function(){return nFormatter(total)})
                  .attr('text-anchor', 'middle')
                  .style('fill','#333f48')
                  .style('color','#333f48') 
                  .style('font-weight', '500')
                  .attr('y', radius * 0.16)
                  .style("font-size", totalFontSize)
                  //.style("stroke", "black")
                  // .style("stroke-width", "4")
                   
      
//https://d3-graph-gallery.com/graph/interactivity_tooltip.html
                      
                         
      }
        
  }, [data,container]); 



  return container;
};
