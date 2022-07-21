import React from "react";
import Line from "../Line";
import "./style.scss";

export default ({ qDef: objDef }) => (
  <div className="sales-line" style={{ width: "100%", height: "100%" }}>
    <Line
      qDef={objDef}
      width={"100%"}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      colorTheme={"black"}
    />
  </div>
);
