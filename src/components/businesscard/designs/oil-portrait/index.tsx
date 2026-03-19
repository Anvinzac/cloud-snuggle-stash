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

export default function OilPortraitCard({ data, color, selectedFields, baseClass, compact }: any) {
  const fields = selectedFields?.filter((k: string) => data[k]?.trim()) || [];
  const primary = color || '#0f172a'; // Deep tone
  
  return (
    <div className={`${baseClass} overflow-hidden font-sans`} style={{ backgroundColor: primary, color: '#f8fafc' }}>
      
      {/* Painterly brush strokes (CSS simulated via radial gradients and box shadows) */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none" 
           style={{ background: `radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.05) 0%, transparent 40%)` }}>
      </div>
      
      {/* Heavy Canvas Texture */}
      <div className="absolute inset-0 opacity-[0.1]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
      }} />

      {/* Gold Frame effect */}
      <div className="absolute inset-4 border border-[#cfb53b]/40 rounded-sm pointer-events-none shadow-[inset_0_0_20px_rgba(207,181,59,0.1)]" />
      <div className="absolute inset-5 border border-[#cfb53b]/20 rounded-sm pointer-events-none" />

      <div className="relative z-10 flex-col flex h-full justify-between p-6 pl-8">
        <div className={`mt-8 relative`}>
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#cfb53b] to-transparent rounded-full" />
          <h2 className={`${compact ? 'text-2xl' : 'text-5xl'} font-bold tracking-tight text-[#f8fafc] drop-shadow-md`} style={{ fontFamily: '"Playfair Display", serif' }}>
            {data.name}
          </h2>
          {data.title && <p className={`${compact ? 'text-[10px]' : 'text-sm'} uppercase tracking-[0.15em] font-medium mt-3 text-[#cfb53b]`}>{data.title}</p>}
          {data.company && <p className={`${compact ? 'text-[10px]' : 'text-sm'} mt-1 text-white/50`}>{data.company}</p>}
        </div>
        
        <div className={`space-y-3 mt-auto mb-4`}>
          {fields.filter((k: string) => !["name", "title", "company"].includes(k)).map((k: string) => (
            <div key={k} className={`flex items-center gap-4 ${compact ? 'text-[10px]' : 'text-xs'} text-white/80`}>
              <span className="text-[#cfb53b]/80">{fieldIcons[k]}</span>
              <span className="font-light tracking-wide">{data[k]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
