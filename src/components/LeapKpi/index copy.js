import React, { useCallback,  useMemo } from "react";
import { useHyperCubeData } from "../../hooks/index";
import LeapKpi from "./leapkpi";
import "./style.css";

export default ({ qDef: objDef }) => {
console.log("leapppp")
console.log("leap qDef", objDef);

let row = objDef.map((items)=>{
  return {pos:items[1].qText, label:items[4].qText,title:items[3].qText,val:items[12].qText,Formated_val:items[13].qText}
  });

  console.log(row);
  if(row.length<3)
  console.error("Custom error", row);
  console.table(row);

  let barcolors = {"Earned": "purple", "Revenue Claimed YTD": "Royalblue"}

 var dim1={"Earned": 1, "Revenue Claimed YTD": 26059, "points": "LEAP Points Summary"};
  var dim2={ "Earned": 2, "Revenue Claimed YTD": 10000, "points": "Revenue Claimed YTD"};

 var dim11= { "points": row.find(o => o.label === 'Dim 1 Label') }

  const data = { 
    dimention:[
      dim1,dim2
    ],
    keys:[
        "Revenue Claimed YTD",
        "Revenue Claimed YTD",
        "Earned"
    ],
    colors : barcolors,
    leapbartitle: "LEAP Points Summary",
    leapkpititle: "LEAP Points Summary",
    leapkpivalue:100
  };


  if (!data) return <div>Loading...</div>;

  const {
    dimention,
    keys,
    colors,
    leapbartitle,
    leapkpititle,
    leapkpivalue
  } = data;
  console.log(data);
  const values = Object.entries(colors);

  return (
    <div className="leapkpi">
      <div className="col-6 col-sm-6 col-md-6 col-lg-6">   
        <div className={`subtitle leaptitle`}>{leapbartitle}</div>   
        <LeapKpi
          data={dimention}          
          keys={keys}
          colors={colors}              
        />      
      </div>
      <div className="col-6 col-sm-6 col-md-6 col-lg-6 leapbar-kpi ">
            <div className="leapkpi-value-section">
              <div className={"leapkpi-value display"}>
                {leapkpivalue}
              </div>     
            </div>
            <div className={`subtitle`}>{leapkpititle}</div>
      </div>
    </div>
    );

};