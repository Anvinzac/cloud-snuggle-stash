import { BusinessCardTemplateProps } from "../types";

export default function Creator({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--creator !p-0`}>
      <div className="vc-blob"></div>
      
      <div className="vc-content w-full h-full">
        <h1 className="vc-name" style={{ whiteSpace: 'pre-line' }}>{name.replace(' ', '\n')}</h1>
        {title && <h2 className="vc-role text-center">{title}</h2>}
        
        <ul className="vc-info">
          {fields.filter(k => !["name","title"].includes(k)).slice(0,3).map(k => (
            <li key={k} className="truncate">{data[k]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
