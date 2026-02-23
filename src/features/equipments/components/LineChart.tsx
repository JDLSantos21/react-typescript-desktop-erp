import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const StackedBarChart = () => {
  const data = [
    {
      name: "NEVERAS",
      Total: 175,
      Disponibles: 125,
      Asignados: 50,
    },
    {
      name: "ANAQUELES",
      Total: 145,
      Disponibles: 125,
      Asignados: 20,
    },
  ];

  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "500px",
        maxHeight: "20vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 20,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar dataKey="Disponibles" stackId="a" fill="#00c951" background />
      <Bar dataKey="Asignados" stackId="a" fill="#fb2c36" background />
    </BarChart>
  );
};
