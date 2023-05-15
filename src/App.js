import React, { useEffect, useMemo, useState } from "react";
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
  var {
    chartControlData,
    tabData,
    accessDenied,
    appData,
    isLoading,
    sortOrderInfo,
  } = useAppData();

  const [region, setregion] = useState([]);
  const sheetData = useGetSheetData();
  const [activePrimaryTab, setActivePrimaryTab] = useState(0);
  var subTabGroups = [];
  var subTabTitles = [];
  const [primaryTabOrder, setPrimaryTabOrder] = useState(0);

  //set the primary tab order
  useEffect(() => {
    // console.log("sortOrderInfo", sortOrderInfo);
    // console.table(sortOrderInfo);

    // var ut = [...new Set(sortOrderInfo.map((item) => item.tab_order))].map(
    //   (item, i) => {
    //     return sortOrderInfo.find((sortitem) => {
    //       return sortitem.tab_order == item;
    //     });
    //   }
    // );
    // console.log("ut", ut);

    let primaryTabOrder = sortOrderInfo
      .filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.tab_order === obj.tab_order)
      )
      .map((item) => item.tab_name);
    // console.log("primaryTabOrder", primaryTabOrder);
    setPrimaryTabOrder(primaryTabOrder);
  }, [sortOrderInfo]);

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
    console.log("Primary tab change");
    console.log(sortOrderInfo);
    console.log("activePrimaryTab", activePrimaryTab);

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
  const sortedData = useMemo(() => {
    if (chartControlData !== null) {
      setregion(chartControlData[0][7]?.qText);
      //return chartControlData;
      return flow(sortBy((d) => d[1].qNum))(chartControlData);
    } else {
      return null;
    }
  }, [chartControlData]);
  //console.log("sortedData", sortedData);

  //get primary tabs
  const primaryTabs = useMemo(() => {
    console.log("****Getting primaryTabs");

    //primary tabs form fact data
    let qUniquePrimaryTab = [...new Set(tabData.map((item) => item[1].qText))];
    console.log("qUniquePrimaryTab", qUniquePrimaryTab);

    // reordering primary tabs from fact, based on sortinfo/island table
    var pTabs = [];
    if (primaryTabOrder.length) {
      primaryTabOrder.map((item, i) => {
        if (qUniquePrimaryTab.includes(item)) pTabs.push(item);
        // return qUniquePrimaryTab.includes(item) ? item : "";
      });
      console.log("pTabs", pTabs);
    }
    return pTabs;
  }, [tabData, primaryTabOrder]);

  //get primary tabGroup
  const primaryTabgroups = useMemo(() => {
    if (primaryTabs.length && sortedData != null) {
      console.log("****Getting Primary groups");
      return primaryTabs.map((t, i) => {
        return sortedData.filter((d) => {
          return d[18].qText === primaryTabs[i];
        });
      });
    }
  }, [primaryTabs, sortedData]);

  //get subtab titles
  subTabTitles = useMemo(() => {
    let _subTabs = [];

    if (primaryTabgroups != undefined) {
      console.log("****Getting subTabTitles");
      console.log("activePrimaryTab**", activePrimaryTab);
      console.log("primaryTabs**", primaryTabs);

      //get subtab order for the activePrimaryTab
      let subTabOrder = sortOrderInfo
        .filter(
          (obj, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.sub_order === obj.sub_order &&
                t.tab_name === primaryTabs[activePrimaryTab]
            )
        )
        .map((item) => item.sub_tab_name);
      console.log("subTabOrder", subTabOrder);

      //unique sub tabs from fact data
      var qUniqueSubTabs = [
        ...new Set(
          primaryTabgroups[activePrimaryTab].map((t, i) => {
            return t[11].qText;
          })
        ),
      ];
      console.log("qUniqueSubTabs", qUniqueSubTabs);

      // reordering primary tabs based on sortinfo
      var sTabs = [];
      if (subTabOrder.length) {
        subTabOrder.map((item, i) => {
          if (qUniqueSubTabs.includes(item)) sTabs.push(item);
          // return qUniqueSubTabs.includes(item) ? item : "";
        });
        console.log("sTabs", sTabs);
      }

      //return qUniqueSubTabs;
      return sTabs;
    } else {
      return [];
    }
  }, [primaryTabgroups, activePrimaryTab]);

  if (tabData !== undefined && tabData.length) {
    //get subtab data
    getSubData();
  }

  // useEffect(() => {
  //   console.log("---primaryTabs", primaryTabs);
  //   console.log("---primaryTabgroups", primaryTabgroups);
  //   console.log("--subTabTitles", subTabTitles);
  //   console.log("---subTabGroups", subTabGroups);
  // }, [primaryTabs, primaryTabgroups, subTabTitles, subTabGroups]);

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
    primaryTabs.length === 0 ||
    connectionError.doc.error ||
    chartControlData === undefined ||
    chartControlData === null;

  connectionError.doc.error;
  return (
    <div className={noDataCondition ? "noAccessBg" : ""}>
      {accessDenied || connectionError.doc.error !== null ? (
        <PlaceHolder message="No data available" />
      ) : connectionError.session.error !== null ? (
        <PlaceHolder message="Connection Failed" />
      ) : region === "EMEAf" ? (
        <PlaceHolder message="We are working to update the charts and views on this page. Please go to the Lenovo 360 Incentives page under Programs & Training menu for details of your earnings." />
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
                  {appData !== null && sortedData !== null ? (
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
                    activeSubTab={tabN}
                    activePrimaryTabName={primaryTabs[activePrimaryTab]}
                    sortOrderInfo={sortOrderInfo}
                  />
                  {/* tab <br></br>
                  {primaryTabs[activePrimaryTab]} <br></br>
                  {subTabTitles[idx]} */}
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
