import React, { useRef, useEffect } from 'react';

interface FitTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  minScale?: number;
  align?: "left" | "center" | "right";
}

export const FitText = ({ 
  children, 
  minScale = 0.3, 
  align = "left",
  className = "",
  style = {},
  ...props
}: FitTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    const measure = () => {
      if (!containerRef.current || !textRef.current) return;
      
      // Reset scale to measure absolute natural width
      textRef.current.style.transform = 'scale(1)';
      
      const containerWidth = containerRef.current.clientWidth;
      const textWidth = textRef.current.scrollWidth;
      
      if (textWidth > containerWidth && containerWidth > 0) {
        const newScale = containerWidth / textWidth;
        const finalScale = Math.max(minScale, Math.min(1, newScale * 0.95)); // 95% safe padding
        textRef.current.style.transform = `scale(${finalScale})`;
      } else {
        textRef.current.style.transform = 'scale(1)';
      }
    };

    // Debounce resize to prevent ResizeObserver loop errors in flexible grids
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    });

    measure(); // Initial measure
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [children, minScale]);

  const originMap = {
    left: 'left center',
    center: 'center center',
    right: 'right center'
  };

  return (
    <div 
      ref={containerRef} 
      className={`w-full overflow-visible ${className}`} 
      style={style} 
      {...props}
    >
      <div 
        ref={textRef} 
        style={{ 
          transform: 'scale(1)',
          transformOrigin: align === 'center' ? 'center' : align === 'right' ? 'right center' : 'left center',
          whiteSpace: 'nowrap',
          width: 'max-content',
          margin: align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0',
          transition: 'transform 0.1s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};
