import React, { Suspense, useEffect, useRef, useState } from "react";
import { ContactData } from "./types";
import "./premium-cards.css";
import { DESIGN_REGISTRY } from "./designs/registry";

interface CardPreviewProps {
  data: ContactData;
  design: string;
  color: string;
  selectedFields: string[];
  compact?: boolean;
}

export const CardPreview = ({ data, design, color, selectedFields, compact }: CardPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create an observer that calculates the exact scale needed to fit the original 300x533 canvas
    // into whatever the current parent container's dimensions are, acting like object-fit: contain.
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const scaleW = width / 300;
        const scaleH = height / 533;
        // Take the smaller scale mapping to ensure perfectly contained proportions
        setScale(Math.min(scaleW, scaleH));
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // The wrapper takes the responsive Tailwind dimensions, while the inside will be rigidly scaled.
  const containerClass = compact
    ? "w-full aspect-[300/533] rounded-2xl overflow-hidden relative flex items-center justify-center [container-type:inline-size]"
    : "w-full aspect-[300/533] flex items-center justify-center relative overflow-hidden [container-type:inline-size] shadow-2xl";

  // The internal base class enforces the strict 300x533 canvas that all templates were designed against.
  const innerBaseClass = "w-[300px] h-[533px] relative overflow-hidden shrink-0 bg-transparent";

  const SelectedDesign = DESIGN_REGISTRY[design] || DESIGN_REGISTRY["avant-garde"];

  if (SelectedDesign) {
    return (
      <div className={containerClass} style={{ background: color }} ref={containerRef}>
        <div 
          style={{ 
            width: 300, 
            height: 533, 
            transform: `scale(${scale})`, 
            transformOrigin: "center",
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center"
          }}
        >
          <React.Suspense fallback={<div className="animate-pulse text-sm font-medium text-white/50">Loading design...</div>}>
            <SelectedDesign data={data} selectedFields={selectedFields} baseClass={innerBaseClass} color={color} compact={compact} />
          </React.Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} style={{ background: color }}>
      <div className="text-sm font-medium text-white/50">Design not found</div>
    </div>
  );
};