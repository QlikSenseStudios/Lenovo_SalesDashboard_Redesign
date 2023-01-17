import { useState, useEffect, useCallback } from "react";
import { useSessionObject, useHyperCubeData } from "./index";
import chartControlDef from "../qDefs/List/chartControl";
import appDataDef from "../qDefs/List/appDataDef";
import { useGetLayout } from "qlik-hooks/GenericObject";

export default () => {
  const [chartControlData, setChartControlData] = useState(null);
  const [appData, setAppData] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isLoading, setPreLoader] = useState(true);
  const [tabData, setTab] = useState([]);

  //Get the information for which charts and data to display.
  const chartControl = useHyperCubeData({
    def: chartControlDef,
    dataTransformFunc: useCallback(
      (qHyperCube) => {
        // console.log(qHyperCube)
        // const qMatrix = qHyperCube.qDataPages[0].qMatrix;
    //    console.log("chartControl",qMatrix);
        return qHyperCube.qDataPages.length > 0 ? qHyperCube.qDataPages[0].qMatrix: null;
      },
      [chartControlDef]
    ),
  });

  //set the chart control matrix to state
  useEffect(() => {
    if (chartControl.data !== null) {
      setChartControlData(chartControl.data);
    }
  }, [chartControl]);

  //Get the information for which charts and data to display.

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
      setPreLoader(false)
    }
  }, [chartControl, appLayout]);


const tabOrder = ['PCSD Sales Overview',
                  'PCSD Main Program', 
                  'PCSD Specialist Program',
                  'PCSD Program Performance',
                  'PCSD Sales Performance',
                  'PCSD - Sales', 
                  'PCSD - Services', 
                  'PCSD - Rebates',
                  'ISG',
                  'ISG Sales Overview',
                  'ISG Main Program', 
                  'ISG Specialist Program',
                  'ISG Sales Performance',
                  'ISG Program Performance',
                  'Tier',
                  'Others',
                ]


   ///Create session object for business group
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
              qExpression: {
               // qv: "MATCH(tab, 'PCSD Sales Overview','PCSD Main Program', 'PCSD Specialist Program', 'ISG Sales Overview','ISG Main Program', 'ISG Specialist Program', 'ISG')"
                qv : "MATCH(sub_tab,"+"'" + tabOrder.join("','") + "'" +")" 
                
              },
            },
          ],
          }
         
        }, {
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


  // Get the layout of the business groups session object and set it to state.
  const tabLayout = useGetLayout(tabField, {
    params: [],
    invalidations: true,
  }).qResponse;

  //error handling for failure to get response from Qlik
  useEffect(() => {
    if (tabLayout !== null) {
      console.log(tabLayout.qHyperCube.qDataPages[0])
      setTab(tabLayout.qHyperCube.qDataPages[0].qMatrix);
    }
  }, [tabLayout]);


  return {
    tabData,
    chartControlData,
    accessDenied,
    appData,
    isLoading
  };
};
