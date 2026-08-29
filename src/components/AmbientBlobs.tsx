import React from 'react';

export default function AmbientBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-55">
      {/* Sage Green Blob */}
      <svg
        className="absolute -top-32 -right-32 w-96 h-96 md:w-[580px] md:h-[580px] text-anbar-sage animate-float-slow opacity-60"
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M41.5,-67.4C52.7,-57.8,60,-45.3,67.8,-32.4C75.6,-19.5,83.9,-6.2,82.7,6.4C81.4,18.9,70.5,30.8,60.5,41.4C50.5,52,41.4,61.3,29.9,67.6C18.4,73.9,4.4,77.3,-9.6,78.9C-23.7,80.5,-37.9,80.4,-49.8,73.8C-61.7,67.3,-71.4,54.4,-77.1,40.5C-82.7,26.6,-84.3,11.8,-82.4,-2.2C-80.5,-16.1,-75.1,-29.2,-66.6,-40.1C-58,-51,-46.2,-59.7,-33.8,-68.6C-21.3,-77.5,-8.3,-86.6,3.6,-91.5C15.6,-96.4,30.3,-77,41.5,-67.4Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Slate Blue Blob */}
      <svg
        className="absolute top-20 -left-28 w-88 h-88 md:w-[500px] md:h-[500px] text-anbar-slate animate-float-reverse opacity-50"
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M47.7,-64.2C61.4,-54.6,71.8,-40.3,76.5,-24.5C81.2,-8.7,80.2,8.6,74.1,23.8C68,39,56.8,52.1,43.2,61.7C29.6,71.3,13.6,77.4,-2.4,80.7C-18.4,84,-35.5,84.5,-49.2,76.5C-62.9,68.5,-73.2,52,-78.6,34.8C-84,17.6,-84.5,-0.3,-79.8,-16.9C-75.1,-33.5,-65.2,-48.8,-51.7,-58.5C-38.2,-68.2,-21.1,-72.3,-3.8,-67.1C13.5,-61.9,34,-73.8,47.7,-64.2Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Warm Amber Gold Blob */}
      <svg
        className="absolute top-[48%] -right-40 w-96 h-96 md:w-[560px] md:h-[560px] text-anbar-amber animate-float-slow opacity-40"
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M38.5,-52.1C51,-44.7,63.1,-35.8,70.1,-23.4C77.1,-11,79,4.9,75.4,19.6C71.7,34.3,62.5,47.8,50.1,56.6C37.8,65.4,22.3,69.5,6.8,70.2C-8.7,70.9,-24.2,68.2,-37.9,60.8C-51.6,53.4,-63.5,41.3,-70.5,26.4C-77.5,11.5,-79.6,-6.2,-74.8,-21.7C-70,-37.2,-58.3,-50.5,-44.6,-57.4C-30.9,-64.3,-15.5,-64.8,-1,-63.4C13.5,-62.1,26,-59.5,38.5,-52.1Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Terracotta Red Blob */}
      <svg
        className="absolute bottom-20 -left-32 w-88 h-88 md:w-[480px] md:h-[480px] text-anbar-rust animate-float-reverse opacity-45"
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M52.3,-68.9C67.4,-59.5,79,-43.7,83.1,-26.2C87.2,-8.7,83.8,10.5,76,27.9C68.2,45.3,56,60.9,40.3,69.8C24.6,78.7,5.4,80.9,-13.6,78.2C-32.6,75.5,-51.4,67.9,-64.3,54.8C-77.2,41.7,-84.2,23.1,-84.3,4.8C-84.4,-13.5,-77.6,-31.5,-65.7,-44.8C-53.8,-58.1,-36.8,-66.7,-19.9,-70.7C-3,-74.7,13.8,-74.1,52.3,-68.9Z"
          transform="translate(100 100)"
        />
      </svg>
    </div>
  );
}
