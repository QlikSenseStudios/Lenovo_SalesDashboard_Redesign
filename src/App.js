import React, { useMemo,useState,useEffect } from "react";
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
 
      const sheetData = useGetSheetData();
      const [activePrimaryTab, setActivePrimaryTab] = useState(0);
      var subTabGroups = [];
      var subTabTitles = [];


     

      function getSubData(){
        if(primaryTabgroups!= undefined && subTabTitles!==undefined){
             let groupsd =  subTabTitles.map((t,i)=>{
                return primaryTabgroups[activePrimaryTab].filter((d) =>{ return d[11].qText === t});
            });
            subTabGroups = groupsd;
          }
       }

      // useEffect(()=>{
      //   getSubData();
      // },[activePrimaryTab])

      subTabGroups = useMemo(() => {

        if(primaryTabgroups!= undefined && subTabTitles!==undefined){
           return  subTabTitles.map((t,i)=>{
             return primaryTabgroups[activePrimaryTab].filter((d) =>{ return d[11].qText === t});
         });
        
       }
       {
        return [];
       }

      },[activePrimaryTab])

  //sort the data by position order
  const sortedData = useMemo(
    () =>
      flow(
     //filter((d) => d[1].qNum < 3),  // reduce charts based on  position
        sortBy((d) => d[1].qNum)
      )(chartControlData),
    [chartControlData]
  );


  const primaryTabs = useMemo(() => {
   let f =  tabData.map((tabItems)=>{ return tabItems[1].qText})
    return f.filter((item, index) => f.indexOf(item) === index);
 }, [tabData]);

  const primaryTabgroups = useMemo(() => {
    if(primaryTabs.length){
      return primaryTabs.map((t,i)=>{
          return sortedData.filter((d) =>{ return d[18].qText === primaryTabs[i]});
        });
    }
  }, [primaryTabs,sortedData]);


 subTabTitles = useMemo(() => {
   let _subTabs = [];
   
     if(primaryTabgroups!=undefined)
     {
             _subTabs = primaryTabgroups[activePrimaryTab].map((t,i)=>{
                   //return sortedData.filter((d) =>{ return d[11].qText === subTabTitles[i]  });
                   return t[11].qText;
                 });
             let unique_subTabs = [...new Set(_subTabs.map(item => item))];
           return unique_subTabs;
     }
     else{
      return [];
     }

}, [primaryTabgroups,activePrimaryTab]);

if(tabData !== undefined && tabData.length){
    getSubData();
        console.log("primaryTabs", primaryTabs);
        console.log("subTabTitles",subTabTitles);
        console.log("subTabGroups",subTabGroups);

}

  //Display Loader before data display
  if (isLoading && !connectionError.doc.error && !connectionError.session.error) {
    return (
     // <div className="noAccessBg">
      <Loader message="Dashboard is loading, please wait" />
     // </div>
    );
  }

  //connectionError.doc.error ="Error"

// subTabTitles.length===0 || subTabGroups === undefined ?
  var noDataCondition = subTabTitles.length===0 || subTabTitles === undefined || primaryTabgroups ===undefined ||connectionError.doc.error;
  return (
    
    <div  className={noDataCondition ? "noAccessBg": ""} > 
        {accessDenied || connectionError.doc.error !== null ? 
        (
          <PlaceHolder message="No data available" />
        ) : connectionError.session.error !== null ? (
          <PlaceHolder message="Connection Failed" />
        ): 
        //  subTabTitlesT.length===0 ? (<PlaceHolder message="sub Tab lenth 0" />): 
        //subTabTitles === undefined || subTabGroups === undefined || subTabGroups.length === 0 ? (<PlaceHolder message="subTabGroups -undefinde" />) :
        (   
          <div>
            <div className="pri-nav-container">
              <ul className="pri-nav pri-nav-tabs nav-justified">
                      {primaryTabs.map(( Maintab, idx) => {
                        return (
                          <li  key={idx}  className={`pri-nav-item ${idx === activePrimaryTab ? "active" : ""}`}>
                            <a
                              className={`pri-nav-link ${idx === activePrimaryTab ? "active" : ""}`}
                              href="#"
                              onClick={()=>setActivePrimaryTab(idx)}
                            >
                              {Maintab} 
                            </a>
                          </li>
                        )
                    })}
              </ul>
              </div>
              {/* {primaryTabs.map(( Maintab, idx) => {
                  return (<button onClick={()=>setActivePrimaryTab(idx)}> {Maintab} </button>)
              })
                
              } */}
             
              <Tab> { subTabTitles.map((tabN, idx) =>{  
                                return  ( 
                                      <Tab.TabPane key={idx} tab={tabN} >
                                          {appData !== null && chartControlData !== null ? (
                                          <div style={subTabGroups[idx].length ? {}:{display:"none"}}>
                                            {/* <div style={1==1 ? {}:{display:"none"}}> */}
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
                                        {/* <div  key={idx} data={subTabGroups[idx]}> {tabN}</div> */}
                                        <Page data={subTabGroups[idx]} sheetData={sheetData} tabName={tabN}/> 
                                      </Tab.TabPane> 
                              )})
                    }
                </Tab>
          </div>  
        )
    }
    </div>
    
  );
};
export default App;

