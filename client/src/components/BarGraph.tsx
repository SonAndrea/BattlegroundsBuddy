import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface LineGraphProps {
  width: number;
  height: number;
  data: { [key: string]: any }[];
  xKey: string;
  yKey: string;
  yLabel?: string;
}

function BarGraph({ width, height, data, xKey, yKey, yLabel }: LineGraphProps) {
  return (
    <BarChart
      width={width}
      height={height}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis
        label={{
          value: yLabel || yKey,
          angle: -90,
          position: "insideLeft",
          offset: 10,
        }}
      />
      <Tooltip />
      <Bar dataKey={yKey} fill="#8884d8" />
    </BarChart>
  );
}

export default BarGraph;
