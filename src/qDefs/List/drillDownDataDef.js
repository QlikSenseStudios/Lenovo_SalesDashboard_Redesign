
const drillDownDataDef = {
  qInfo: {
    qType: "drillData",
  },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ["sheet_id"],
          qSortCriterias: [
            {
              qSortByAscii: 1,
            },
          ],
        },
      },
      {
        qDef: {
          qFieldDefs: ["sheet_name"],
        },
      },
      {
        qDef: {
          qFieldDefs: ["sheet_description"],
        },
      },
      {
        qDef: {
          qFieldDefs: ["app_name"],
        },
      },
    ],

    qInitialDataFetch: [{ qWidth: 5, qHeight: 1000 / 5 }],
  },
};

export default drillDownDataDef;
