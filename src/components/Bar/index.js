import React, { useCallback, useRef } from "react";
import { useHyperCubeData, useChartSpec } from "../../hooks/index";
import "./style.css";

import Bar from "./bar";

export default ({ qDef: objDef }) => {
  // console.log("Bar qDef", objDef);
  var debug = false;
  let row = objDef.map((items) => {
    return {
      pos: items[1].qText, //
      kpi_Val_type: items[4].qText,
      title: items[3].qText,
      val: items[12].qText,
      f_val: items[13].qText, //f_val
      lbl: items[14].qText,
    };
  });

  if (debug) {
    console.log(row);
    // if (row.length < 3) console.error("Custom error", row);
    // console.table(row);
  }

  const def = {
    qInfo: {
      qType: "app data",
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["Kpi_id"],
          },
        },
      ],
      qMeasures: [],
      qInitialDataFetch: [{ qWidth: 1, qHeight: 10 / 1 }],
    },
  };

  const { data = {} } = useHyperCubeData({
    def,
    dataTransformFunc: useCallback((qHyperCube) => {
      return qHyperCube;
    }, []),
  });

  var barData = {
    value: 1190320.0, //row.find((o) => o.kpi_Val_type === "ACTUAL").val,
    target: row.find((o) => o.kpi_Val_type === "TARGET").val,
    targetRounded: row.find((o) => o.kpi_Val_type === "TARGET").f_val,
    tierName: row.find((o) => o.kpi_Val_type === "TARGET TIER NAME").lbl,
    title: row.find((o) => o.kpi_Val_type === "ACTUAL").lbl,
    currency: row.find((o) => o.kpi_Val_type === "TARGET").f_val.slice(-3),
  }; //Target

  if (barData) {
    barData.value = isNaN(barData.value) ? 0 : barData.value;
    barData.target = isNaN(barData.target) ? 0 : barData.target;
  }

  //return <div className="justify-content: space-around;">Loading...</div>;
  // barData ={
  //   target: "1090320.0",//"1290320.0",
  // targetRounded: "1.3 M GBP",
  // tierName: "Platinum",
  // title: "Tier Progress",
  // value: "558007.9",
  // }
  if (debug) console.log(barData);

  // //set state with chart width
  const barChartRef = useRef();
  const { width } = useChartSpec(barChartRef, data);

  if (!barData) return <div>Loading...</div>;

  return (
    <div className="barChart" ref={barChartRef}>
      <Bar {...barData} title={barData.title} width={width} height={250} />
    </div>
  );
};
