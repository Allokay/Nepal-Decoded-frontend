'use client';

export function ElectionPrediction() {
  const data = [
    { party: 'NC (Nepali Congress)', percentage: 35, color: '#2563eb' },
    { party: 'CPN-UML', percentage: 28, color: '#dc2626' },
    { party: 'CPN-Maoist Center', percentage: 22, color: '#16a34a' },
    { party: 'Others & Independents', percentage: 15, color: '#6b7280' },
  ];

  let cumulativePercentage = 0;

  const createSlice = (percentage: number, startAngle: number, color: string) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return <path d={path} fill={color} className="transition-all duration-500 hover:opacity-95 cursor-pointer" />;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 font-display uppercase tracking-wider">
          Election Outlook
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="w-56 h-56">
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-md">
              {data.map((item, index) => {
                const slice = createSlice(item.percentage, cumulativePercentage * 3.6, item.color);
                cumulativePercentage += item.percentage;
                return <g key={index}>{slice}</g>;
              })}
            </svg>
          </div>

          <div className="space-y-3.5 max-w-sm w-full md:w-auto">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-8 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-slate-700 dark:text-slate-300 font-bold text-sm font-display">{item.party}</span>
                </div>
                <span className="text-slate-900 dark:text-white font-extrabold text-sm">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-8 italic text-center font-medium">
          Based on recent polling aggregates. Not a representation of official results.
        </p>
      </div>
    </section>
  );
}
