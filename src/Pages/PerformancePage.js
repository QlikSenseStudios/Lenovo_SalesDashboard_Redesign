import React, { useMemo, useCallback, useRef } from "react";
import { Gauge, Kpi, Line, LeapKpi, Bar, Doughnut } from "../components";
import { usePageData } from "../hooks/index";
import PlaceHolder from "../components/PlaceHolder";
import DrillDownUrl from "../DrillDownUrl";
import { isNull, iteratee } from "lodash";
import ViewMore from "../components/ViewMore";
import { groupBy as lodashGroupBy } from "lodash";
import { sortBy as lodashsortBy } from "lodash";

const Page = ({ data, sheetData, tabName }) => {
  const dubugger = true;
  // console.log("tab change triggered", tabName);
  console.log("data", data);

  // console.log("Sheet data",sheetData)
  const {
    groupedKpis,
    groupedGauges,
    groupedLines,
    groupedBars,
    groupedLeaps,
    groupedDoughnut,
  } = usePageData(data, tabName);

  const bottomRowCount =
    groupedGauges.length + groupedLines.length + groupedKpis.length;
  // console.log("bottomRowCount", bottomRowCount);

  const kpiTopRowCount = groupedKpis.filter(
    (d, i) => d[0][1].qNum !== 2
  ).length;
  // console.log("rendering top Kpi")
  // console.log("kpiTopRowCount", kpiTopRowCount);
  // console.log(
  //   "Top KPI",
  //   groupedKpis.filter((d, i) => d[0][1].qNum !== 0)
  // );
  // console.log(
  //   "bottom KPI",
  //   groupedKpis.filter((d, i) => d[0][1].qNum !== 0)
  // );

  // console.log("Top KPI", groupedKpis.filter((d, i) => d[0][1].qNum < 2))
  // console.log("bottom KPI", groupedKpis.filter((d, i) => d[0][1].qNum > 2))
  // console.log("Gauges", groupedGauges)
  // console.log("doughnut", groupedDoughnut)

  function getRowTitles(tabName, region, qDef) {
    // let subTitle="";
    //   if(region==="EMEA" && tabName.includes("Specialist")){
    //      subTitle= qDef[0][17].qText?qDef[0][17].qText:null
    //   }
    //   if(tabName.includes("Lenovo")){
    //     subTitle =  qDef[0][17].qText?qDef[0][17].qText:null
    //   }

    return qDef[0][17].qText ? qDef[0][17].qText : null;
  }

  function getChartTitles(tabName, region, qDef) {
    // console.log(qDef);
    return qDef[0][3].qText ? qDef[0][17].qText : null;
  }

  // const KpiColumnsTopRow = useMemo(() => {
  //   if (groupedKpis !== undefined) {
  //     console.log("KpiColumnsTopRow", groupedKpis);
  //     return (
  //       groupedKpis
  //         // .filter((d, i) => d[0][1].qNum < 2) // number of Kpi to show in row1
  //         .map((qDef, i) => {
  //           //console.log("R1-"+i,qDef);
  //           let drillDownUrl = DrillDownUrl(qDef[i], sheetData);
  //           // console.log("URL",drillDownUrl)
  //           //  console.log(i);
  //           //  console.log(qDef[0][1].qText)
  //           return (
  //             <div
  //               key={`kpi-top-${i}`}
  //               row={Math.trunc(qDef[0][1].qNum)}
  //               position={qDef[0][1].qNum}
  //               style={{ textDecoration: "none", color: "white" }}
  //               className={"col-6 col-sm-3 col-md-2 col-lg-3 chart"}
  //               // className={"col-12 col-sm-3 col-md-6 col-lg-3 chart"}
  //               rel="noopener noreferrer"
  //               rowtitle={getRowTitles(tabName, qDef[0][7].qText, qDef)}
  //               displayorder={1}
  //               chartype="KPI"
  //               // chartitle={getChartTitles(tabName, qDef[0][3].qText, qDef)}
  //             >
  //               <div className="kpi-top-container chart_card">
  //                 <Kpi
  //                   qDef={qDef}
  //                   bottomRowCount={bottomRowCount}
  //                   // kpiCount={kpiTopRowCount}
  //                 />
  //                 <div
  //                   style={{ color: "red", display: dubugger ? "" : "none" }}
  //                 >
  //                   {"KPI" + qDef[0][1].qNum + " " + qDef[0][17].qText}
  //                 </div>
  //               </div>

  //               <ViewMore drillDownUrl={drillDownUrl}></ViewMore>
  //             </div>
  //           );
  //         })
  //     );
  //     // console.log(me);
  //     //return <div>KPI top row</div>;
  //   }
  // }, [groupedKpis, kpiTopRowCount, bottomRowCount, sheetData, tabName]);

  // //  console.log("KpiColumnsTopRow", KpiColumnsTopRow);
  // // // map through kpi defs for the bottom row of objects
  // var KpiColumnsBottomRow = useMemo(() => {
  //   if (groupedKpis !== undefined) {
  //     console.log("KpiColumnsBottomRow", groupedKpis);
  //     return (
  //       groupedKpis
  //         //  .filter((d, i) => d[0][1].qNum > 2) //Kpi row 2
  //         .map((qDef, i) => {
  //           //console.log("R2-"+i,qDef)
  //           let drillDownUrl = DrillDownUrl(qDef[i], sheetData); //drilldown(qDef,i);
  //           // console.log("-",qDef[0][17].qText)
  //           return (
  //             <div
  //               key={`kpi-bottom-${i}`}
  //               row={Math.trunc(qDef[0][1].qNum)}
  //               position={qDef[0][1].qNum}
  //               style={{
  //                 textDecoration: "none",
  //                 color: "white",
  //                 height: "100%",
  //               }}
  //               // className="col-12 col-sm-3 col-md-6 col-lg-3 chart" //go
  //               className="col-6 col-sm-3 col-md-3 col-lg-3 chart"
  //               rowtitle={getRowTitles(tabName, qDef[0][7].qText, qDef)}
  //               displayorder={1}
  //               chartype="KPI"
  //               //className={bottomRowCount==5?"col-6 col-sm-4 col-md-6 col-lg-4":"col-6 col-sm-4 col-md-4 col-lg-4"}
  //             >
  //               <div
  //                 className="kpi-bottom-container chart_card"
  //                 style={{ height: "100%" }}
  //               >
  //                 <Kpi qDef={qDef} />
  //                 <div
  //                   style={{ color: "red", display: dubugger ? "" : "none" }}
  //                 >
  //                   {"KPI" + qDef[0][1].qNum + " " + qDef[0][17].qText}
  //                 </div>
  //               </div>
  //               <ViewMore drillDownUrl={drillDownUrl}></ViewMore>
  //             </div>
  //           );
  //         })
  //     );
  //   }
  // }, [groupedKpis, sheetData, tabName]);

  var KpiRow = useMemo(() => {
    if (groupedKpis !== undefined) {
      console.log("KpiRow", KpiRow);
      return (
        groupedKpis
          //  .filter((d, i) => d[0][1].qNum > 2) //Kpi row 2
          .map((qDef, i) => {
            //console.log("R2-"+i,qDef)
            let drillDownUrl = DrillDownUrl(qDef[i], sheetData); //drilldown(qDef,i);
            // console.log("-",qDef[0][17].qText)
            return (
              <div
                key={`kpi-bottom-${i}`}
                row={Math.trunc(qDef[0][1].qNum)}
                position={qDef[0][1].qNum}
                style={{
                  textDecoration: "none",
                  color: "white",
                  height: "100%",
                }}
                // className="col-12 col-sm-3 col-md-6 col-lg-3 chart" //go
                className="col-6 col-sm-3 col-md-3 col-lg-3 chart"
                rowtitle={getRowTitles(tabName, qDef[0][7].qText, qDef)}
                displayorder={1}
                chartype="KPI"
                //className={bottomRowCount==5?"col-6 col-sm-4 col-md-6 col-lg-4":"col-6 col-sm-4 col-md-4 col-lg-4"}
              >
                <div
                  className="kpi-bottom-container chart_card"
                  style={{ height: "100%" }}
                >
                  <Kpi qDef={qDef} />
                  <div
                    style={{ color: "red", display: dubugger ? "" : "none" }}
                  >
                    {"KPI" + qDef[0][1].qNum + " " + qDef[0][17].qText}
                  </div>
                </div>
                <ViewMore drillDownUrl={drillDownUrl}></ViewMore>
              </div>
            );
          })
      );
    }
  }, [groupedKpis, sheetData, tabName]);

  // // map through gauge defs
  const GaugeColumns = useMemo(() => {
    if (groupedGauges !== undefined) {
      return groupedGauges
        .filter((d) => d.length > 1)
        .map((qDef, i) => {
          let drillDownUrl = DrillDownUrl(qDef[i], sheetData); //drilldown(qDef,i);
          return (
            <div
              key={`guage-${i}`}
              row={Math.trunc(qDef[0][1].qNum)}
              position={qDef[0][1].qNum}
              style={{ height: "100%" }}
              //   className="col-6 col-sm-3 col-md-6 col-lg-3 chart" //go
              className="col-6 col-sm-3 col-md-3 col-lg-3 chart"
              rowtitle={getRowTitles(tabName, qDef[0][7].qText, qDef)}
              displayorder={2}
              chartype="GUAGE"
            >
              <div
                className="kpi-bottom-container chart_card"
                style={{ height: "100%" }}
              >
                <Gauge qDef={qDef} />
                <div style={{ color: "red", display: dubugger ? "" : "none" }}>
                  {"KPI" + qDef[0][1].qNum + " " + qDef[0][17].qText}
                </div>
              </div>
              <ViewMore drillDownUrl={drillDownUrl}></ViewMore>
            </div>
          );
        });
      // return <div>Guage</div>;
    }
  }, [groupedGauges, sheetData, tabName]);

  // // map through line defs
  const LineColumns = useMemo(() => {
    if (groupedLines !== undefined) {
      return groupedLines.map((qDef, i) => {
        let drillDownUrl = DrillDownUrl(qDef[i], sheetData); //drilldown(qDef,i);
        return (
          <div
            key={`line-${i}`}
            row={Math.trunc(qDef[0][1].qNum)}
            position={qDef[0][1].qNum}
            style={{ height: "100%" }}
            className={
              GaugeColumns.length + KpiColumnsBottomRow.length === 0
                ? "col-9 col-sm-5 col-md-7 col-lg-5 chart"
                : "col-6 col-sm-3 col-md-3 col-lg-3 chart"
            }
            rowtitle={getRowTitles(tabName, qDef[0][7].qText, qDef)}
          >
            <div
              className="line-container chart_card"
              style={{ height: "100%" }}
            >
              <Line qDef={qDef} />
              <div style={{ color: "red", display: dubugger ? "" : "none" }}>
                {"KPI" + qDef[0][1].qNum + " " + qDef[0][17].qText}
              </div>
            </div>
            <ViewMore drillDownUrl={drillDownUrl}></ViewMore>
          </div>
        );
      });
      // return <div>Line Columns</div>;
    }
  }, [
    groupedLines,
    GaugeColumns.length,
    KpiColumnsBottomRow.length,
    sheetData,
    tabName,
  ]);

  // // map through line defs
  const BarColumns = useMemo(() => {
    if (groupedBars !== undefined) {
      return groupedBars.map((qDef, i) => {
        // console.log("bar map----------")
        let drillDownUrl = DrillDownUrl(qDef[i], sheetData); //drilldown(qDef,i);
        return (
          <div
            key={`bar-${i}`}
            row={Math.trunc(qDef[0][1].qNum)}
            position={qDef[0][1].qNum}
            className={
              //  GaugeColumns.length + KpiColumnsBottomRow.length === 0
              //   ? "col-9 col-sm-4 col-md-4 col-lg-4 chart"
              "col-6 col-sm-3 col-md-3 col-lg-3 chart" //3
            }
            style={{
              height: "100%",
            }}
            rowtitle={getRowTitles(tabName, qDef[0][7].qText, qDef)}
          >
            <div
              className="bar-container kpi-bottom-container chart_card "
              style={{ height: "100%" }}
            >
              <Bar qDef={qDef} />
              <div style={{ color: "red", display: dubugger ? "" : "none" }}>
                {"KPI" + qDef[0][1].qNum + " " + qDef[0][17].qText}
              </div>
            </div>
            <ViewMore drillDownUrl={drillDownUrl}></ViewMore>
          </div>
        );
      });
    }
  }, [groupedBars, GaugeColumns, sheetData, tabName]);

  // // map through kpi defs for the bottom row of objects
  const LeapKpiColums = useMemo(() => {
    if (groupedLeaps !== undefined) {
      // return groupedLeaps
      return groupedLeaps.map((qDef, i) => {
        // console.log("Leap Map", qDef)
        let drillDownUrl = DrillDownUrl(qDef[i], sheetData); //drilldown(qDef,i);
        return (
          <div
            key={`leapbar-${i}`}
            row={Math.trunc(qDef[0][1].qNum)}
            position={qDef[0][1].qNum}
            className={
              // GaugeColumns.length + KpiColumnsBottomRow.length === 0
              //  ? "col-9 col-sm-4 col-md-4 col-lg-4 chart"
              "col-6 col-sm-3 col-md-3 col-lg-3 chart"
            }
            style={{
              height: "100%",
            }}
            rowtitle={getRowTitles(tabName, qDef[0][7].qText, qDef)}
          >
            <div
              className="leapkpi-bottom-container kpi-bottom-container chart_card"
              style={{ height: "100%" }}
            >
              <LeapKpi qDef={qDef} />
              <div style={{ color: "red", display: dubugger ? "" : "none" }}>
                {"KPI" + qDef[0][1].qNum + " " + qDef[0][17].qText}
              </div>
            </div>
            <ViewMore drillDownUrl={drillDownUrl}></ViewMore>
          </div>
        );
        // console.log("done")
      });
      //return <div> LeapKpiColums</div>;
    }
  }, [groupedLeaps, GaugeColumns, sheetData, tabName]);

  const DoughnnutColums = useMemo(() => {
    if (groupedDoughnut !== undefined) {
      // return groupedDoughnut
      return groupedDoughnut.map((qDef, i) => {
        // console.log("Leap Map", qDef)
        let drillDownUrl = DrillDownUrl(qDef[i], sheetData); //drilldown(qDef,i);
        return (
          <div
            key={`Doughnut-${i}`}
            row={Math.trunc(qDef[0][1].qNum)}
            position={qDef[0][1].qNum}
            // className={"col-12 col-sm-12 col-md-6 col-lg-3 chart"}
            className={
              //GaugeColumns.length + KpiColumnsBottomRow.length === 0
              //? "col-9 col-sm-4 col-md-4 col-lg-4 chart"
              "col-6 col-sm-3 col-md-3 col-lg-3 chart"
            }
            style={{
              height: "100%",
            }}
            rowtitle={getRowTitles(tabName, qDef[0][7].qText, qDef)}
            displayorder={0}
          >
            <div
              className="doughnut-bottom-container chart_card"
              style={{ height: "100%" }}
            >
              <Doughnut qDef={qDef} />
              <div style={{ color: "red", display: dubugger ? "" : "none" }}>
                {"KPI" + qDef[0][1].qNum + " " + qDef[0][17].qText}
              </div>
            </div>
            <ViewMore drillDownUrl={drillDownUrl}></ViewMore>
          </div>
        );
        // console.log("done")
      });
      //return <div> LeapKpiColums</div>;
    }
  }, [groupedDoughnut, GaugeColumns, sheetData, tabName]);

  // Rearrange the bottom row to make sure line chart is positioned correctly
  var allRows = [].concat(
    // KpiColumnsTopRow,
    // KpiColumnsBottomRow,
    KpiRow,
    GaugeColumns,
    LineColumns,
    BarColumns,
    LeapKpiColums,
    DoughnnutColums
  );

  // console.log("allRows",allRows)
  var sortedBottomRow = allRows.sort((a, b) => {
    //console.log(a.props)
    return a.props.position - b.props.position;
  });

  //console.log("sortedBottomRow", sortedBottomRow);

  const groupBy = useCallback((data) => {
    return Object.values(lodashGroupBy(data, (d) => d.props.rowtitle));
  }, []);

  //sorting the charts based on displayorder - to rearrange the position of charts
  const sortBy = useCallback((data) => {
    return; //Object.values(lodashsortBy(data, (d) => d.props.displayorder));
  }, []);

  const groupByRowNumber = useCallback((data) => {
    return Object.values(lodashGroupBy(data, (d) => d.props.row));
  }, []);

  //console.log("sortedBottomRow",sortedBottomRow);
  let groupedGridRows = groupBy(sortedBottomRow);

  let groupedGridRowsalt = groupedGridRows.map((itmes, i) => {
    return itmes;
    //return sortBy(itmes);
  });

  // let finalgroup = groupedGridRows.map((itmes, i) => {
  //   return groupByRowNumber(itmes);
  // });

  //console.log(window.innerWidth);
  //mobile rendering. Only show a 2 X 2 matrix when screen width is less than 500px
  if (window.innerWidth < 770 && KpiColumnsTopRow.length === 4 && 1 === 2) {
    //console.log("window.innerWidth < 750")
    //KpiColumnsTopRow.length = 2;
  }
  if (window.innerWidth < 770 && sortedBottomRow.length >= 2 && 1 === 2) {
    // sortedBottomRow = [].concat(KpiColumnsBottomRow, GaugeColumns);
    // sortedBottomRow.length = 2;
  }
  if (window.innerWidth < 770 && groupedGridRows.length) {
    if (groupedGridRows[0].length >= 2) {
      //  groupedGridRows[0].length=2;
    }

    //groupedGridRows[1].length=2;
    // if(groupedGridRows[1])
    // groupedGridRows[1].length=2;
    // groupedGridRows[2].length=1;
    // groupedGridRows[3].length=1;
  }

  const container_ref = useRef(null);

  return (
    <div ref={container_ref} className={"App"}>
      <div className="App-header">
        {data.length === 0 ? (
          // <div className="noAccessBg">
          <PlaceHolder message="No data available" />
        ) : (
          // </div>
          <div className="container-fluid">
            {groupedGridRowsalt.length > 0
              ? groupedGridRowsalt.map((rowItems, i) => {
                  let title = "";
                  if (!isNull(rowItems)) {
                    // console.log("rowItems", rowItems);
                    title = rowItems[0].props.rowtitle;
                    //  console.log("rowp",rowItems[0].props.rowtitle);

                    //temporary fix for lenvov 360 tab -
                    //issue -if same bp subType is associated with two rows, both the rows will have same titel
                    //solutiion - make the title empty if previous row has the same title
                    if (i > 0 && tabName.includes("-")) {
                      // console.log("PREV TITEL",groupedGridRows[i-1][0].props.rowtitle);
                      // console.log("CUR TITEL",rowItems[0].props.rowtitle);
                      //  console.log("adding sub titles");
                      // console.log(container_ref.current);
                      title =
                        groupedGridRowsalt[i - 1][0].props.rowtitle ===
                        rowItems[0].props.rowtitle
                          ? ""
                          : rowItems[0].props.rowtitle;
                    }
                  }

                  // rowItems.map((rowItem, i) => {
                  //   let test = groupByRowNumber(rowItem);
                  //   console.log("test", rowItems);
                  // });

                  return (
                    <div key={i}>
                      {!isNull(rowItems) ? (
                        <div className="page-subTitle">
                          {rowItems.length ? title : ""}
                        </div>
                      ) : null}
                      <div className="row align-items-center justify-content-around bottom-row">
                        {rowItems[0]} {rowItems[1]} {rowItems[2]} {rowItems[3]}
                      </div>
                      <div className="row align-items-center justify-content-around bottom-row">
                        {rowItems[4]} {rowItems[5]} {rowItems[6]} {rowItems[7]}
                      </div>
                      <div className="row align-items-center justify-content-around bottom-row">
                        {rowItems[8]} {rowItems[9]} {rowItems[10]}{" "}
                        {rowItems[11]}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
