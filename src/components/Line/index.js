import { isNull } from "lodash";
import React, { useCallback, useRef } from "react";
import { useHyperCubeData, useChartSpec } from "../../hooks/index";
import Line from "./line";
import "./style.css";
import { colorTheme } from "../../components/index";

//export default ({ qDef: objDef,style = { width: "100%" }, colorTheme }) => {
export default ({ qDef: objDef, tabName: tabName }) => {
  // console.log("Line qDef", objDef);
  // console.log("tabname", tabName);
  const style = { width: "100%" };
  //  console.log("colorTheme",colorTheme);
  // const colorTheme ="black";
  var debug = false;

  let row = objDef
    .filter((item) => !isNaN(parseInt(item[15].qText))) // to eliminate week NUll -
    .map((items) => {
      return {
        pos: items[1].qText, //
        kpi_Val_type: items[4].qText,
        title: items[3].qText,
        //  val:items[12].qText,  //local value
        val: items[16].qText, //value
        f_val: items[13].qText, //f_val
        lbl: items[14].qText,
        week: parseInt(items[15].qText), //isNaN(items[15].qText)?0:
      };
    });

  if (debug) {
    // console.log("row",row);
    if (row.length < 3) console.error("Custom error", row);
    console.table(row);
  }

  const def = {
    qInfo: {
      qType: "Line Chart",
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["quarter"],
            qSortCriterias: [
              {
                qSortByAscii: -1,
              },
            ],
          },
        },
        {
          qDef: {
            qFieldDefs: ["week_of_quarter"],
            qSortCriterias: [
              {
                qSortByAscii: 1,
              },
            ],
          },
        },
        {
          qDef: {
            qFieldDefs: ["position"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["kpi_value_type"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["kpi_label"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["value"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["tab"],
          },
        },
      ],
      qMeasures: [],
      qInitialDataFetch: [{ qWidth: 7, qHeight: 10000 / 7 }],
    },
  };

  const { data = {} } = useHyperCubeData({
    def,
    dataTransformFunc: useCallback((qHyperCube) => {
      return qHyperCube.qDataPages[0].qMatrix
        .map(function (item) {
          return {
            quarter: item[0].qText,
            week: item[1].qText,
            pos: item[2].qText,
            kpi_value_type: item[3].qText,
            lbl: item[4].qText,
            val: item[5].qText,
            tab: item[6].qText,
          };
        })
        .filter((d, i) => {
          // console.log(d);
          //return d.week !== undefined;
          return d.tab === tabName; //Lenovo 360 Sales
        });
    }, []),
  });

  //  var lines = row.map(function(r){
  //  let point = [{"qNum": parseInt(r.val)},{"qNum":parseInt(r.week) },{"qNum":parseInt(r.val)}]
  //   return point;
  //  })

  var lines = null;
  var refLine = false;
  if (data && row.length) {
    if (debug) {
      // console.debug("data",data);
      // console.debug("lineData",lineData);
    }

    //(item)=> item.week !== "-"? !isNaN(item.week):true
    // (item)=>item.kpi_value_type=='ACTUAL'
    lines = data
      .filter((item) => (item.week !== "-" ? !isNaN(item.week) : true))
      .filter((item) => item.pos === row[0].pos)
      .filter((item) => item.kpi_value_type.toUpperCase() === "ACTUAL")
      .map(function (r) {
        return [
          { qNum: parseInt(r.val) },
          { qNum: parseInt(r.week) },
          { qNum: parseInt(r.val) },
        ];
      });

    var lineData = {
      title: row.find((o) => o.kpi_Val_type.toUpperCase() === "ACTUAL").lbl,
      lineChart: lines,
      upperTarget: data.filter(
        (item) => item.kpi_value_type.toUpperCase() === "UPPER TARGET"
      ).length
        ? data.filter(
            (item) => item.kpi_value_type.toUpperCase() === "UPPER TARGET"
          )[0].val
        : null,
      lowerTarget: data.filter(
        (item) => item.kpi_value_type.toUpperCase() === "LOWER TARGET"
      ).length
        ? data.filter(
            (item) => item.kpi_value_type.toUpperCase() === "LOWER TARGET"
          )[0].val
        : null,
    };

    if (debug) console.log(lineData);

    refLine = isNull(lineData.upperTarget)
      ? false
      : isNull(lineData.lowerTarget)
      ? false
      : true;
    //  refLine = isNull(lineData.upperTarget)?false: isNull(lineData.lowerTarget)?false:true;
    //  console.log(refLine)
  }

  //set state with chart width
  const lineChartRef = useRef();
  const { width, height } = useChartSpec(lineChartRef, data);
  // console.log("chart spec",width, height)

  let message = {
    height: document.getElementById("root").clientHeight,
    rows: "dummy",
    tabName: "dummy",
  };

  if (message.height !== "undefined") {
    //  console.log("*Height info from line:",message);
    window.parent.postMessage(message, "*");
  }

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
          colorTheme={colorTheme.refLines}
        />
      </div>
    );
  } else return <div style={{ color: "black" }}> Loading...</div>;
};
