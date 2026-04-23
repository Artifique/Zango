"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { day: "Lun", amount: 4500 },
  { day: "Mar", amount: 5200 },
  { day: "Mer", amount: 4800 },
  { day: "Jeu", amount: 6100 },
  { day: "Ven", amount: 5900 },
  { day: "Sam", amount: 7200 },
  { day: "Dim", amount: 4820 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-charcoal/90 backdrop-blur-xl border border-white/10 p-3 rounded-lg shadow-2xl">
        <p className="text-[10px] text-white/40 uppercase font-mono font-bold mb-1">{label}</p>
        <p className="text-sm font-mono font-bold text-teal">
          {payload[0].value.toLocaleString()} USDT
        </p>
      </div>
    );
  }
  return null;
};

export function VolumeChart() {
  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-syne font-bold text-lg">Volume par jour (7 jours)</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal" />
            <span className="text-[10px] text-white/40 font-mono font-bold uppercase">Historique</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber" />
            <span className="text-[10px] text-white/40 font-mono font-bold uppercase">Aujourd'hui</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-w-0 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={260}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "var(--font-ibm-plex-mono)", fontWeight: "bold" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "var(--font-ibm-plex-mono)", fontWeight: "bold" }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === data.length - 1 ? "var(--amber)" : "var(--teal)"} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
