import React, { useEffect, useState } from "react";
import "./style.css";
import { FaStaylinked, FiLink, AiFillDashboard, FaFileInvoiceDollar,FaPoll } from 'react-icons/fa';

export default ({ qDef: objDef }) => {
 //console.log("KPI DEF", objDef);
 var debug = false;
 let row = objDef.map((items)=>{
  return { kpi_Val_type:items[4].qText,
            title:items[3].qText,
            val:items[12].qText,
            f_val:items[13].qText,
            lbl:items[14].qText}
            // return { kpi_Val_type: "valueType",
            //   title:"Title",
            //   val:"Val",
            //   f_val:"600.0K INR",
            //   lbl:"lbl"}
  });

  if(debug){
    console.log(row);
    if(row.length<3)
    console.error("Custom error", row);
    console.table(row);
  }

const [iconColor, setIconColor] = React.useState("");

var colors =["#E1140A","#00cc44"]

  const data = {
        title: row.length ? row[0].title : "",
        value: row.length ? row[0].f_val : "",
        variance1Title : row.length > 1 ? row[1].lbl : "",
        variance1 : row.length > 1 ? row[1].f_val : "",
        variance2Title: row.length > 2 ? row[2].lbl : "",
        variance2: row.length > 2 ? row[2].f_val : "",
        // variance3Title:row.length > 3 ? row[3].lbl : "",
        // variance3: row.length > 3 ? row[3].lbl : "",
    }

 function variances_color(params) {
 let s = { color: params.includes("▼")?colors[0]:params.includes("▲")?colors[1]:"",fontWeight:"bolder"}
//  s.color="black"

 if(params.includes("▼"||"▲")){
      if(params.includes("▼")){
          s.color= colors[0];
      }
      if(params.includes("▲")){
            s.color= colors[1];
      }
}

//  if(params.includes("%"))
//  {
//        let d = params.split("%")
//       // console.log(d);
//       // console.log(d[0]);
//       let f = Math.sign(parseInt(d[0]));
//       // console.log("f",f);

//       if(f==-1){
//         s.color=colors[0]
//       }
//       else{
//         s.color=colors[1]
//       }
    
//  }

 //console.log("s",s)
 return s;
 
}

 if (!data) return <div>Loading...</div>;

  const {
    title,
    value,
    variance1,
    variance2,
    variance3,
    variance1Title,
    variance2Title,
    variance3Title
  } = data;
  




  return (
    <div className="kpi-container" onMouseEnter={()=>setIconColor("#3E8DDD")}
    onMouseLeave={() => setIconColor("")}>
      <div className={`subtitle`}>{title}</div>
      <div className="kpi-value-section">
        <div
          className={
            objDef.length === 4
              ? "kpi-value display kpiv2"
              : "kpi-value display"
          }
        >
 
           {value}
        </div>
        <div className="kpi-variances">
          <div className="kpi-variance">
            <div
              className={
                objDef.length === 4
                  ? "note variance-label kpiv2"
                  : "note variance-label"
              }
              title={variance1Title}
            >
              {variance1Title}  
            </div>
            <div className={"note-value"} style={ variances_color(variance1) }  >{variance1}</div>
          </div>
          <div className="kpi-variance">
            <div
              className={
                objDef.length === 4
                  ? "note variance-label kpiv2"
                  : "note variance-label"
              }
              title={variance2Title}
            >
              {variance2Title}
            </div>
            <div className={"note-value"} style={ variances_color(variance2)}>{variance2}</div>
          </div>
          {variance3Title !== null && variance3 !== null ? (
            <div className="kpi-variance">
              <div
                className={
                  objDef.length === 4
                    ? "note variance-label kpiv2"
                    : "note variance-label"
                }
              >
                {variance3Title}
              </div>
              <div className={"note"}>{variance3}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
