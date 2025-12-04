import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

export default function SentimentPie({
  sentiment,
}: {
  sentiment: { positive: number; negative: number; neutral: number };
}) {
  const data = [
    { name: "Positive", value: sentiment.positive },
    { name: "Negative", value: sentiment.negative },
    { name: "Neutral", value: sentiment.neutral },
  ];

  const colors = ["#4ade80", "#f87171", "#fbbf24"];

  return (
    <div className="bg-base-100 shadow-xl rounded-xl p-5">
      <h2 className="text-xl font-semibold mb-3">Sentiment Breakdown</h2>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={50}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={colors[idx]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
