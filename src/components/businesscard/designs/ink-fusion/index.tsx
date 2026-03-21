import React from 'react';
import { Mail, Phone, MapPin, Globe, Facebook, Instagram } from "lucide-react";

const fieldIcons: Record<string, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  address: <MapPin className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
};

export default function InkFusionCard({ data, color, selectedFields, baseClass, compact }: any) {
  const fields = selectedFields?.filter((k: string) => data[k]?.trim()) || [];
  const accent = color || '#dc2626';
  
  return (
    <div className={`${baseClass} overflow-hidden font-mono bg-white text-black relative`}>
      {/* High contrast dramatic typography & splatters */}
      
      {/* Bold geometric shape */}
      <div className="absolute top-0 right-0 w-[80%] h-[120%] -rotate-12 translate-x-[40%] -translate-y-[10%]" 
           style={{ backgroundColor: accent, transformOrigin: 'top right' }} />
           
      {/* Distressed ink splatter overlay (via SVG) */}
      <div className="absolute inset-0 opacity-20 mix-blend-difference pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22ink%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.05%22 numOctaves=%222%22 result=%22noise%22/%3E%3CfeColorMatrix type=%22matrix%22 values=%221 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7%22 in=%22noise%22 result=%22coloredNoise%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23ink)%22/%3E%3C/svg%3E")'
      }}></div>

      <div className="relative z-10 flex-col flex h-full justify-between p-6">
        <div className="mt-4">
          <h2 className={`${compact ? 'text-3xl' : 'text-5xl'} font-black tracking-tighter uppercase leading-none mix-blend-difference text-white break-words w-[80%]`}>
            {data.name}
          </h2>
          <div className="h-1 w-16 mt-4 mb-2" style={{ backgroundColor: accent }} />
          {data.title && <p className={`${compact ? 'text-[10px]' : 'text-sm'} uppercase font-bold tracking-widest mix-blend-difference text-white`}>{data.title}</p>}
          {data.company && <p className={`${compact ? 'text-[10px]' : 'text-sm'} font-medium mix-blend-difference text-white/50 mt-1`}>{data.company}</p>}
        </div>
        
        <div className={`space-y-4 mt-auto`}>
          {fields.filter((k: string) => !["name", "title", "company"].includes(k)).map((k: string) => (
            <div key={k} className={`flex items-center gap-4 ${compact ? 'text-[9px]' : 'text-xs'} font-bold mix-blend-difference text-white/90`}>
              <span style={{ color: accent }}>{fieldIcons[k]}</span>
              <span className="tracking-widest uppercase">{data[k]}</span>
            </div>
          ))}
        </div>
        
        {/* Monogram watermark */}
        <div className="absolute bottom-[-10%] right-[-10%] text-[200px] font-black opacity-10 leading-none text-white pointer-events-none select-none">
          {data.name?.charAt(0)}
        </div>
      </div>
    </div>
  );
}
