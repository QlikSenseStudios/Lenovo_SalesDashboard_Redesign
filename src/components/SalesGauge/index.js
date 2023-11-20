import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import { useGaugeContainer } from "../../hooks/index";
import { QlikContext } from "../../hooks/QlikProvider";
import "./style.scss";

export default ({ qDef: objDef }) => {
  const { engineApp } = useContext(QlikContext);
  const [data, setData] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [sessionObj, setSessionObj] = useState(null);
  const [chartDataLayout, setChartDataLayout] = useState(null);

  const def = useMemo(
    () => ({
      qInfo: { qType: "gauge" },
      qHyperCubeDef: {
        qMeasures: objDef.map((def) => ({ qLibraryId: def[5].qText })),
        qInitialDataFetch: [{ qWidth: 3, qHeight: 10000 / 3 }],
      },
    }),
    [objDef]
  );

  //get data for gauge
  // const { dataT } = useHyperCubeData({
  //   def,
  //   dataTransformFunc: useCallback((qHyperCube) => {
  //     const row = qHyperCube.qDataPages[0].qMatrix[0];
  //     return {
  //       subtitle: qHyperCube.qMeasureInfo[0].qFallbackTitle,
  //       value: row[0].qText,
  //       note1Value: row[1].qText,
  //       note2Value: row[2].qNum >= 1 ? 1 : row[2].qNum,
  //       note2Text: row[2].qText,
  //       note1Title: qHyperCube.qMeasureInfo[1].qFallbackTitle,
  //       note2Title: qHyperCube.qMeasureInfo[2].qFallbackTitle,
  //     };
  //   }, []),
  // });

  useEffect(() => {
    if (!data.length) fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let sessionObj = await engineApp.createSessionObject(def);
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
    if (chartDataLayout) {
      let hQube = chartDataLayout.qHyperCube;
      // let tabs = hQube.qDataPages[0].qMatrix;
      let newData = hQube.qDataPages[0].qMatrix.map(function (item) {
        return {
          quarter: item[0].qText,
          week: item[1].qText,
          pos: item[2].qText,
          kpi_value_type: item[3].qText,
          lbl: item[4].qText,
          val: item[5].qText,
        };
      });
      setData(newData);
      setLoading(false);
    }
  }, [chartDataLayout]);

  const container = useGaugeContainer(data);

  if (!data) return null;
  const { subtitle, value, note1Value, note2Text, note1Title, note2Title } =
    data;

  return (
    <div className="circle-block circle_2">
      <div className="utilization_container">
        <svg viewBox="0 0 100 100" className="svg">
          <g className="background-container"></g>
          <g ref={container} className="foreground-container"></g>
        </svg>
        <div className="percentage percentage2">
          <div className="subtitle">{subtitle}</div>
          <div className="display">{value}</div>
          <div className="note">
            {note2Text} {note2Title}
          </div>
          <div className="note">
            {note1Value} {note1Title}
          </div>
        </div>
      </div>
    </div>
  );
};
