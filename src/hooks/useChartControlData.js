import { useContext, useState, useEffect } from "react";
import { QlikContext } from "./QlikProvider";
import chartControlDef from "../qDefs/List/chartControl";
export default () => {
  const { engineApp } = useContext(QlikContext);
  const [chartControlData, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [sessionObj, setSessionObj] = useState(null);
  const [chartDataLayout, setChartDataLayout] = useState(null);

  const fetchData = async () => {
    try {
      console.log("chartControlData fetch");
      let sessionObj = await engineApp.createSessionObject(chartControlDef);
      setSessionObj(sessionObj);
      // console.log("sessionObj", sessionObj);
      const layout = await sessionObj.getLayout();
      // console.log("layout", layout);
      setChartDataLayout(layout);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (chartControlData == null) fetchData();
  }, []);

  useEffect(() => {
    //console.log("set ChartControl Layout");
    if (chartDataLayout) {
      let hQube = chartDataLayout.qHyperCube;
      //  console.log("hQube", hQube);
      let chartData = hQube.qDataPages[0].qMatrix;

      [...chartData].map((f) => {
        if (!f[11].qText) {
          f[11].qText = "-"; // if sutab title is empty/undefined, replace it to "-"
        }

        // if (!f[17].qText) {
        //   f[17].qText = "-";
        // }
      });

      // console.log("ChartControl data", chartData);
      setData(chartData);
      // setTimeout(() => {
      setLoading(false);
      // }, 5000);
    }
  }, [chartDataLayout]);

  return { chartControlData, isLoading };
};
