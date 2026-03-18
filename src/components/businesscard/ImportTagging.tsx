import { useState } from "react";
import { CONTACT_CATEGORIES, STATUS_OPTIONS, MOCK_CAREER_CATEGORIES } from "./types";
import { ChevronDown, ChevronRight, Check, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImportTaggingProps {
  onSave: (tags: {
    category: string;
    careerTag: string | null;
    careerSubTag: string | null;
    status: string;
    customTag: string | null;
  }) => void;
  onCancel: () => void;
}

export const ImportTagging = ({ onSave, onCancel }: ImportTaggingProps) => {
  const [category, setCategory] = useState("Others");
  const [careerTag, setCareerTag] = useState<string | null>(null);
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  const [careerSubTag, setCareerSubTag] = useState<string | null>(null);
  const [status, setStatus] = useState("Normal");
  const [customTag, setCustomTag] = useState("");

  const handleCareerTap = (name: string) => {
    if (careerTag === name) {
      setCareerTag(null);
      setCareerSubTag(null);
      setExpandedCareer(null);
    } else {
      setCareerTag(name);
      setCareerSubTag(null);
      setExpandedCareer(name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
      <div className="max-w-lg mx-auto pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Tag this contact</h2>
          <Button variant="ghost" size="sm" onClick={onCancel}><X className="h-4 w-4" /></Button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">📁 Category</p>
          <div className="flex flex-wrap gap-2">
            {CONTACT_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === c
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">💼 Career</p>
          <div className="flex flex-wrap gap-2">
            {MOCK_CAREER_CATEGORIES.map((cat) => (
              <div key={cat.name} className="inline-block">
                <button
                  onClick={() => handleCareerTap(cat.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                    careerTag === cat.name
                      ? "bg-violet-500 text-white shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                  {careerTag === cat.name ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>

          {expandedCareer && (
            <div className="mt-2 p-3 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/30 animate-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 mb-2 uppercase tracking-wider">
                {expandedCareer} specializations
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_CAREER_CATEGORIES.find((c) => c.name === expandedCareer)?.subs.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => setCareerSubTag(careerSubTag === sub.name ? null : sub.name)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      careerSubTag === sub.name
                        ? "bg-violet-500 text-white"
                        : "bg-white dark:bg-gray-800 text-foreground border border-border/50 hover:border-violet-300"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">⭐ Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.filter((s) => s.value !== "Expired").map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  status === s.value
                    ? `${s.color} ring-2 ring-primary/30`
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                {s.value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">🏷️ Custom Tag <span className="font-normal">(optional)</span></p>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Input
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="e.g. Ho Chi Minh City, Old friend..."
              className="h-9 text-sm"
            />
          </div>
        </div>

        <Button
          onClick={() => onSave({
            category,
            careerTag,
            careerSubTag,
            status,
            customTag: customTag.trim() || null,
          })}
          className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white shadow-lg"
        >
          <Check className="h-4 w-4 mr-2" /> Save Contact
        </Button>
      </div>
    </div>
  );
};