import { useState } from "react";
import { CARD_DESIGNS, CARD_COLORS } from "../components/businesscard/types";
import { CardPreview } from "../components/businesscard/CardPreview";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const MOCK_DATA = {
  name: "Alexander Hamilton",
  title: "Treasury Secretary",
  company: "US Government",
  phone: "+1 (202) 555-0192",
  email: "alexander.h@treasury.gov",
  address: "1500 Pennsylvania Avenue, NW",
  website: "treasury.gov",
};

export default function BusinessCardGallery() {
  const [color, setColor] = useState(CARD_COLORS[0]);
  const [selectedFields] = useState(["name", "title", "company", "phone", "email", "address", "website"]);

  const premiumDesigns = CARD_DESIGNS;

  return (
    <div className="min-h-screen bg-neutral-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-12">
          <Link to="/" className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-neutral-900">Premium Card Gallery</h1>
            <p className="text-neutral-500 mt-1">All {CARD_DESIGNS.length} card designs.</p>
          </div>
        </div>

        <div className="flex gap-2 bg-white p-4 rounded-xl shadow-sm overflow-x-auto">
          {CARD_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full shrink-0 border-2 transition-transform ${color === c ? 'border-neutral-900 scale-110' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {premiumDesigns.map(design => (
            <div key={design.id} className="flex flex-col gap-3">
              <h3 className="text-lg font-bold text-neutral-800 flex items-center justify-between">
                {design.label}
                <span className="text-xs font-mono font-normal text-neutral-400 bg-neutral-200 px-2 py-0.5 rounded-full">{design.id}</span>
              </h3>
              <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl relative">
                <CardPreview 
                  data={MOCK_DATA}
                  design={design.id}
                  color={color}
                  selectedFields={selectedFields}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
