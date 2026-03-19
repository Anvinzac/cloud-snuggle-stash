import React from 'react';
import { Mail, Phone, MapPin, Globe, Facebook, Instagram } from "lucide-react";

const fieldIcons: Record<string, React.ReactNode> = {
  email: <Mail className="w-3.5 h-3.5" />,
  phone: <Phone className="w-3.5 h-3.5" />,
  address: <MapPin className="w-3.5 h-3.5" />,
  website: <Globe className="w-3.5 h-3.5" />,
  facebook: <Facebook className="w-3.5 h-3.5" />,
  instagram: <Instagram className="w-3.5 h-3.5" />,
};

export default function WatercolorCard({ data, color, selectedFields, baseClass, compact }: any) {
  const fields = selectedFields?.filter((k: string) => data[k]?.trim()) || [];
  
  return (
    <div className={`${baseClass} overflow-hidden font-serif`} style={{ background: color || '#fdfbf7', color: '#1a1a1a' }}>
      {/* Soft watercolor splash effects */}
      <div className="absolute top-0 left-0 w-[150%] h-[150%] pointer-events-none mix-blend-multiply opacity-40">
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[70%] bg-[#f472b6] rounded-[50%] blur-[80px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[90%] h-[80%] bg-[#60a5fa] rounded-[50%] blur-[100px] opacity-50" />
        <div className="absolute top-[20%] right-[10%] w-[60%] h-[60%] bg-[#fbbf24] rounded-[50%] blur-[90px] opacity-40" />
      </div>

      {/* Textured SVG overlay filter */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.25] pointer-events-none mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      
      <div className="relative z-10 flex-col flex h-full justify-between p-2">
        <div className={`text-center ${compact ? 'mt-4' : 'mt-10'}`}>
          <h2 className={`${compact ? 'text-xl' : 'text-4xl'} font-normal tracking-wide`}>{data.name}</h2>
          {data.title && <p className={`${compact ? 'text-[10px]' : 'text-sm'} uppercase tracking-[0.25em] font-semibold mt-4 opacity-70`}>{data.title}</p>}
          {data.company && <p className={`${compact ? 'text-[10px]' : 'text-sm'} mt-1 opacity-50 italic`}>{data.company}</p>}
        </div>
        
        <div className={`space-y-2 mt-auto self-center w-[90%] border-t border-current/10 pt-4 pb-4`}>
          {fields.filter((k: string) => !["name", "title", "company"].includes(k)).map((k: string) => (
            <div key={k} className={`flex items-center gap-3 ${compact ? 'text-[9px]' : 'text-xs'} opacity-80 justify-center`}>
              <span className="opacity-90">{fieldIcons[k]}</span>
              <span className="tracking-wider">{data[k]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
