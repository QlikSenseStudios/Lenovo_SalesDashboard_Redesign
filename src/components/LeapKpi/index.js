import React from "react";
import LeapKpi from "./leapkpi";
import "./style.css";

export default ({ qDef: objDef }) => {
  // console.log("leapppp")
  // console.log("leap qDef", objDef);
  let debug = false;
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
    if (row.length < 3) console.error("Custom error", row);
    console.table(row);
  }

  //color
  let barcolors = {};
  // barcolors[row[3].lbl] = "Coral";
  // barcolors[row[4].lbl] = "Royalblue";
  barcolors[row.find((o) => o.kpi_Val_type === "DIM 1 VALUE 1").lbl] = "Coral";
  barcolors[row.find((o) => o.kpi_Val_type === "DIM 1 VALUE 2").lbl] =
    "Royalblue";

  //keys
  var d_keys = [
    row.find((o) => o.kpi_Val_type === "DIM 1 VALUE 1").lbl,
    row.find((o) => o.kpi_Val_type === "DIM 1 VALUE 2").lbl,
  ];
  //dim1
  var dim1 = { points: "" };
  dim1.points = row.find((o) => o.kpi_Val_type === "DIM 1 LABEL").lbl;
  dim1[d_keys[0]] = row.find((o) => o.kpi_Val_type === "DIM 1 VALUE 1").f_val; //10;
  dim1[d_keys[1]] = row.find((o) => o.kpi_Val_type === "DIM 1 VALUE 2").f_val; //100;

  //dim2
  var dim2 = { points: "" };
  dim2.points = row.find((o) => o.kpi_Val_type === "DIM 2 LABEL").lbl;
  dim2[d_keys[0]] = row.find((o) => o.kpi_Val_type === "DIM 1 VALUE 2").val;
  dim2[d_keys[1]] = row.find((o) => o.kpi_Val_type === "DIM 1 VALUE 2").val;

  if (debug) {
    console.log(barcolors);
    // console.log("dim1",dim1)
    // console.log("dim2",dim2)
    // console.log("keys",d_keys)
  }

  const data = {
    dimention: [dim1, dim2],
    keys: d_keys,
    colors: barcolors,
    leapbartitle: row.find((o) => o.kpi_Val_type === "TITLE LABEL").lbl,
    leapkpititle: row.find((o) => o.kpi_Val_type === "ACTUAL").lbl,
    leapkpivalue: row.find((o) => o.kpi_Val_type === "DIM 1 LABEL").f_val,
  };

  if (debug) {
    // console.log("leap", data);
  }

  if (!data) return <div>Loading...</div>;

  const { dimention, keys, colors, leapbartitle, leapkpititle, leapkpivalue } =
    data;
  //console.log(data);
  //const values = Object.entries(colors);

  return (
    <div className="leapkpi">
      <div className="col-8 col-sm-8 col-md-8 col-lg-8">
        <div title={leapbartitle} className={`subtitle leaptitle`}>
          {leapbartitle}
        </div>
        <LeapKpi data={dimention} keys={keys} colors={colors} />
      </div>
      <div className="col-4 col-sm-4 col-md-4 col-lg-4 leapbar-kpi ">
        <div className="leapkpi-value-section">
          <div className={"leapkpi-value display"}>{leapkpivalue}</div>
        </div>
        <div title={leapkpititle} className={`subtitle`}>
          {leapkpititle}
        </div>
      </div>
    </div>
  );
};
