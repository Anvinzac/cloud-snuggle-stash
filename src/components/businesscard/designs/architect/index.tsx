import { BusinessCardTemplateProps } from "../types";
import { Mail, Phone, MapPin, Globe, Facebook, Instagram } from "lucide-react";

const fieldIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-3.5 w-3.5" />,
  phone: <Phone className="h-3.5 w-3.5" />,
  address: <MapPin className="h-3.5 w-3.5" />,
  website: <Globe className="h-3.5 w-3.5" />,
  facebook: <Facebook className="h-3.5 w-3.5" />,
  instagram: <Instagram className="h-3.5 w-3.5" />,
};

export default function Architect({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--architect !p-0`}>
      <div className="ea-content w-full h-full">
        <header className="ea-header">
          <h1 className="ea-name" style={{ whiteSpace: 'pre-line' }}>{name.replace(' ', '\n')}</h1>
          <h2 className="ea-role mt-2 truncate">{title}</h2>
        </header>
        
        <div className="ea-footer-box">
          <ul className="ea-info">
            {fields.filter(k => !["name","title"].includes(k)).slice(0,3).map(k => (
              <li key={k} className="truncate flex items-center justify-end gap-1">
                {data[k]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
