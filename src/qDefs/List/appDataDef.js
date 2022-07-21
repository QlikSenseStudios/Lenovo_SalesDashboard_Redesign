const appDataDef = {
  qInfo: {
    qType: "app data",
  },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ["quarter"],
        },
      },
      {
        qDef: {
          qFieldDefs: ["quarter_start_date"],
        },
      },
      {
        qDef: {
          qFieldDefs: ["quarter_end_date"],
        },
      },
    ],
    qMeasures: [
      {
        qDef: {
          qDef: "=MinString(snap_date)",
        },
      },
    ],
    qInitialDataFetch: [{ qWidth: 4, qHeight: 10000 / 4 }],
  },
};

export default appDataDef;
