import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Save, CreditCard } from "lucide-react";
import { CardPreview } from "@/components/businesscard/CardPreview";
import { ContactData, SavedCardDesign, CanvasElement, CARD_FIELDS } from "@/components/businesscard/types";
import { useProfile } from "@/contexts/ProfileContext";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const DEV_TEST_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "test@example.com",
  user_metadata: { full_name: "Test User" },
};

export default function LockedDesigner() {
  const { corporateAccount, loading: profileLoading } = useProfile();
  const isTestUser = true;
  const userId = DEV_TEST_USER.id;

  const [cardData, setCardData] = useState<ContactData>({});
  const [designName, setDesignName] = useState("My Card");
  const [saving, setSaving] = useState(false);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!corporateAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-foreground">No corporate template found</p>
          <p className="text-sm text-muted-foreground">Please contact your administrator.</p>
          <Link to="/" className="inline-block mt-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const fields = corporateAccount.template_type === "prebuilt"
    ? corporateAccount.selected_fields || ["name", "title", "company", "phone", "email"]
    : CARD_FIELDS.map(f => f.key);

  const updateField = (key: string, value: string) => {
    setCardData(prev => ({ ...prev, [key]: value }));
  };

  const saveDesign = async () => {
    setSaving(true);

    const hasData = Object.values(cardData).some(v => v?.trim());
    if (!hasData) {
      toast.error("Please fill in at least one field");
      setSaving(false);
      return;
    }

    const designData = {
      user_id: userId,
      design_name: designName,
      bg_type: "gradient" as const,
      gradient_color1: corporateAccount.accent_color,
      gradient_color2: adjustColor(corporateAccount.accent_color, -30),
      gradient_angle: 135,
      solid_color: "#ffffff",
      bg_image: null,
      current_frame: "none",
      elements: [] as CanvasElement[],
      card_data: cardData,
      selected_fields: fields,
      template_id: corporateAccount.template_id || null,
    };

    if (isTestUser) {
      const stored = localStorage.getItem("test_card_designs");
      let designs: SavedCardDesign[] = stored ? JSON.parse(stored) : [];
      const newDesign: SavedCardDesign = {
        ...designData,
        id: `local-${Date.now()}`,
        template_id: corporateAccount.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      designs.unshift(newDesign);
      localStorage.setItem("test_card_designs", JSON.stringify(designs));
      toast.success("Card saved!");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("card_designs")
      .insert({ ...designData, template_id: corporateAccount.id });
    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Card saved!");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <button className="h-10 w-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-border/30 flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              {corporateAccount.name} — Business Card
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in your details below. The design is managed by your company.
            </p>
          </div>
        </div>

        {/* Main Content: Form + Preview */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Form */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Card Name</label>
              <input
                type="text"
                value={designName}
                onChange={e => setDesignName(e.target.value)}
                className="w-full bg-white/60 dark:bg-gray-800/60 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                placeholder="My Card"
              />
            </div>

            <div className="space-y-3">
              {fields.map(key => {
                const fieldDef = CARD_FIELDS.find(f => f.key === key);
                return (
                  <div key={key}>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      {fieldDef?.icon} {fieldDef?.label || key}
                    </label>
                    <input
                      type="text"
                      value={cardData[key] || ""}
                      onChange={e => updateField(key, e.target.value)}
                      className="w-full bg-white/60 dark:bg-gray-800/60 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                      placeholder={`Enter ${fieldDef?.label?.toLowerCase() || key}`}
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={saveDesign}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-violet-700 transition-all shadow-lg disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Card"}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="lg:w-[320px] flex-shrink-0 flex flex-col items-center gap-4">
            <div className="w-full max-w-[240px] rounded-2xl overflow-hidden shadow-2xl border border-border/20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              {corporateAccount.template_type === "prebuilt" && corporateAccount.template_id ? (
                <CardPreview
                  data={cardData}
                  design={corporateAccount.template_id}
                  color={corporateAccount.accent_color}
                  selectedFields={fields}
                  compact
                />
              ) : corporateAccount.template_type === "custom" && corporateAccount.custom_design ? (
                <DesignPreview
                  customDesign={corporateAccount.custom_design}
                  cardData={cardData}
                  fields={fields}
                />
              ) : (
                <div className="w-full aspect-[300/533] flex items-center justify-center text-muted-foreground text-sm">
                  <p>Template not configured</p>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Live preview — this is how your card will look
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function DesignPreview({
  customDesign,
  cardData,
  fields,
}: {
  customDesign: SavedCardDesign;
  cardData: ContactData;
  fields: string[];
}) {
  return (
    <div
      className="w-full aspect-[300/533] relative overflow-hidden"
      style={{
        background: customDesign.bg_type === "gradient"
          ? `linear-gradient(${customDesign.gradient_angle}deg, ${customDesign.gradient_color1}, ${customDesign.gradient_color2})`
          : customDesign.bg_type === "solid"
          ? customDesign.solid_color
          : customDesign.bg_image
          ? `url(${customDesign.bg_image}) center/cover`
          : "#fff",
      }}
    >
      {customDesign.elements
        .filter(el => fields.includes(el.fieldId) && cardData[el.fieldId]?.trim())
        .map(el => (
          <div
            key={el.id}
            className="absolute select-none"
            style={{
              left: el.x,
              top: el.y,
              fontSize: el.fontSize,
              fontFamily: el.fontFamily,
              fontWeight: el.fontWeight,
              color: el.color,
              zIndex: el.zIndex,
            }}
          >
            {cardData[el.fieldId]}
          </div>
        ))}
    </div>
  );
}
