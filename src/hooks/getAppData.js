import { useContext, useState, useEffect } from "react";
import { QlikContext } from "./QlikProvider";
import appDataDef from "../qDefs/List/appDataDef";
export default () => {
  const { engineApp } = useContext(QlikContext);
  const [appData, SetAppData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [sessionObj, setSessionObj] = useState(null);
  const [appDataLayout, setAppDataLayout] = useState(null);

  const fetchData = async () => {
    try {
      console.log("fetch app data");
      let sessionObj = await engineApp.createSessionObject(appDataDef);
      setSessionObj(sessionObj);
      // console.log("sessionObj", sessionObj);
      const layout = await sessionObj.getLayout();
      // console.log("layout", layout);
      setAppDataLayout(layout);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (appData == null) fetchData();
  }, []);

  useEffect(() => {
    console.log("set app Layout");
    if (appDataLayout) {
      let hQube = appDataLayout.qHyperCube;
      console.log("hQube", hQube);
      const qMatrix = hQube.qDataPages[0].qMatrix[0];
      console.log(qMatrix);

      let appDT = {
        quarter: qMatrix[0].qText,
        quarterStartDate: qMatrix[1].qText,
        quarterEndDate: qMatrix[2].qText,
        snapDate: qMatrix[3].qText,
      };

      SetAppData(appDT);
      // setTimeout(() => {
      setLoading(false);
      // }, 3000);
    }
  }, [appDataLayout]);

  return { appData, isLoading };
};
