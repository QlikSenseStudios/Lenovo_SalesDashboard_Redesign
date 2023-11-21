import { useState, useEffect, useContext } from "react";
import drillDownDataDef from "../qDefs/List/drillDownDataDef";
import { QlikContext } from "./QlikProvider";

export default () => {
  const [sheetData, setSheetData] = useState(null);
  const { apps } = useContext(QlikContext);
  const { config, engineApp } = useContext(QlikContext);

  const [data, setData] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [sessionObj, setSessionObj] = useState(null);
  const [tabDataLayout, setTabDataLayout] = useState(null);

  const fetchData = async () => {
    try {
      // console.log("fetch tab");
      let sessionObj = await engineApp.createSessionObject(drillDownDataDef);
      setSessionObj(sessionObj);
      // console.log("sessionObj", sessionObj);
      const layout = await sessionObj.getLayout();
      // console.log("layout", layout);
      setTabDataLayout(layout);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!data.length) fetchData();
  }, []);

  useEffect(() => {
    console.log("set tab Layout");
    if (tabDataLayout) {
      let hQube = tabDataLayout.qHyperCube;
      //console.log("hQube", hQube);
      let sheets = hQube.qDataPages[0].qMatrix;
      // console.log("hqsheet", sheets);

      let s = sheets.map((sheet) => ({
        app: {},
        sheetId: sheet[0].qText,
        engineObjectId: sheet[0].qText,
        sheetName: sheet[1].qText,
        description: sheet[2].qText,
        appName: sheet[3].qText,
      }));

      //console.log("hySheet", s);

      setData(s);
      setLoading(false);
    }
  }, [tabDataLayout]);

  // const sheets = useHyperCubeData({
  //   def: drillDownDataDef,
  //   dataTransformFunc: useCallback((qHyperCube) => {
  //     return qHyperCube.qDataPages[0].qMatrix.map((sheet) => ({
  //       app: {},
  //       sheetId: sheet[0].qText,
  //       engineObjectId: sheet[0].qText,
  //       sheetName: sheet[1].qText,
  //       description: sheet[2].qText,
  //       appName: sheet[3].qText,
  //     }));
  //   }, []),
  // });

  useEffect(() => {
    if (apps && data) {
      data.forEach((sheet) => {
        sheet.app.id = apps.find(
          (app) => app.name === sheet.appName
        )?.resourceId;
        sheet.tenant = config.host;
      });
      setSheetData(data);
    }
  }, [apps, data, config]);

  return sheetData;
};
