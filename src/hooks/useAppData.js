import { useState, useEffect, useCallback } from "react";
import { useSessionObject, useHyperCubeData } from "./index";
import chartControlDef from "../qDefs/List/chartControl";
import appDataDef from "../qDefs/List/appDataDef";
import { useGetLayout } from "qlik-hooks/GenericObject";
import { copySync } from "fs-extra";
// import testData from "../TestData/TestData";

export default () => {
  const [chartControlData, setChartControlData] = useState(null);
  const [appData, setAppData] = useState(null);
  const [isLoading, setPreLoader] = useState(true);
  const [sortOrderInfo, setOrderInfo] = useState([]);
  const [isControlDataLoaded, setControlDataLoaded] = useState(false);

  //testData
  // const { qsortData_testData } = testData();

  //Get the chartControl data/fact data
  const chartControl = useHyperCubeData({
    def: chartControlDef,
    dataTransformFunc: useCallback((qHyperCube) => {
      // console.log(qHyperCube);
      // const qMatrix = qHyperCube.qDataPages[0].qMatrix;
      //    console.log("chartControl",qMatrix);
      return qHyperCube.qDataPages.length > 0
        ? qHyperCube.qDataPages[0].qMatrix
        : null;
    }, []),
  });

  //set the chart control matrix to state
  useEffect(() => {
    if (chartControl.data !== null) {
      setControlDataLoaded(true);
      [...chartControl.data].map((f) => {
        if (!f[11].qText) {
          f[11].qText = "-"; // if sutab title is empty/undefined, replace it to "-"
        }
        return f;
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
            qFieldDefs: ["tab_name"], //1/
          },
        },
        {
          qDef: {
            qFieldDefs: ["sub_tab_order"], //1/
          },
        },
        {
          qDef: {
            qFieldDefs: ["sub_tab_name"], //1/
          },
        },
        {
          qDef: {
            qFieldDefs: ["header_order"], //1/
          },
        },
        {
          qDef: {
            qFieldDefs: ["header_name"], //1/
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
    chartControlData,
    appData,
    isLoading,
  };
};
