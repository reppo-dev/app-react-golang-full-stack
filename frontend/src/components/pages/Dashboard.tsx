import axios from "axios";
import * as c3 from "c3";
import { useEffect } from "react";

type SalesData = {
  date: string;
  sum: number;
};

const Dashboard = () => {
  useEffect(() => {
    const fecher = async () => {
      const chart = c3.generate({
        bindto: "#chart",
        data: {
          x: "x",
          columns: [["x"], ["Sales"]],
          types: { Sales: "bar" },
        },
        axis: {
          x: {
            type: "timeseries",
            tick: {
              format: "%Y-%m-%d",
            },
          },
        },
      });

      const res = await axios.get<SalesData[]>("/chart");
      const data = res.data;

      chart.load({
        columns: [
          ["x", ...data.map((r) => r.date)],
          ["Sales", ...data.map((r) => r.sum)],
        ],
      });
    };

    fecher();
  }, []);

  return (
    <div>
      <h2>Daily Sales</h2>
      <div id="chart" />
    </div>
  );
};

export default Dashboard;
