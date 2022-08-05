import React   from "react";
import { useGaugeContainer } from "../../hooks/index";
import "./style.css";

export default ({ qDef: objDef }) => {
var debug = false;

  let row = objDef.map((items)=>{
    return { valueType:(items[4].qText).toUpperCase(),
              title:items[3].qText,
              val:items[12].qText,
              f_val:items[13].qText,
              lbl:items[14].qText}
    });
  
   //sort rows based on the valueType - Actual in index 0 and Targer in index 1   
  // var order = ["ACTUAL","TARGET"];
  //  var sorted = row.sort(function(a, b) {
  //   return order.indexOf((a.valueType)) - order.indexOf((b.valueType));
  //   });
  
    if(debug){
        console.log(row);
        if(row.length<2)
        console.error("error in number of rows", row);
        console.table(row);
    }

const data = {
        subtitle: row.length ? row[0].lbl : "",  //"QTD Top Seller" KID
        value: row.length ? row[0].f_val : "",  //0 qtext

        note2Text :  row.length > 1 ? (isNaN(row[0].val/row[1].val) || !isFinite(row[0].val/row[1].val)) ? "0%" :
                                         parseInt((row[0].val/row[1].val)*100) +"%":"0%", //2txt

        note2Title:  row.length > 1 ? "Target Achieved" :"",  // "Target Achieved"

        note2Value:  row.length > 1 ?  (isNaN(row[0].val/row[1].val) || !isFinite(row[0].val/row[1].val)) ?0: row[0].val/row[1].val : "",  //0.12442316666666667,  //2 qNum

        note1Value:  row.length > 1 ? row[1].f_val : "", //1qtxt
        note1Title : row.length > 1 ? row[1].lbl : "", //"Target"
}

if(debug){
    console.log("data", data);
}
  const container = useGaugeContainer(data);

  if (!data) return null;
  
  const {
    subtitle,
    value,
    note1Value,
    note2Text,
    note1Title,
    note2Title,
  } = data;

  return (
    <div className="circle-block circle_2">
      <div className="utilization_container">
        <svg viewBox="0 0 100 100" height={"100%"} className="svg">
          <g className="background-container"></g>
          <g ref={container} className="foreground-container"></g>
        </svg>

        <div className="percentage percentage2">
          <div className="subtitle">{subtitle}</div>
          <div className="display">{value}</div>
          <div className="note">
            {note2Text} {note2Title}
          </div>

          <div className="note">
            {note1Value} {note1Title}
          </div>
        </div>
      </div>
    </div>
  );
};
 