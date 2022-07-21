import { useContext } from "react";
import { useCreateSessionObject } from "qlik-hooks/Doc";
import { QlikContext } from "./index";

export default (qDef) => {
  const qix = useContext(QlikContext).doc;

  const obj = useCreateSessionObject(qix, {
    params: [qDef],
  });

  return obj;
};
