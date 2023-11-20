import { useContext, useState, useEffect } from "react";
import { QlikContext } from "./QlikProvider";
export default () => {
  const { engineApp } = useContext(QlikContext);
  const [sortOrderInfo, setSortOrderInfo] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [sessionObj, setSessionObj] = useState(null);
  const [sortOrderInfoLayout, setSortOrderInfoLayout] = useState(null);

  const qDef = {
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
  };

  const fetchData = async () => {
    try {
      console.log("fetch");
      let sessionObj = await engineApp.createSessionObject(qDef);
      setSessionObj(sessionObj);
      // console.log("sessionObj", sessionObj);
      const layout = await sessionObj.getLayout();
      // console.log("layout", layout);
      setSortOrderInfoLayout(layout);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!sortOrderInfo.length) fetchData();
  }, []);

  useEffect(() => {
    console.log("set tab Layout");
    if (sortOrderInfoLayout) {
      let hQube = sortOrderInfoLayout.qHyperCube;
      //console.log("hQube", hQube);
      let qsortData = hQube.qDataPages[0].qMatrix;

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

      //console.log("hypSortOrderInfo", srAr);
      setSortOrderInfo(srAr);
      setLoading(false);
    }
  }, [sortOrderInfoLayout]);

  return { sortOrderInfo, isloading };
};
