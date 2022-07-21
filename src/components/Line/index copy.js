

import { line } from "d3";
import React, { useCallback, useRef } from "react";
import { useHyperCubeData, useChartSpec } from "../../hooks/index";
import Line from "./line";
import "./style.css";

export default ({ qDef: objDef, style = { width: "100%" }, colorTheme }) => {
  var objQid=null;
  console.log("Line qDef",objDef);
//  console.log(colorTheme);

 let row = objDef.filter((item)=> !isNaN(parseInt(item[15].qText))) // to eliminate week NUll - 
 .map((items)=>{
  return {pos:items[1].qText, //
          kpi_Val_type:items[4].qText,
          title:items[3].qText,
        //  val:items[12].qText,  //local value
          val:items[16].qText,      //value
          f_val:items[13].qText, //f_val
          lbl:items[14].qText,
          week: parseInt( items[15].qText),  //isNaN(items[15].qText)?0:
        }
  });
  
  //     console.log(row);
  // if(row.length<3)
  // console.error("Custom error", row);
  //console.table(row);
  console.table(row);



  const def = {
    qInfo: {
      qType: "app data",
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["quarter"],
            qSortCriterias: [
              {
                qSortByAscii: 1,
              },
            ],
          }
        },
        {
          qDef: {
            qFieldDefs: ["week_of_quarter"],
            qSortCriterias: [
              {
                qSortByAscii: -1,
              },
            ],
        
          }
        },
        {
          qDef: {
            qFieldDefs: ["position"],
          }
        },
        {
          qDef: {
            qFieldDefs: ["kpi_value_type"],
          }
        },
        {
          qDef: {
            qFieldDefs: ["kpi_label"],
          }
        },
        {
          qDef: {
            qFieldDefs: ["value"],
          },
        },
      ],
      qMeasures: [
      ],
      qInitialDataFetch: [{ qWidth: 6, qHeight: 10000 / 6 }],
    },
  };

  const { data = {} } = useHyperCubeData({
    def,
    dataTransformFunc: useCallback((qHyperCube) => {
      return qHyperCube.qDataPages[0].qMatrix.map(function(item) {
        return { "quarter":item[0].qText, 
                "week":item[1].qText, 
                "pos": item[2].qText, 
                "kpi_value_type" :item[3].qText, 
                "lbl" :item[4].qText, 
                "val": item[5].qText};
       });
    }, []),
  });
  
  var lines = null;
  if(data){
  lines = row.map(function(r){
   //console.log(r);
 let point = [{"qNum": parseInt(r.val)},{"qNum":parseInt(r.week) },{"qNum":parseInt(r.val)}]
 console.log(point)
  return point;
 });
}



// var lines = null;
// if(data && row.length){
// console.log(data);
//  console.log("HyD",data.filter((item)=> item.pos == row[0].pos))
//     lines = data.filter((item)=> item.pos == row[0].pos).map(function(r){
//              return  [{"qNum": parseInt(r.val)},{"qNum":parseInt(r.week) },{"qNum":parseInt(r.val)}];
//   })  
// }

var lineData= {
    title: row.find(o => o.kpi_Val_type === 'ACTUAL').lbl,
    lineChart:lines,
    upperTarget:100,
    lowerTarget:10
  }

  //set state with chart width
  const lineChartRef = useRef();
  //console.log(lineChartRef);
  const { width, height } = useChartSpec(lineChartRef, data);
  
  // const width = 218.1999969482422,
  // const height = 32.5500030517578

  var refLine;
  // if (objQid.length === 1) {
  //   refLine = false;
  // } else refLine = true;

  if (data !== null) {  
    return (
      <div style={style} ref={lineChartRef}>
        <Line
          title={lineData.title}
          data={lineData.lineChart}
          upperTarget={lineData.upperTarget}
          lowerTarget={lineData.lowerTarget}
          width={width}
          height={height}
          refLine={refLine}
          colorTheme={colorTheme}
        />
      </div>
    );
  } else return <div style="color:black">Loading...</div>;
};
