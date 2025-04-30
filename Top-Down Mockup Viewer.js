import React from 'react';
import './App.css'; // <-- Import the CSS file

// Main App Component
function App() {
  // Define dimensions based on the specifications (converted to numbers for easier calculations)
  const totalWidth = 83.5;
  const leftSectionWidth = 68 + 1/8; // 68.125
  const rightSectionWidth = 15 + 3/8; // 15.375
  const leftDepth = 19 + 1/4; // 19.25
  const rightDepth = 25;
  const fullShelfDepth = 10;
  const narrowShelfDepth = 6;

  // SVG ViewBox settings - adjust padding and overall size as needed
  const padding = 15; // Add padding around the drawing
  const viewBoxWidth = totalWidth + 2 * padding;
  const viewBoxHeight = rightDepth + fullShelfDepth + 2 * padding; // Max depth + shelf depth + padding

  return (
    // Main container using Tailwind for layout and styling
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Top-Down Counter & Shelf Mockup
      </h1>

      {/* SVG Container with Tailwind for responsive width and styling */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} // Dynamic viewBox based on dimensions + padding
          xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
          preserveAspectRatio="xMidYMid meet" // Scale SVG nicely
          className="w-full h-auto block" // Ensure SVG scales within its container
        >
          {/* Define reusable markers for dimension lines */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#343a40" />
            </marker>
            <marker id="tick" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 5 L 10 5" stroke="#343a40" strokeWidth="1"/>
            </marker>
          </defs>

          {/* Use a group 'g' element to apply padding offset to all drawing elements */}
          <g transform={`translate(${padding}, ${padding})`}>

            {/* Reference Back Wall Line (conceptual) */}
            <line x1={-padding/2} y1={0} x2={totalWidth + padding/2} y2={0} stroke="#ced4da" strokeWidth="0.1" strokeDasharray="2 1"/>
            <text x={totalWidth / 2} y={-2} className="text-[2.5px] fill-gray-500" textAnchor="middle">(Back Wall Reference)</text>

            {/* Wall Elements Representation (Conceptual position/depth behind counter) */}
            {/* Full Width Area (Represents Fluted Panel / 10" Deep Shelves) */}
            <rect x={0} y={0} width={leftSectionWidth} height={fullShelfDepth} className="fill-gray-300 stroke-gray-600" strokeWidth="0.25" />
            <text x={leftSectionWidth / 2} y={fullShelfDepth / 2} className="text-[3.5px] fill-gray-700 font-semibold" textAnchor="middle" dominantBaseline="middle">Fluted Panel / Full Shelves (10" D)</text>

            {/* Narrow Stack Area (Represents 6" Deep Shelves) */}
            <rect x={leftSectionWidth} y={0} width={rightSectionWidth} height={narrowShelfDepth} className="fill-gray-200 stroke-gray-600" strokeWidth="0.25" />
            <text x={leftSectionWidth + rightSectionWidth / 2} y={narrowShelfDepth / 2} className="text-[3.5px] fill-gray-700 font-semibold" textAnchor="middle" dominantBaseline="middle">Narrow Shelves (6" D)</text>

            {/* Countertop Shape */}
            {/* Path definition using coordinates relative to the padded group */}
            {/* transform="translate(0, fullShelfDepth + 2)" moves counter below wall elements */}
            <path
              className="fill-yellow-100 stroke-yellow-700" // Tailwind-like color names
              strokeWidth="0.5"
              transform={`translate(0, ${fullShelfDepth + 2})`} // Position below shelves
              d={`
                M 0 0
                L ${totalWidth} 0
                L ${totalWidth} ${rightDepth}
                L ${leftSectionWidth} ${rightDepth}
                L ${leftSectionWidth} ${leftDepth}
                L 0 ${leftDepth}
                Z
              `}
            />

            {/* Labels for Counter Sections (Positioned relative to the counter) */}
            <g transform={`translate(0, ${fullShelfDepth + 2})`}>
              <text x={leftSectionWidth / 2} y={leftDepth / 2 + 5} className="text-[3.5px] fill-gray-700 font-semibold" textAnchor="middle">Left Counter (19 ¼" D)</text>
              <text x={leftSectionWidth + rightSectionWidth / 2} y={rightDepth / 2 + 5} className="text-[3.5px] fill-gray-700 font-semibold" textAnchor="middle">Right Counter (25" D)</text>
              {/* Dog-leg label, rotated */}
              <text
                x={leftSectionWidth}
                y={ (leftDepth + rightDepth) / 2 } // Position near the dog leg angle
                className="text-[3.5px] fill-gray-700 font-semibold"
                textAnchor="middle" // Adjust anchor as needed
                transform={`rotate(-45, ${leftSectionWidth}, ${(leftDepth + rightDepth) / 2}) translate(5, 0)`} // Rotate and shift slightly
              >
                Dog-Leg
              </text>
            </g>

            {/* --- Dimension Lines and Text --- */}
            {/* Styling uses Tailwind-like class names interpreted by SVG styles/attributes */}
            {/* Using text-[3px] for dimension text size */}

            {/* Overall Width Dimension */}
            <line x1={0} y1={-5} x2={totalWidth} y2={-5} stroke="#343a40" strokeWidth="0.2" markerStart="url(#tick)" markerEnd="url(#tick)" />
            <text x={totalWidth / 2} y={-7} className="text-[3px] fill-black" textAnchor="middle">83 ½″</text>

            {/* Left Section Width Dimension */}
            <line x1={0} y1={-3} x2={leftSectionWidth} y2={-3} stroke="#343a40" strokeWidth="0.2" markerStart="url(#tick)" markerEnd="url(#tick)" />
            <text x={leftSectionWidth / 2} y={-4} className="text-[3px] fill-black" textAnchor="middle">68 ⅛″</text>

            {/* Right Section Width Dimension */}
            <line x1={leftSectionWidth} y1={-3} x2={totalWidth} y2={-3} stroke="#343a40" strokeWidth="0.2" markerStart="url(#tick)" markerEnd="url(#tick)" />
            <text x={leftSectionWidth + rightSectionWidth / 2} y={-4} className="text-[3px] fill-black" textAnchor="middle">15 ⅜″</text>

            {/* Left Counter Depth Dimension */}
            {/* Coordinates account for the 'translate(0, fullShelfDepth + 2)' on the countertop path */}
            <line x1={-3} y1={fullShelfDepth + 2} x2={-3} y2={fullShelfDepth + 2 + leftDepth} stroke="#343a40" strokeWidth="0.2" markerStart="url(#tick)" markerEnd="url(#tick)" />
            <text x={-5} y={fullShelfDepth + 2 + leftDepth / 2} className="text-[3px] fill-black" textAnchor="middle" writingMode="vertical-rl">19 ¼″</text>

            {/* Right Counter Depth Dimension */}
            <line x1={totalWidth + 3} y1={fullShelfDepth + 2} x2={totalWidth + 3} y2={fullShelfDepth + 2 + rightDepth} stroke="#343a40" strokeWidth="0.2" markerStart="url(#tick)" markerEnd="url(#tick)" />
            <text x={totalWidth + 5} y={fullShelfDepth + 2 + rightDepth / 2} className="text-[3px] fill-black" textAnchor="middle" writingMode="vertical-rl">25″</text>

            {/* Conceptual Shelf Depths */}
            {/* Full Shelf Depth */}
            <line x1={-1} y1={0} x2={-1} y2={fullShelfDepth} stroke="#343a40" strokeWidth="0.2" markerStart="url(#tick)" markerEnd="url(#tick)" />
            <text x={-2.5} y={fullShelfDepth / 2} className="text-[3px] fill-black" textAnchor="middle" writingMode="vertical-rl">10″</text>
            {/* Narrow Shelf Depth */}
            <line x1={totalWidth + 1} y1={0} x2={totalWidth + 1} y2={narrowShelfDepth} stroke="#343a40" strokeWidth="0.2" markerStart="url(#tick)" markerEnd="url(#tick)" />
            <text x={totalWidth + 2.5} y={narrowShelfDepth / 2} className="text-[3px] fill-black" textAnchor="middle" writingMode="vertical-rl">6″</text>

          </g>
        </svg>
      </div>

      {/* Optional: Add a section for notes or controls later */}
      <div className="mt-6 text-sm text-gray-600 max-w-4xl w-full">
        <p><strong>Note:</strong> This is a top-down plan view. Vertical heights are not shown. Dimensions are based on the provided specifications.</p>
      </div>
    </div>
  );
}

// Export the App component as the default export
export default App;
