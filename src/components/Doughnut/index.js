import React   from "react";
 import { useDoughnutContainer } from "../../hooks/index";
import "./style.css";

export default ({ qDef: objDef  }) => {
//var debug = false;

// function kFormatter(num) {
//   return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
// }
//console.log("DougnutDEf",objDef);

let row = objDef.map((items)=>{
  return { valueType:(items[4].qText).toUpperCase(),
            title:items[3].qText,
            val:items[12].qNum,
            f_val:items[13].qText,
            lbl:items[14].qText=="IDG"?"PCSD":items[14].qText}  
  });

  //console.log("Dougnut",row); 


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

//var chartColors = ["#FF6A00","#8246AF","#F04187"]; 
//var chartColors = ["#FF6A00","#3e4b55","#F04187"]; 
//var chartColors = ["#FF6A00","#bfbfbf","#0099e6"];
// var chartColors = ["#FF6A00","#3e4b55","#0099e6"]; 
var chartColors = ["#FF7675","#8246AF","#F04187"];


// var currency_symbols = {
//   'USD': '$', // US Dollar
//   'EUR': '€', // Euro
//   'CRC': '₡', // Costa Rican Colón
//   'GBP': '£', // British Pound Sterling
//   'ILS': '₪', // Israeli New Sheqel
//   'INR': '₹', // Indian Rupee
//   'JPY': '¥', // Japanese Yen
//   'KRW': '₩', // South Korean Won
//   'NGN': '₦', // Nigerian Naira
//   'PHP': '₱', // Philippine Peso
//   'PLN': 'zł', // Polish Zloty
//   'PYG': '₲', // Paraguayan Guarani
//   'THB': '฿', // Thai Baht
//   'UAH': '₴', // Ukrainian Hryvnia
//   'VND': '₫', // Vietnamese Dong
// };


const data = {
  dataPoints:[
  {
      "bu": 0,
      "value": row[0].val,
      "f_val": row[0].f_val,
      "lbl": row[0].lbl,
      "color": "red"
  },
  {
      "bu": 1,
      "value":row[1].val,
      "f_val": row[1].f_val,
      "lbl": row[1].lbl,
      "color":"blue"
  },
  {
    "bu": 2,
    "value": row[2].val,
    "f_val": row[2].f_val,
    "lbl": row[2].lbl,
    "color":"green"
},
  
],
title: row[1].title.split(row[1].lbl),
//title: row[1].title,
total: row[0].val + row[1].val + row[2].val ,
currency: ""
}

const container = useDoughnutContainer(data.dataPoints);
  
  if (!data) return null;

  const {
     dataPoints,
     title,
     total,
     currency

  } = data;

  return (
    <div className="donut-block">
    <div className="doughnut-title">{title}</div>
      <div ref={container}  className="utilization_container">
        <div className="toolTipContainer"></div>
        <svg viewBox="0 0 100 100" className="svg">
          <g className="foreground-container">
          </g>
        </svg>

        {/* <div className="total midpoint">
          <div className="subtitle">{ nFormatter(total==7540?1854:total)}</div>
      
        </div> */}
        <div className="donut-legend">
     
     
        <div className="subtitle legend">
                  <span className="box" style={{backgroundColor:chartColors[0]}}></span>
                 
                      <span className="lbl">{dataPoints[0].lbl}</span>
                      <span className="val">{dataPoints[0].f_val}</span>
       </div>
        <div className="subtitle legend">
                    <span className="box" style={{backgroundColor:chartColors[1]}}></span>
                   
                        <span className="lbl">{dataPoints[1].lbl}</span>
                        <span className="val">{dataPoints[1].f_val}</span> 
          </div>
          {/* {region!=="EMEA"?null:(   */}
          <div className="subtitle legend" >
                    <span className="box" style={{backgroundColor:chartColors[2]}}></span>
                   
                        <span className="lbl">{dataPoints[2].lbl}</span>
                        <span className="val">{dataPoints[2].f_val}</span> 
          </div>
          {/* )} */}
        </div>


      </div>
    </div>
  );
};
