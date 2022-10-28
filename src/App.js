import React, { useMemo } from "react";
import "./App.css";

// Shared Components
import Page from "./Pages/PerformancePage";

// Lodash
//import { filter, flow, sortBy } from "lodash/fp";
import { flow, sortBy } from "lodash/fp";
import PlaceHolder from "./components/PlaceHolder";
//import Legend from "./components/Legend";
import Loader from "./components/Loader";
import { useSession, useAppData, useGetSheetData } from "./hooks/index";

import Tab from "./components/tab";

const App = () => {
  //console.log("Performance Page");
  //Qlik error handling
  const connectionError = useSession();
  var { chartControlData,tabData, accessDenied, appData, isLoading } = useAppData();

// console.log("tab",tab);
// if(chartControlData){
//  let s= testdata.map((d,i)=>{ return d})
//  console.log(chartControl.data.concat(s))
//  chartControlData = chartControlData.concat(s);
// console.log(chartControlData);
// }

//  console.log("appData",appData);
 
//  if(tabData){
//    console.log(tabData);
//  }

  const sheetData = useGetSheetData();
  //sort the data by position order
  const sortedData = useMemo(
    () =>
      flow(
     //filter((d) => d[1].qNum < 3),  // reduce charts based on  position
        sortBy((d) => d[1].qNum)
      )(chartControlData),
    [chartControlData]
  );

  if(sortedData.length){
  //  console.log("sortedData",sortedData);
   // console.log("sortedData",sortedData.length);
  }

  const tabTitles = useMemo(() => {
    return tabData.map((tabItems)=>{ return tabItems[0].qText;})
 }, [tabData]);
 
 //console.log(tabTitles);

  const groups = useMemo(() => {
    if(tabData.length && tabTitles.length){
   return tabTitles.map((t,i)=>{
      return sortedData.filter((d) =>{ return d[11].qText === tabTitles[i]});
    });
  }
  }, [tabData,tabTitles,sortedData]);

  //console.log("groups",groups);
 
  //Display Loader before data display
  if (isLoading && !connectionError.doc.error && !connectionError.session.error) {
    return (
     // <div className="noAccessBg">
      <Loader message="Dashboard is loading, please wait" />
     // </div>
    );
  }
  
  //connectionError.doc.error ="Error"

  //let legend = <div><span>Click on a KPI object to access detailed data of the KPI</span></div>;
  var noDataCondition = tabTitles.length===0 || groups === undefined || connectionError.doc.error;
  return (
    <div  className={noDataCondition ? "noAccessBg": ""} > 
        {accessDenied || connectionError.doc.error !== null ? (
          <PlaceHolder message="No data available" />
        ) : connectionError.session.error !== null ? (
          <PlaceHolder message="Connection Failed" />
        ) :  tabTitles.length===0  || groups === undefined ?
        (<PlaceHolder message="No data available" />):
        
        ( 
         <Tab> {
            tabTitles.map((tabN, idx) =>{  
              //console.log("tabN",tabN);
           return  ( 
                <Tab.TabPane key={idx} tab={tabN}>
                    {appData !== null && chartControlData !== null ? (
                      <div style={groups[idx].length ? {}:{display:"none"}}>
                      <span className="pageName">
                      </span>
                      <span className="quarter">{appData.quarter}</span>
                      <div style={{ lineHeight: "1" }}>
                        <span className="snapDate">{`As of: ${appData.snapDate}`}</span>
                        <span className="quarterRange">
                          {`(${appData.quarterStartDate} `} &nbsp;&nbsp;-&nbsp;&nbsp;
                          {` ${appData.quarterEndDate})`}
                        </span>
                      </div>
                      
                    </div>
                  ) : null
                  }
                          <Page data={groups[idx]} chartControlData={chartControlData} sheetData={sheetData} tabName={tabN}/>
                </Tab.TabPane> 
         )}
         )}</Tab>
        )
    }
    </div>
  );
};

export default App;
//className
//style={groups[idx].length==0? {"background":"red"}:"blue"}
//className={groups[idx].length === 0? "noAccessBg":""}
//style ={{"border":"2px solid red"}}


// {groups[idx].length!= 0? (
//   <Page data={groups[idx]} chartControlData={chartControlData} sheetData={sheetData} tabName={tabN}/>
//   ): <div className="noAccessBg"><PlaceHolder message="Test" /></div>
// }