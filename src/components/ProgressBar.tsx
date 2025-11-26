import React from "react";

export interface ProgressBarSegment {
  label: string;
  percent: number;
  colorClass: string;
}

interface ProgressBarProps {
  title: string;
  segments: ProgressBarSegment[];
}

const ProgressBar = ({ title, segments }: ProgressBarProps) => {
  const totalPercent = segments.reduce((sum, seg) => sum + seg.percent, 0);
  if (totalPercent === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h4 className="text-xs font-semibold text-gray-600 mb-1">{title}</h4>
      <div
        className="relative w-full h-5 bg-violet-200 rounded-full overflow-hidden"
        title={title}
      >
        <div className="flex h-full text-black text-xs font-semibold">
          {segments.map((seg, index) => (
            <div
              key={index}
              className={`${seg.colorClass} h-full flex items-center justify-center`}
              style={{ width: `${seg.percent}%` }}
              title={`${seg.label}: ${seg.percent.toFixed(0)}%`}
            >
              {`${seg.percent.toFixed(0)}%`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
