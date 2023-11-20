import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import setup from "./setup";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { QlikProvider } from "./hooks/index";
import enigma from "enigma.js";
import schema from "enigma.js/schemas/12.20.0.json";
import PlaceHolder from "./components/PlaceHolder";

//polyfill for browser compatibility
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}
var Qsession,
  engine,
  doc,
  connectionError = { doc: { error: null }, session: { error: null } };
//setup("NA Sales Performance Drilldown 3")
setup("NEW SALES PERFORMANCE DASHBOARD")
  .then(async (data) => {
    if (data) {
      if (data.config.wsUrl) {
        console.log(data);
        var url = data.config.wsUrl;
        Qsession = enigma.create({ schema, url });
        console.log(Qsession);
        engine = await Qsession.open()
          .then((result) => {
            return result;
          })
          .catch((error) => {
            console.log(error);
            return ReactDOM.render(
              <div className={"noAccessBg"}>
                <PlaceHolder message="Connection Failed" />
              </div>,
              document.getElementById("root")
            );
          });
        //doc = await engine.openDoc(data.config.appname);
        doc = await engine
          .openDoc(data.config.appname)
          .then((result) => {
            return result;
            // Handle the successful result here
          })
          .catch((error) => {
            //console.log(error); // for access denied
            return ReactDOM.render(
              <div className={"noAccessBg"}>
                <PlaceHolder message="No data available*" />,
              </div>,
              document.getElementById("root")
            );
          });

        window.doc = doc;
        // doc.error = null;
        console.log("engine", engine);

        doc.on("error", () => {
          console.log("on Error");
        });
        Qsession.on("error", (error) => {
          console.error("Error occurred:", error);
        });
        // }
      }

      ReactDOM.render(
        <QlikProvider
          config={data.config}
          session={Qsession}
          apps={data.apps}
          engineApp={doc}
          doc={doc}
          connectionError={connectionError}
        >
          <App />
        </QlikProvider>,
        document.getElementById("root")
      );
    }
  })
  .catch((error) => {
    console.log("ERROR", error);
  });
