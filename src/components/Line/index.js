import { isNull } from "lodash";
import React, {
  useCallback,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import { useChartSpec } from "../../hooks/index";
import { QlikContext } from "../../hooks/QlikProvider";
import Line from "./line";
import "./style.css";
import { colorTheme } from "../../components/index";

//export default ({ qDef: objDef,style = { width: "100%" }, colorTheme }) => {
export default ({ qDef: objDef }) => {
  const { engineApp } = useContext(QlikContext);
  //  console.log("Line qDef",objDef);
  const style = { width: "100%" };
  //  console.log("colorTheme",colorTheme);
  // const colorTheme ="black";
  const [data, setData] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [sessionObj, setSessionObj] = useState(null);
  const [chartDataLayout, setChartDataLayout] = useState(null);

  var debug = true;

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
    // if (row.length < 3) console.error("Custom error", row);
    // console.table(row);
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
      ],
      qMeasures: [],
      qInitialDataFetch: [{ qWidth: 6, qHeight: 10000 / 6 }],
    },
  };

  // const { dataT = {} } = useHyperCubeData({
  //   def,
  //   dataTransformFunc: useCallback((qHyperCube) => {
  //     console.log("Hyqline", qHyperCube);
  //     return qHyperCube.qDataPages[0].qMatrix.map(function (item) {
  //       return {
  //         quarter: item[0].qText,
  //         week: item[1].qText,
  //         pos: item[2].qText,
  //         kpi_value_type: item[3].qText,
  //         lbl: item[4].qText,
  //         val: item[5].qText,
  //       };
  //     });
  //   }, []),
  // });

  ////start
  useEffect(() => {
    if (!data.length) fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("fetch line data");
      let sessionObj = await engineApp.createSessionObject(def);
      setSessionObj(sessionObj);
      // console.log("sessionObj", sessionObj);
      const layout = await sessionObj.getLayout();
      // console.log("layout", layout);
      setChartDataLayout(layout);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("set line Data");
    if (chartDataLayout) {
      let hQube = chartDataLayout.qHyperCube;
      console.log("Hyq-line", hQube);
      // let tabs = hQube.qDataPages[0].qMatrix;

      let newData = hQube.qDataPages[0].qMatrix.map(function (item) {
        return {
          quarter: item[0].qText,
          week: item[1].qText,
          pos: item[2].qText,
          kpi_value_type: item[3].qText,
          lbl: item[4].qText,
          val: item[5].qText,
        };
      });

      console.log("newDataline", newData);
      setData(newData);
      setLoading(false);
    }
  }, [chartDataLayout]);

  //end
  //  var lines = row.map(function(r){
  //  let point = [{"qNum": parseInt(r.val)},{"qNum":parseInt(r.week) },{"qNum":parseInt(r.val)}]
  //   return point;
  //  })

  var lines = null;
  var refLine = false;

  if (data != null && row.length) {
    if (debug) {
      console.log("data", data);
      // console.log("lineData", lineData);
      // console.log(data);
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

    if (debug) console.log("lineData", lineData);

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
  console.log("chart spec", width, height);

  let message = {
    height: document.getElementById("root").clientHeight,
    rows: "dummy",
    tabName: "dummy",
  };

  if (message.height !== "undefined") {
    //  console.log("*Height info from line:",message);
    window.parent.postMessage(message, "*");
  }

  if (data !== null && lineData) {
    return (
      // <div>test</div>
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
