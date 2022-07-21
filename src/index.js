import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import setup from "./setup";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { QlikProvider } from "./hooks/index";

//polyfill for browser compatibility
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

setup("NEW SALES PERFORMANCE DASHBOARD")
  .then((data) => {
    if (data) {
      ReactDOM.render(
        <QlikProvider config={data.config} apps={data.apps}>
          <App />
        </QlikProvider>,
        document.getElementById("root")
      );
    }
  })
  .catch((error) => {
    console.log("ERROR", error);
  });
