import { groupBy as lodashGroupBy } from "lodash";
import { useCallback, useMemo } from "react";

export default (data, tabName) => {
  console.log("usepage:" + tabName);
  //console.log("region Check",data?data[0][7].qText==="EMEA":0);
  // // updating the position data based on the BP-Sybtype
  // // since the position cant be handled from App, updating the actual position vales from App
  // //Applicable for - tabs Specialist and region EMEA
  if (
    tabName.includes("Specialist") && data[0] ? data[0][7].qText === "EMEA" : 0
  ) {
    //console.log("includes specalist");
    // console.log(data);

    let bpTypeGroup = lodashGroupBy(data, (d) => d[17].qText.toLowerCase());
    //console.log("bpGroup",bpGroup);
    // list of bp subtypes
    let keys = Object.keys(bpTypeGroup);

    Object.keys(bpTypeGroup).forEach((key) => {
      // console.log(key, bpGroup[key]);
      // console.log(row);
      let rowNum = keys.indexOf(key);

      bpTypeGroup[key].map((d, i) => {
        d[1].row = rowNum + 1;
        //  let derivedPostion =   d[1].qNum+row;
        //  d[1].qNum = derivedPostion;
        //d[1].qText = derivedPostion.toString();

        let derivedPostion = Number(d[1].qText) + rowNum;
        d[1].qNum = derivedPostion;
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
  // // group charts with same position value together
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
