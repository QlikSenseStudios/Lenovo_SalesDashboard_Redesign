import { groupBy as lodashGroupBy } from "lodash";
import { useCallback, useMemo } from "react";

export default (data, tabName) => {
  // console.log("usepage:" + tabName);
  //console.log("region Check",data?data[0][7].qText==="EMEA":0);
  // // updating the position data based on the BP-Sybtype
  // // since the position cant be handled from App, updating the actual position vales from App
  // //Applicable for - tabs Specialist and region EMEA
  if (
    tabName.includes("Specialist") && data[0] ? data[0][7].qText === "EMEA" : 0
  ) {
    //  console.log("includes specalist");
    // console.log(data);

    //grouping by headers
    let grouping = lodashGroupBy(data, (d) => d[17].qText.toLowerCase());
    // console.log("bpGroup", grouping);

    // list of headers
    let keys = Object.keys(grouping);

    Object.keys(grouping).forEach((key) => {
      let rowNum = keys.indexOf(key);

      grouping[key].map((d, i) => {
        d[1].row = rowNum + 1;
        //  let derivedPostion =   d[1].qNum+row;
        //  d[1].qNum = derivedPostion;
        //d[1].qText = derivedPostion.toString();
        let derivedPostion = Number(d[1].qText) + rowNum;
        d[1].qNum = derivedPostion;
      });
    });
  } else {
    // console.log("non EMEA and non specalist");
    //console.log(data);
    //grouping by headers
    let grouping = lodashGroupBy(data, (d) => d[17].qText.toLowerCase());
    // console.log("grouping", grouping);
    let keys = Object.keys(grouping);

    Object.keys(grouping).forEach((key) => {
      let rowNum = keys.indexOf(key);
      //  console.log(rowNum);
      grouping[key].map((d, i) => {
        // console.log(d[1].row);
        d[1].row = rowNum + 1;
        d[0].row = rowNum + 1;
        let derivedPostion = Number(d[1].qNum) + rowNum;
        // console.log("derivedPostion",derivedPostion);
        d[1].qNum = derivedPostion; // qNum and qText to handle posion data to have all charts displayed
      });
    });
  }

  const {
    kpi: kpis,
    gauge: gauges,
    line: lines,
    bar: bars,
    leap: leaps,
    doughnut: doughnut,
  } = lodashGroupBy(data, (d) => d[2].qText.toLowerCase());

  // // group values with same position value together
  const groupBy = useCallback((data) => {
    return Object.values(lodashGroupBy(data, (d) => d[1].qNum));
  }, []);

  const groupedKpis = useMemo(() => groupBy(kpis), [groupBy, kpis]);
  const groupedGauges = useMemo(() => groupBy(gauges), [groupBy, gauges]);
  const groupedLines = useMemo(() => groupBy(lines), [groupBy, lines]);
  const groupedBars = useMemo(() => groupBy(bars), [groupBy, bars]);
  const groupedLeaps = useMemo(() => groupBy(leaps), [groupBy, leaps]);
  const groupedDoughnut = useMemo(() => groupBy(doughnut), [groupBy, doughnut]);

  return {
    groupedKpis,
    groupedGauges,
    groupedLines,
    groupedBars,
    groupedLeaps,
    groupedDoughnut,
  };
};
