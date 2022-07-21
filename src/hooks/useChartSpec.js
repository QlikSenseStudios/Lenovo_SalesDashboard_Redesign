import { useEffect, useState } from "react";
import { fromEvent } from "rxjs";
import { map, startWith } from "rxjs/operators";
// //calculate container size of objects using Rxjs
export default (container, data) => {
  const [chartSpec, setChartSpec] = useState(0);

  const chartSpecCalc = (container, update) => {
    if (container.current !== undefined) {
     // console.log(container);
      const chart = container.current.querySelector(".svg");
      const sub$ = fromEvent(window, "resize")
        .pipe(
          map(() => [
            chart.getBoundingClientRect().width - 10,
            chart.getBoundingClientRect().height - 20,
          ]),
          startWith([
            chart.getBoundingClientRect().width - 10,
            chart.getBoundingClientRect().height - 20,
          ])
        )
        .subscribe(update);

      return () => sub$.unsubscribe();
    }
    
  };

  useEffect(() => chartSpecCalc(container, setChartSpec), [container, data]);
 //console.log({ width: chartSpec[0], height: chartSpec[1] });
  return { width: chartSpec[0], height: chartSpec[1] };
};
