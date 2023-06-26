import React, { useMemo, useState } from "react";
import "./App.css";

// Shared Components
import Page from "./Pages/PerformancePage";

// Lodash
import { flow, sortBy } from "lodash/fp";
import PlaceHolder from "./components/PlaceHolder";
import Loader from "./components/Loader";
import { useSession, useAppData, useGetSheetData } from "./hooks/index";

import Tab from "./components/tab";

const App = () => {
  //console.log("Performance Page");
  //Qlik error handling
  const connectionError = useSession();
  var { chartControlData, tabData, accessDenied, appData, isLoading, region } =
    useAppData();

  // console.log("tab",tab);
  if (chartControlData) {
    // let s = testdata.map((d, i) => {
    //   return d;
    // });
    // console.log(chartControl.data.concat(s));
    // chartControlData = chartControlData.concat(s);
    region = chartControlData[0][7]?.qText;
    //    console.log("chartControlData#");
    // console.log(region);
  }

  //console.log("appData", appData);

  const sheetData = useGetSheetData();
  const [activePrimaryTab, setActivePrimaryTab] = useState(0);
  var subTabGroups = [];
  var subTabTitles = [];

  function getSubData() {
    if (primaryTabgroups !== undefined && subTabTitles !== undefined) {
      let groupsd = subTabTitles.map((t, i) => {
        return primaryTabgroups[activePrimaryTab].filter((d) => {
          return d[11].qText === t;
        });
      });
      subTabGroups = groupsd;
    }
  }

  subTabGroups = useMemo(() => {
    if (primaryTabgroups !== undefined && subTabTitles !== undefined) {
      return subTabTitles.map((t, i) => {
        return primaryTabgroups[activePrimaryTab].filter((d) => {
          return d[11].qText === t;
        });
      });
    }
    {
      return [];
    }
  }, [activePrimaryTab]);

  //sort the data by position order
  const sortedData = useMemo(
    () =>
      flow(
        //filter((d) => d[1].qNum < 3),  // reduce charts based on  position
        sortBy((d) => d[1].qNum)
      )(chartControlData),
    [chartControlData]
  );

  // console.log("sortedData",sortedData)
  // console.log("tabData",tabData)

  const primaryTabs = useMemo(() => {
    let f = tabData.map((tabItems) => {
      return tabItems[1].qText;
    });
    return f.filter((item, index) => f.indexOf(item) === index);
  }, [tabData]);

  const primaryTabgroups = useMemo(() => {
    if (primaryTabs.length) {
      return primaryTabs.map((t, i) => {
        //return sortedData;
        return sortedData.filter((d) => {
          return d[18].qText === primaryTabs[i];
        });
      });
    }
  }, [primaryTabs, sortedData]);

  subTabTitles = useMemo(() => {
    let _subTabs = [];

    if (primaryTabgroups != undefined) {
      // console.log("activePrimaryTab**", activePrimaryTab)
      _subTabs = primaryTabgroups[activePrimaryTab].map((t, i) => {
        // console.log(t[11].qText);
        return t[11].qText;
      });

      let unique_subTabs = [...new Set(_subTabs.map((item) => item))];
      //  console.log("unique",unique_subTabs)
      return unique_subTabs;
    } else {
      return [];
    }
  }, [primaryTabgroups, activePrimaryTab]);

  if (tabData !== undefined && tabData.length) {
    getSubData();
    // console.log("primaryTabs", primaryTabs);
    // console.log("primaryTabgroups",primaryTabgroups);
    // console.log("subTabTitles",subTabTitles);
    // console.log("subTabGroups",subTabGroups);
  }

  //Display Loader before data display
  if (
    isLoading &&
    !connectionError.doc.error &&
    !connectionError.session.error
  ) {
    return (
      // <div className="noAccessBg">
      <Loader message="Dashboard is loading, please wait" />
      // </div>
    );
  }

  //connectionError.doc.error ="Error"

  // subTabTitles.length===0 || subTabGroups === undefined ?
  var noDataCondition =
    subTabTitles.length === 0 ||
    subTabTitles === undefined ||
    primaryTabgroups === undefined ||
    connectionError.doc.error;
  return (
    <div className={noDataCondition ? "noAccessBg" : ""}>
      {accessDenied || connectionError.doc.error !== null ? (
        <PlaceHolder message="No data available" />
      ) : connectionError.session.error !== null ? (
        <PlaceHolder message="Connection Failed" />
      ) : region === "some region" ? (
        <PlaceHolder message="We are working to update the charts and views on this page. Please go to the Lenovo 360 Incentives page for details of your earnings." />
      ) : (
        <div className="">
          <div className="pri-nav-container">
            <ul className="pri-nav pri-nav-tabs nav-justified my-Container">
              {primaryTabs.map((Maintab, idx) => {
                return (
                  <li
                    key={idx}
                    className={`pri-nav-item ${
                      idx === activePrimaryTab ? "active" : ""
                    }`}
                  >
                    <a
                      className={`pri-nav-link ${
                        idx === activePrimaryTab ? "active" : ""
                      }`}
                      href="#"
                      onClick={() => setActivePrimaryTab(idx)}
                    >
                      {Maintab}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <Tab>
            {subTabTitles.map((tabN, idx) => {
              return (
                <Tab.TabPane key={idx} tab={tabN}>
                  {appData !== null && chartControlData !== null ? (
                    <div
                      style={
                        subTabGroups[idx].length ? {} : { display: "none" }
                      }
                    >
                      <span className="pageName"></span>
                      <span className="quarter">{appData.quarter}</span>
                      <div style={{ lineHeight: "1" }}>
                        <span className="snapDate">{`As of: ${appData.snapDate}`}</span>
                        <span className="quarterRange">
                          {`(${appData.quarterStartDate} `}{" "}
                          &nbsp;&nbsp;-&nbsp;&nbsp;
                          {` ${appData.quarterEndDate})`}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <Page
                    data={subTabGroups[idx]}
                    sheetData={sheetData}
                    tabName={tabN}
                  />
                </Tab.TabPane>
              );
            })}
          </Tab>
        </div>
      )}
    </div>
  );
};
export default App;
