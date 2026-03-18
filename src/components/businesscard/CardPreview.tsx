import { ContactData } from "./types";
import { Mail, Phone, MapPin, Globe, Facebook, Instagram } from "lucide-react";

interface CardPreviewProps {
  data: ContactData;
  design: string;
  color: string;
  selectedFields: string[];
  compact?: boolean;
}

const fieldIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-3.5 w-3.5" />,
  phone: <Phone className="h-3.5 w-3.5" />,
  address: <MapPin className="h-3.5 w-3.5" />,
  website: <Globe className="h-3.5 w-3.5" />,
  facebook: <Facebook className="h-3.5 w-3.5" />,
  instagram: <Instagram className="h-3.5 w-3.5" />,
};

export const CardPreview = ({ data, design, color, selectedFields, compact }: CardPreviewProps) => {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const company = data.company || "";

  const baseClass = compact
    ? "w-full aspect-[9/16] rounded-2xl overflow-hidden relative flex flex-col justify-between p-5 text-white"
    : "w-full min-h-[100dvh] flex flex-col justify-between p-8 text-white";

  const textSize = compact ? "text-base" : "text-2xl";
  const subSize = compact ? "text-[10px]" : "text-sm";
  const detailSize = compact ? "text-[9px]" : "text-xs";

  if (design === "classic") {
    return (
      <div className={baseClass} style={{ background: color }}>
        <div className="flex-1 flex flex-col justify-center space-y-3">
          <div className="w-12 h-0.5 bg-white/40 rounded-full" />
          <h2 className={`${textSize} font-bold tracking-tight`}>{name}</h2>
          {title && <p className={`${subSize} font-medium opacity-80`}>{title}</p>}
          {company && <p className={`${subSize} opacity-60`}>{company}</p>}
        </div>
        <div className="space-y-2 mt-auto">
          {fields.filter(k => !["name","title","company"].includes(k)).map((k) => (
            <div key={k} className={`flex items-center gap-2 opacity-75 ${detailSize}`}>
              {fieldIcons[k] || <span className="h-3.5 w-3.5" />}
              <span className="truncate">{data[k]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (design === "modern") {
    return (
      <div className={baseClass} style={{ background: `linear-gradient(160deg, ${color}, ${color}dd, ${color}88)` }}>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 rounded-bl-[100px] bg-white/5" />
        <div className="flex-1 flex flex-col justify-center space-y-4 relative z-10">
          <h2 className={`${textSize} font-black uppercase tracking-widest`}>{name}</h2>
          <div className="flex items-center gap-2">
            {title && <span className={`${subSize} px-2 py-0.5 rounded-full bg-white/15 font-medium`}>{title}</span>}
          </div>
          {company && <p className={`${subSize} opacity-70 font-light`}>{company}</p>}
        </div>
        <div className="space-y-2 relative z-10">
          {fields.filter(k => !["name","title","company"].includes(k)).map((k) => (
            <div key={k} className={`flex items-center gap-2 ${detailSize} bg-white/10 rounded-lg px-3 py-1.5`}>
              {fieldIcons[k] || <span className="h-3.5 w-3.5" />}
              <span className="truncate">{data[k]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (design === "minimal") {
    return (
      <div className={`${baseClass} !text-foreground`} style={{ background: "var(--background)" }}>
        <div className="flex-1 flex flex-col justify-center space-y-2">
          <h2 className={`${textSize} font-semibold !text-foreground`}>{name}</h2>
          {title && <p className={`${subSize} text-muted-foreground`}>{title}</p>}
          {company && <p className={`${subSize} text-muted-foreground`}>{company}</p>}
        </div>
        <div className="border-t border-border pt-4 space-y-2">
          {fields.filter(k => !["name","title","company"].includes(k)).map((k) => (
            <div key={k} className={`flex items-center gap-2 text-muted-foreground ${detailSize}`}>
              {fieldIcons[k]}
              <span className="truncate">{data[k]}</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 right-6 w-16 h-16 rounded-full" style={{ background: color, opacity: 0.15 }} />
      </div>
    );
  }

  if (design === "bold") {
    return (
      <div className={baseClass} style={{ background: color }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.08),transparent)]" />
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <h2 className={`${compact ? "text-xl" : "text-4xl"} font-black leading-tight`}>{name}</h2>
          {title && <p className={`${subSize} font-bold mt-2 uppercase tracking-wider opacity-70`}>{title}</p>}
          {company && <p className={`${subSize} mt-1 opacity-50`}>{company}</p>}
        </div>
        <div className="space-y-1.5 relative z-10">
          {fields.filter(k => !["name","title","company"].includes(k)).map((k) => (
            <div key={k} className={`${detailSize} opacity-80 font-medium`}>
              {data[k]}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (design === "gradient") {
    return (
      <div className={baseClass} style={{ background: `linear-gradient(135deg, ${color}, #1a1a2e, ${color}cc)` }}>
        <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-white/5 blur-xl" />
        <div className="absolute bottom-16 left-6 w-32 h-32 rounded-full bg-white/3 blur-2xl" />
        <div className="flex-1 flex flex-col justify-center relative z-10 space-y-3">
          <h2 className={`${textSize} font-bold`}>{name}</h2>
          <div>
            {title && <p className={`${subSize} opacity-80`}>{title}</p>}
            {company && <p className={`${subSize} opacity-60 mt-0.5`}>{company}</p>}
          </div>
        </div>
        <div className="space-y-2 relative z-10">
          {fields.filter(k => !["name","title","company"].includes(k)).map((k) => (
            <div key={k} className={`flex items-center gap-2 ${detailSize} opacity-70`}>
              {fieldIcons[k]}
              <span className="truncate">{data[k]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // elegant
  return (
    <div className={baseClass} style={{ background: color }}>
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="flex-1 flex flex-col justify-center relative z-10 space-y-4">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
          {name.charAt(0)}
        </div>
        <h2 className={`${textSize} font-semibold tracking-wide`}>{name}</h2>
        {title && <p className={`${subSize} opacity-80 italic`}>{title}</p>}
        {company && <p className={`${subSize} opacity-60`}>{company}</p>}
      </div>
      <div className="space-y-2 relative z-10 border-t border-white/10 pt-4">
        {fields.filter(k => !["name","title","company"].includes(k)).map((k) => (
          <div key={k} className={`flex items-center gap-2 ${detailSize} opacity-75`}>
            {fieldIcons[k]}
            <span className="truncate">{data[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};