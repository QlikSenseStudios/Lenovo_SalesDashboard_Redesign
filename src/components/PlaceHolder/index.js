import React from "react";
import languages from "../../mappingTables/languageTranslations";

const urlParams = new URLSearchParams(window.location.search);
const languageParam = urlParams.get("lang");

const PlaceHolder = ({ message }) => {
  if (message !== "Connection Failed" && languageParam !== null) {
    message = languages.filter((d, i) => d.key === languageParam)[0].message;
  }

  return (
    <div
      style={{
        fontSize: "24px",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {message}
    </div>
  );
};
export default PlaceHolder;
