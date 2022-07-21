import { useState, useEffect, useCallback, useContext } from "react";
import { useHyperCubeData } from "./index";
import drillDownDataDef from "../qDefs/List/drillDownDataDef";
import { QlikContext } from "./QlikProvider";

export default () => {
  const [sheetData, setSheetData] = useState(null);
  const { apps } = useContext(QlikContext);
  const { config } = useContext(QlikContext);

  const sheets = useHyperCubeData({
    def: drillDownDataDef,
    dataTransformFunc: useCallback((qHyperCube) => {
      return qHyperCube.qDataPages[0].qMatrix.map((sheet) => ({
        app: {},
        sheetId: sheet[0].qText,
        engineObjectId: sheet[0].qText,
        sheetName: sheet[1].qText,
        description: sheet[2].qText,
        appName: sheet[3].qText
      }));
    }, []),
  });

  
  useEffect(() => {
    if (apps && sheets && sheets.data) {
      sheets.data.forEach(sheet => {
        sheet.app.id = apps.find(app => app.name === sheet.appName)?.resourceId
        sheet.tenant = config.host;
      });
      setSheetData(sheets.data);
    }
  }, [apps, sheets]);

  return sheetData;
};
