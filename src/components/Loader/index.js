import React from "react";
import languages from "../../mappingTables/languageTranslations";

const urlParams = new URLSearchParams(window.location.search);
const languageParam = urlParams.get("lang");

const Loader = ({ message }) => {

  if (message !== "Connection Failed" && languageParam !== null) {
    var message1 = languages.filter((d, i) => d.key === languageParam);

    if (message1 && message1[0] && message1[0].loadingMsg !== undefined) {
      message = message1[0].loadingMsg;
    } else {
      message = "Dashboard is loading, please wait";
    }
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
export default Loader;
