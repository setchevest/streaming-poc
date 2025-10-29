'use client';

import { useState } from 'react';
import { StatisticItem as StatisticItemType } from '@/lib/types/statistics';

interface Props {
  item: StatisticItemType;
  className?: string;
  showTooltip?: boolean;
}

export default function StatisticItem({ item, className = '', showTooltip = true }: Props) {
  const [showTooltipContent, setShowTooltipContent] = useState(false);

  return (
    <div
      className={`relative text-center p-4 group ${className}`}
      onMouseEnter={() => showTooltip && setShowTooltipContent(true)}
      onMouseLeave={() => setShowTooltipContent(false)}
    >
      {/* Main statistic display */}
      <div className="flex flex-col items-center">
        {/* Icon if provided */}
        {item.icon && (
          <div
            className="text-3xl mb-2 opacity-70 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          >
            {item.icon}
          </div>
        )}

        {/* Label - uppercase caption style with wide tracking */}
        <p className="text-xs uppercase tracking-widest text-[#A8A29E] font-medium mb-2">
          {item.label}
        </p>

        {/* Value - display scale with monospace for numbers */}
        <div className="flex items-baseline gap-1">
          <p
            className="text-3xl font-mono font-medium text-[#57534E]"
            aria-label={`${item.label}: ${item.value}${item.unit ? ` ${item.unit}` : ''}`}
          >
            {item.value}
          </p>

          {/* Unit if provided */}
          {item.unit && (
            <p className="text-sm text-[#A8A29E] font-medium mb-1">{item.unit}</p>
          )}
        </div>

        {/* Trend indicator if provided */}
        {item.trend && (
          <div className="mt-2">
            {item.trend === 'up' && (
              <svg
                className="w-4 h-4 text-[#8FA87E] mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Trend: increasing"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            )}
            {item.trend === 'down' && (
              <svg
                className="w-4 h-4 text-[#A8826B] mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Trend: decreasing"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                />
              </svg>
            )}
            {item.trend === 'stable' && (
              <svg
                className="w-4 h-4 text-[#78716C] mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Trend: stable"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Tooltip - canvas card with layered shadow */}
      {item.tooltip && showTooltipContent && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20 pointer-events-none"
          role="tooltip"
          aria-hidden={!showTooltipContent}
        >
          <div className="bg-[#E7E5E4] border border-[#A8A29E] border-opacity-30 rounded-lg px-3 py-2 text-xs text-[#57534E] whitespace-nowrap shadow-lg">
            {item.tooltip}
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-[#E7E5E4]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMiIgLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIGZpbGwtb3BhY2l0eT0iMC4wMyIgLz48L3N2Zz4=')] opacity-30 pointer-events-none rounded-lg"></div>
    </div>
  );
}
