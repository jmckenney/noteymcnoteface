import React from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js";
import { registerables } from "chart.js";
import "chartjs-adapter-date-fns";

// Register all scales, controllers, and elements with Chart.js
Chart.register(...registerables);

const LineChart = () => {
  return (
    <div>
      <Line
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "Weight",
              data: [199, 198, 195, 190, 185, 182],
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.4)",
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
