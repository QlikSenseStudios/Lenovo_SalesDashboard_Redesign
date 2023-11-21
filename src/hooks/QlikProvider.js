import React, { createContext } from "react";

//set up context for Qlik connection data
export const QlikContext = createContext();

export default ({
  config,
  session,
  apps,
  connectionError,
  doc,
  engineApp,
  children,
}) => {
  return (
    <QlikContext.Provider
      value={{ session, apps, connectionError, doc, engineApp, config }}
    >
      {children}
    </QlikContext.Provider>
  );
};
