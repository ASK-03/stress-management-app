"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { motion } from "framer-motion"; // For animations
import { Card } from "@/components/ui/card";

type Props = {
  rewardsData: { date: string; totalRating: number }[]; // Array of rewards data
};

const RewardsGraph = ({ rewardsData }: Props) => {
  return (
    <Card className="h-full w-full p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Rewards Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rewardsData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false} // Disable decimals for better readability
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
              cursor={{ fill: "rgba(31, 41, 55, 0.2)" }}
            />
            <Bar dataKey="totalRating" radius={[10, 10, 0, 0]} barSize={5}>
              <defs>
                <linearGradient
                  id="gradientBar"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <LabelList
                dataKey="totalRating"
                position="top"
                fill="#374151"
                fontSize={12}
                fontWeight="bold"
              />
              {rewardsData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.totalRating > 5 ? "#EC4899" : "url(#gradientBar)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
};

export default RewardsGraph;
