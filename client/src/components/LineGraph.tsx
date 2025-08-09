import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface LineGraphProps {
  width: number;
  height: number;
  data: any[];
  xKey: string;
  yKey: string;
  yLabel?: string;
}

function LineGraph({
  width,
  height,
  data,
  xKey,
  yKey,
  yLabel,
}: LineGraphProps) {
  return (
    <LineChart width={width} height={height} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey={xKey} />
      <YAxis
        label={{ value: yLabel || yKey, angle: -90, position: "insideLeft" }}
      />
      <Tooltip />
      <Line type="monotone" dataKey={yKey} stroke="#8884d8" dot={{ r: 3 }} />
    </LineChart>
  );
}

export default LineGraph;
