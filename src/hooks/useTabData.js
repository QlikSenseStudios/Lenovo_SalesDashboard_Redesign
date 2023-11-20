import { useContext, useState, useEffect } from "react";
import { QlikContext } from "../hooks/QlikProvider";
export default () => {
  const { engineApp } = useContext(QlikContext);
  const [tabData, setData] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [sessionObj, setSessionObj] = useState(null);
  const [tabDataLayout, setTabDataLayout] = useState(null);

  const qDef = {
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
  };

  const fetchData = async () => {
    try {
      console.log("fetch tab");
      let sessionObj = await engineApp.createSessionObject(qDef);
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
    if (!tabData.length) fetchData();
  }, []);

  useEffect(() => {
    console.log("set tab Layout");
    if (tabDataLayout) {
      let hQube = tabDataLayout.qHyperCube;
      //console.log("hQube", hQube);
      let tabs = hQube.qDataPages[0].qMatrix;

      tabs.forEach((element) => {
        element.forEach((f) => {
          if (!f.hasOwnProperty("qText")) {
            f.qText = "-";
          }
        });
      });

      //console.log("hyTabData", tabs);
      setData(tabs);
      setLoading(false);
    }
  }, [tabDataLayout]);

  return { tabData, isloading };
};
