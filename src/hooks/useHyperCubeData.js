import { useState, useEffect } from "react";
import { useSessionObject } from "./index";
import { useGetLayout } from "qlik-hooks/GenericObject";

function deepFind(obj, path) {
  var paths = path.split("."),
    current = obj,
    i;

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] === undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }
  return current;
}

//get data from Qlik using hypercube definitions.
export default ({ def, dataTransformFunc = (a) => a, path = "qHyperCube" }) => {
  const handle = useSessionObject(def);

  const layout = useGetLayout(handle, {
    params: [],
    invalidations: true,
  }).qResponse;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (layout !== null && layout !== undefined) {
      setData(dataTransformFunc(deepFind(layout, path)));
    }

    return () => setData(null);
  }, [layout, dataTransformFunc, path]);

  return {
    data,
    handle,
  };
};
