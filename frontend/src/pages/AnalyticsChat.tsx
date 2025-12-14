import { useState, useEffect, useRef } from "react";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API } from "../utils/api";

const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#fbbf24", "#a78bfa"];

export default function AnalyticsChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChart] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Wire AI actions (e.g. set_chart) to local handlers
  /*  useAiActions({
    setChart: (chart) => {
      setSelectedChart(chart);
      // clear highlight after a short time
      setTimeout(() => setSelectedChart(null), 4000);
    },
  }); */

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      chartType: null,
      chartData: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/chat/query",
        { message: userMessage.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = {
        sender: "system",
        text: res.data.response,
        chartType: res.data.chartType,
        chartData: res.data.data,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "Sorry, something went wrong." },
      ]);
    }

    setLoading(false);
  };

  const onEnterPress = (e: any) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-base-100 shadow-xl rounded-xl p-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-4">AI Analytics Assistant</h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[70vh] pr-2">
          {messages.map((msg: any, i: number) => (
            <div
              key={i}
              className={`chat ${
                msg.sender === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  msg.sender === "user"
                    ? "chat-bubble-primary"
                    : "chat-bubble-secondary"
                }`}
              >
                {msg.text}
              </div>

              {/* Render Chart if available */}
              {msg.chartData && (
                <div
                  className={`mt-4 bg-base-200 p-4 rounded-xl shadow-md w-full h-72 ${
                    selectedChart === msg.chartType ? "ring-4 ring-primary" : ""
                  }`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    {msg.chartType === "line" && (
                      <LineChart data={msg.chartData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="rating"
                          stroke="#4f46e5"
                        />
                      </LineChart>
                    )}

                    {msg.chartType === "pie" && (
                      <PieChart>
                        <Pie
                          data={msg.chartData}
                          dataKey="value"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {msg.chartData.map((_: any, idx: number) => (
                            <Cell
                              key={idx}
                              fill={COLORS[idx % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    )}

                    {msg.chartType === "bar" && (
                      <BarChart data={msg.chartData}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Box */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask anything about your analytics..."
            className="input input-bordered flex-1"
            value={input}
            onKeyDown={onEnterPress}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
