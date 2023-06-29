import { useState, useEffect, useCallback } from "react";
import { useSessionObject, useHyperCubeData } from "./index";
import chartControlDef from "../qDefs/List/chartControl";
import appDataDef from "../qDefs/List/appDataDef";
import { useGetLayout } from "qlik-hooks/GenericObject";
// import testData from "../TestData/TestData";

export default () => {
  const [chartControlData, setChartControlData] = useState(null);
  const [appData, setAppData] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isLoading, setPreLoader] = useState(true);
  const [tabData, setTab] = useState([]);
  const [sortOrderInfo, setOrderInfo] = useState([]);
  const [isControlDataLoaded, setControlDataLoaded] = useState(false);

  //testData
  // const { qsortData_testData } = testData();
  //Get the chartControl data/fact data
  const chartControl = useHyperCubeData({
    def: chartControlDef,
    dataTransformFunc: useCallback(
      (qHyperCube) => {
        // console.log(qHyperCube)
        // const qMatrix = qHyperCube.qDataPages[0].qMatrix;
        //    console.log("chartControl",qMatrix);
        return qHyperCube.qDataPages.length > 0
          ? qHyperCube.qDataPages[0].qMatrix
          : null;
      },
      [chartControlDef]
    ),
  });

  //set the chart control matrix to state
  useEffect(() => {
    if (chartControl.data !== null) {
      setControlDataLoaded(true);

      //const clone_chartControl = [...chartControl.data];
      [...chartControl.data].map((f) => {
        if (!f[11].qText) {
          f[11].qText = "-"; // if sutab title is empty/undefined, replace it to "-"
        }
        if (!f[17].qText) {
          f[17].qText = "-";
        }
      });

      setChartControlData(chartControl.data);
    }
  }, [chartControl]);

  const appLayout = useHyperCubeData({
    def: appDataDef,
    dataTransformFunc: useCallback((qHyperCube) => {
      const qMatrix = qHyperCube.qDataPages[0].qMatrix[0];
      return {
        quarter: qMatrix[0].qText,
        quarterStartDate: qMatrix[1].qText,
        quarterEndDate: qMatrix[2].qText,
        snapDate: qMatrix[3].qText,
      };
    }, []),
  });
  //set the chart control matrix to state
  useEffect(() => {
    if (appLayout.data !== null) {
      setAppData(appLayout.data);
      if (isControlDataLoaded) setPreLoader(false);
    }
  }, [chartControl, appLayout]);

  ///hypercube call to pull tabs from fact table
  const tabField = useSessionObject({
    qInfo: {
      qType: "tab list",
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["sub_tab"],
            qSortCriterias: [
              {
                qSortByState: 0,
                qSortByFrequency: 0,
                qSortByNumeric: 0,
                qSortByAscii: 1,
                qSortByLoadOrder: 0,
                qSortByExpression: 1,
                // qExpression: {
                //   // qv: "MATCH(tab, 'PCSD Sales Overview','PCSD Main Program', 'PCSD Specialist Program', 'ISG Sales Overview','ISG Main Program', 'ISG Specialist Program', 'ISG')"
                //   qv: "MATCH(sub_tab," + "'" + tabOrder.join("','") + "'" + ")",
                // },
              },
            ],
          },
        },
        {
          qDef: {
            qFieldDefs: ["tab"], //1/
          },
        },
      ],
      qInitialDataFetch: [
        {
          qWidth: 2,
          qHeight: 100,
        },
      ],
    },
  });

  // Get the layout of the tabs session object and set it to state.
  const tabLayout = useGetLayout(tabField, {
    params: [],
    invalidations: true,
  }).qResponse;

  //error handling for failure to get response from Qlik
  useEffect(() => {
    if (tabLayout !== null) {
      let s = tabLayout.qHyperCube.qDataPages[0].qMatrix;
      s.forEach((element) => {
        element.forEach((f) => {
          if (!f.hasOwnProperty("qText")) {
            f.qText = "-";
          }
        });
      });
      setTab(s);
      // setTab(tabLayout.qHyperCube.qDataPages[0].qMatrix);
    }
  }, [tabLayout]);

  ////

  ///Create session object for business group
  const sortOrderTable = useSessionObject({
    qInfo: {
      qType: "order list",
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["tab_order"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["tab_name"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["sub_tab_order"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["sub_tab_name"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["header_order"],
          },
        },
        {
          qDef: {
            qFieldDefs: ["header_name"],
          },
        },
      ],
      qInitialDataFetch: [
        {
          qWidth: 6,
          qHeight: 100,
        },
      ],
    },
  });

  // Get the layout of the business groups session object and set it to state.
  const TitleOrderLayout = useGetLayout(sortOrderTable, {
    params: [],
    invalidations: true,
  }).qResponse;

  //error handling for failure to get response from Qlik
  useEffect(() => {
    if (TitleOrderLayout !== null) {
      let qsortData = TitleOrderLayout.qHyperCube.qDataPages[0].qMatrix;
      //console.log("qsortData", qsortData);

      //testdata not for production
      // if (qsortData.length == 0) {
      //   qsortData = qsortData_testData;
      // }

      var srAr = [];
      qsortData.map((item, i) => {
        let d = {
          tab_order: item[0].qText,
          tab_name: item[1].qText,
          sub_order: item[2].qText,
          sub_tab_name: item[3].qText,
          header_order: item[4].qText,
          header_name: item[5].qText,
        };
        srAr.push(d);
      });
      // console.table(srAr);

      setOrderInfo(srAr);
    }
  }, [TitleOrderLayout]);

  return {
    sortOrderInfo,
    tabData,
    chartControlData,
    accessDenied,
    appData,
    isLoading,
  };
};
