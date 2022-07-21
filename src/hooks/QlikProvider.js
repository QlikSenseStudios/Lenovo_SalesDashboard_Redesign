import React, { createContext } from "react";
import { useConnectEngine } from "qlik-hooks";
import { useOpenDoc } from "qlik-hooks/Global";

//set up context for Qlik connection data
export const QlikContext = createContext();

export default ({ config, apps, children }) => {
  //connect to Qlik engine and establish session
  const session = useConnectEngine(config);

  //open Qlik app
  const doc = useOpenDoc(session, { params: [config.appname] });
  return (
    <QlikContext.Provider value={{ doc, session, apps, config }}>
      {children}
    </QlikContext.Provider>
  );
};
