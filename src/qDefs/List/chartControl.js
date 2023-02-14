const chartControlDef = {
  qInfo: {
    qType: "chart control",
  },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          //qFieldDefs: ["zKey_KPI_GEO_ID"],
          qFieldDefs: ["kpi_id"],
          qSortCriterias: [
            {
              qSortByAscii: 1,
            },
          ],
        },
      },
      {
        qDef: {
          qFieldDefs: ["position"], //1/
        },
      },
      {
        qDef: {
          qFieldDefs: ["element"], //2
        },
      },
      {
        qDef: {
          qFieldDefs: ["kpi_description"], //3
        },
      },
      {
        qDef: {
          qFieldDefs: ["kpi_value_type"],  //4 no //kpi_label //kpi_value_type
        },
      },
      {
        qDef: {
          qFieldDefs: ["pcgdcg"], //5
        },
      },
      {
        qDef: {
          qFieldDefs: ["Object GEO ID"], //6
         },
      },
      {
        qDef: {
          qFieldDefs: ["geo"], //7 
        },
      },
      {
        qDef: {
          qFieldDefs: ["persona_type"], //8 
        },
      },
      {
        qDef: {
          qFieldDefs: ["bp_type"], //9
        },
      },
      {
        qDef: {
          qFieldDefs: ["bp_type_mapped"], //10
        },
      },
      {
        qDef: {
          qFieldDefs: ["sub_tab"], // ["=if(sub_tab='-','*',**)"], //11 sub_tab
        },
      },
      {
        qDef: {
          qFieldDefs: ["local_value"], //12
        },
      },
      {
        qDef: {
          qFieldDefs: ["local_value_formated"], //13
        },
      },
      {
        qDef: {
          qFieldDefs: ["kpi_label"], //14
        },
      },
      {
        qDef: {
          qFieldDefs: ["week_of_quarter"], //15
        },
        
      },
      {
        qDef: {
          qFieldDefs: ["value"], //16
        },
        
      },  {
        qDef: {
          qFieldDefs: ["header"], //17
        },
      },
      {
        qDef: {
          qFieldDefs: ["tab"], //18
        },
        
      },
      
      
     
    ],
// qFieldDefs: ["zKey_KPI_GEO_ID"],
    qInitialDataFetch: [{ qWidth: 19, qHeight: 10000 / 19 }],
  },
};

export default chartControlDef;
