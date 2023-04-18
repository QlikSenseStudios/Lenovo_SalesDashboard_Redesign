import drillDownMappingException from "./mappingTables/drillDownMappingException";
import regions from "./mappingTables/regions";

// FOR create dynamic URL generation for All KPI Object
const DrillDownUrl = (qDef, sheetData) => {
  var debug = false;
  if (debug) {
    console.log("sheetDat", sheetData);
    // console.log("Object GEO ID", qDef[6].qText);
    console.log("chart def", qDef);
  }

  //var digits = () => Math.floor(Math.random() * 9000000000) + 1000000000;
  let drillDownUrl = "";

  if (qDef && qDef[6] && qDef[7] && qDef[8]) {
    if (regions.includes(qDef[7].qText) && sheetData) {
      // AS per custum requirement Region= EMEA and persona_type != ADMIN and bp_type !=='sales' has no url
      // if (qDef[7].qText === 'EMEA' && qDef[8].qText !== 'Admin' && qDef[9].qText !== 'Sales') {
      //   return {};
      // }

      // No Drilldown for bp_type "Authorized" OR "Non Main Branch"
      if (
        qDef[7].qText === "EMEA" &&
        qDef[9] &&
        (qDef[9].qText === "Authorized" || qDef[9].qText === "Non Main Branch")
      ) {
        return {};
      }

      // CR160 : No URl for "Non Main Branch" bp_type and bp_type_mapped
      if (
        qDef[7].qText === "EMEA" &&
        qDef[8].qText === "Admin" &&
        qDef[9].qText === "Non Main Branch" &&
        qDef[10].qText === "Non Main Branch"
      ) {
        return {};
      }

      //Check if GEO_Object_Id of the chart is mapped with any sheet by its description
      //return the details required to generate the drilldown URL
      const drilldownAppData = sheetData.filter((sheet) => {
        const desc = sheet.description.split("|").map((item) => item.trim());
        // if (debug) {
        //   console.log(desc);
        // }
        return desc.includes(qDef[6].qText);
      });

      /* Few GEO_Object_Id has to redirect seprate portal
        https://lbp-uat.lenovo.com , need to discuss and for proper URL generation
      */
      if (drilldownAppData.length) {
        if (debug) console.log("drilldownAppData", drilldownAppData);

        //const appendUrl = `?appid=${drilldownAppData[0].app.id}&sheet=${drilldownAppData[0].engineObjectId}&opt=currsel%2Cnoanimate%2Cctxmenu&identity=${digits()}`;
        // console.log(appendUrl);
        if (!drillDownMappingException.includes(qDef[6].qText)) {
          // drillDownUrl = `https://lbp.lenovo.com/${appendUrl}`;
          drillDownUrl = `https://${drilldownAppData[0].tenant}/sense/app/${drilldownAppData[0].app.id}/sheet/${drilldownAppData[0].engineObjectId}/state/analysis/options/clearselections/theme/light`;
        } else {
          // drillDownUrl = `https://lenovo-lph-ai.us.qlikcloud.com/single/${appendUrl}`;
          drillDownUrl = `https://${drilldownAppData[0].tenant}/sense/app/${drilldownAppData[0].app.id}/state/analysis/options/clearselections/theme/light`;
        }
      } else {
        if (debug)
          console.log(
            "No Match found- no sheets mapped with this GEO_Object_Id -" +
              qDef[6].qText
          );
      }
    }
  }
  const attributes = drillDownUrl ? { href: drillDownUrl } : {};
  return attributes;
};

export default DrillDownUrl;
