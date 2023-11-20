import React, { useEffect, useMemo, useState, useContext } from "react";
import "./App.css";

// Shared Components
import Page from "./Pages/PerformancePage";

// Lodash
import { flow, sortBy } from "lodash/fp";
import PlaceHolder from "./components/PlaceHolder";
import Loader from "./components/Loader";
import { QlikContext } from "./hooks/QlikProvider";
import {
  // useSession,
  // useAppData,
  useGetSheetData,
  useTabData,
  useChartControlData,
  useAppxData,
  useSortOrderData,
} from "./hooks/index";
import Tab from "./components/tab";

const App = () => {
  //console.log("Performance Page");
  //Qlik error handling
  const { connectionError } = useContext(QlikContext);

  var { sortOrderInfo, isLoading } = useSortOrderData();
  // console.log("isLoading***", isLoading);
  var { tabData, isLoading } = useTabData();
  // console.log("usetabData isLoading", isLoading);
  var { chartControlData, isLoading } = useChartControlData();
  var { appData, isLoading } = useAppxData();
  // console.log("appData**", appData);

  var accessDenied = false;
  // var isLoading = true;

  // var {
  //   //   chartControlData,
  //   //   tabData,
  //   //   accessDenied,
  //   //   appData,
  //   isLoading,
  //   //   sortOrderInfo,
  // } = useAppData();

  // console.log("isLoading", isLoading);

  const [region, setregion] = useState([]);
  const sheetData = useGetSheetData();
  const [activePrimaryTab, setActivePrimaryTab] = useState(0);
  var subTabGroups = [];
  var subTabTitles = [];

  function getSubTabGroups() {
    if (primaryTabgroups !== undefined && subTabTitles !== undefined) {
      let groupsd = subTabTitles.map((t, i) => {
        return primaryTabgroups[activePrimaryTab].filter((d) => {
          return d[11].qText === t;
        });
      });
      subTabGroups = groupsd;
    }
  }

  //1. set the primary tab order from order info island table
  const primaryTabOrder = useMemo(() => {
    // console.log("sortOrderInfo", sortOrderInfo);
    //console.table(sortOrderInfo);

    return sortOrderInfo
      .filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.tab_order === obj.tab_order)
      )
      .map((item) => item.tab_name);
  }, [sortOrderInfo]);

  //2. get primary tabs
  const primaryTabs = useMemo(() => {
    // console.log("****Getting primaryTabs");
    console.log("tabData", tabData);
    // console.log("primaryTabOrder", primaryTabOrder);
    //primary tabs form fact data
    let qUniquePrimaryTab = [...new Set(tabData.map((item) => item[1].qText))];
    // console.log("qUniquePrimaryTab", qUniquePrimaryTab);

    // reordering primary tabs from fact, based on sortinfo/island table
    var pTabs = [];
    if (primaryTabOrder.length) {
      primaryTabOrder.map((item, i) => {
        if (qUniquePrimaryTab.includes(item)) pTabs.push(item);
        // return qUniquePrimaryTab.includes(item) ? item : "";
      });
      //console.log("pTabs", pTabs);
    }
    return pTabs;
  }, [tabData, primaryTabOrder]);

  subTabGroups = useMemo(() => {
    // console.log("Primary tab change");
    // // console.log(sortOrderInfo);
    // console.log("activePrimaryTab", activePrimaryTab);

    if (primaryTabgroups !== undefined && subTabTitles !== undefined) {
      console.log("doing**************888");
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
  const controlDataSorted = useMemo(() => {
    if (chartControlData !== null) {
      // console.log("chartControlData", chartControlData);
      setregion(chartControlData[0][7]?.qText);
      //return chartControlData;
      return flow(sortBy((d) => d[1].qNum))(chartControlData);
    } else {
      return null;
    }
  }, [chartControlData]);

  //3.get primary tabGroup
  const primaryTabgroups = useMemo(() => {
    if (primaryTabs.length && controlDataSorted != null) {
      // console.log("****Getting Primary groups");
      return primaryTabs.map((t, i) => {
        return controlDataSorted.filter((d) => {
          return d[18].qText === primaryTabs[i]; //primary tab from fact
        });
      });
    }
  }, [primaryTabs, controlDataSorted]);

  //4.get subtab order and reorder titles when active tab is changed
  subTabTitles = useMemo(() => {
    if (primaryTabgroups != undefined) {
      console.log("****Getting subTabTitles");
      console.log("activePrimaryTab**", activePrimaryTab);
      console.log("primaryTabs**", primaryTabs);
      console.log("sortOrderInfo", sortOrderInfo);

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
            return t[11].qText; //su tabs
          })
        ),
      ];
      // console.log("qUniqueSubTabs", qUniqueSubTabs);

      //sales, incent

      // reordering primary tabs based on sortinfo
      var sTabs = [];
      if (subTabOrder.length) {
        subTabOrder.map((item, i) => {
          if (qUniqueSubTabs.includes(item)) sTabs.push(item);
          // return qUniqueSubTabs.includes(item) ? item : "";
        });
        //console.log("sTabs", sTabs);
      }

      //return qUniqueSubTabs;
      return sTabs;
    } else {
      return [];
    }
  }, [primaryTabgroups, activePrimaryTab]);

  if (tabData !== undefined && tabData.length) {
    //get subtab data
    getSubTabGroups();
  }

  useEffect(() => {
    // console.log("---primaryTabs", primaryTabs);
    // console.log("---primaryTabgroups", primaryTabgroups);
    // console.log("--subTabTitles", subTabTitles);
    // console.log("---subTabGroups", subTabGroups);
    // console.log("---sheetData", sheetData);
    // console.log("---activePrimaryTab ", activePrimaryTab);
  }, [primaryTabs, primaryTabgroups, subTabTitles, subTabGroups, sheetData]);

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
  // connectionError.doc.error = "Error";
  // connectionError.session.error = "error";
  //primaryTabs.length = 0;

  var noDataCondition =
    subTabTitles.length === 0 ||
    subTabTitles === null ||
    subTabTitles === undefined ||
    primaryTabgroups === undefined ||
    primaryTabs.length === 0 ||
    connectionError.doc.error ||
    chartControlData === undefined ||
    chartControlData === null;

  return (
    <div className={noDataCondition ? "noAccessBg" : ""}>
      {connectionError.session.error != null ? (
        <PlaceHolder message="Connection Failed" />
      ) : noDataCondition ? (
        <PlaceHolder message="No data available" />
      ) : region === "some region" ? (
        <PlaceHolder message="We are working to update the charts and views on this page. Please go to the Lenovo 360 Incentives page under Programs & Training menu for details of your earnings." />
      ) : (
        sheetData != null &&
        appData !== null && (
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
                    {appData !== null && controlDataSorted !== null ? (
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
                  </Tab.TabPane>
                );
              })}
            </Tab>
          </div>
        )
      )}
    </div>
  );
};
export default App;
