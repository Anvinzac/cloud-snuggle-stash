import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Building2, Palette, PenTool } from "lucide-react";
import { CARD_DESIGNS, CARD_COLORS, TEMPLATE_DEFAULT_COLORS, CorporateAccount } from "@/components/businesscard/types";
import { CardPreview } from "@/components/businesscard/CardPreview";
import { useProfile } from "@/contexts/ProfileContext";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const MOCK_DATA = {
  name: "John Smith",
  title: "Senior Manager",
  company: "Example Corp",
  phone: "+1 (555) 123-4567",
  email: "john@example.com",
  address: "123 Main Street",
  website: "example.com",
};

const FONT_OPTIONS = ["Inter", "Playfair Display", "Montserrat", "Roboto"];

export default function CorporateSetup() {
  const { corporateAccount, isCorporateAdmin } = useProfile();
  const isTestUser = true;

  const [activeTab, setActiveTab] = useState<"prebuilt" | "custom">(
    corporateAccount?.template_type || "prebuilt"
  );
  const [templateId, setTemplateId] = useState(corporateAccount?.template_id || CARD_DESIGNS[0].id);
  const [accentColor, setAccentColor] = useState(corporateAccount?.accent_color || "#0f3460");
  const [fontFamily, setFontFamily] = useState(corporateAccount?.font_family || "Inter");
  const [fontSize, setFontSize] = useState(corporateAccount?.font_size || 16);
  const [saving, setSaving] = useState(false);

  if (!isCorporateAdmin && !isTestUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-foreground">Access Denied</p>
          <p className="text-sm text-muted-foreground">Only corporate administrators can access this page.</p>
          <Link to="/" className="inline-block mt-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const saveTemplate = async () => {
    if (!corporateAccount && !isTestUser) {
      toast.error("No corporate account found");
      return;
    }

    setSaving(true);

    const updates = {
      template_type: activeTab,
      template_id: activeTab === "prebuilt" ? templateId : null,
      accent_color: accentColor,
      font_family: fontFamily,
      font_size: fontSize,
    };

    if (isTestUser) {
      localStorage.setItem("test_corporate_template", JSON.stringify(updates));
      toast.success("Corporate template saved!");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("corporate_accounts")
      .update(updates)
      .eq("id", corporateAccount!.id);

    if (error) {
      toast.error("Failed to save template");
    } else {
      toast.success("Corporate template saved!");
    }
    setSaving(false);
  };

  const selectedFields = ["name", "title", "company", "phone", "email", "address", "website"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <button className="h-10 w-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-border/30 flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              Corporate Template Setup
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure the standard business card design for all employees
            </p>
          </div>
          <button
            onClick={saveTemplate}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-violet-700 transition-all shadow-lg disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Template"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-1.5 rounded-xl border border-border/30 w-fit">
          <button
            onClick={() => setActiveTab("prebuilt")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "prebuilt"
                ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Palette className="h-4 w-4 inline mr-1.5" />
            Choose a Template
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "custom"
                ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PenTool className="h-4 w-4 inline mr-1.5" />
            Custom Design
          </button>
        </div>

        {activeTab === "prebuilt" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Grid */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Select a Design
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {CARD_DESIGNS.map(design => {
                  const previewColor = TEMPLATE_DEFAULT_COLORS[design.id] || "#1a1a2e";
                  const accentShow = accentColor;
                  return (
                    <button
                      key={design.id}
                      onClick={() => setTemplateId(design.id)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        templateId === design.id
                          ? "border-cyan-500 shadow-lg ring-2 ring-cyan-500/30 scale-[1.02]"
                          : "border-transparent hover:border-cyan-200 hover:shadow-md"
                      }`}
                    >
                      <CardPreview
                        data={MOCK_DATA}
                        design={design.id}
                        color={accentShow}
                        selectedFields={selectedFields}
                        compact
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent pt-6 pb-2 px-2">
                        <p className="text-white text-xs font-semibold text-center">{design.label}</p>
                      </div>
                      {templateId === design.id && (
                        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center">
                          <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Settings Panel */}
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Brand Settings
                </h2>

                {/* Accent Color */}
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-border/30 rounded-xl p-4 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={e => setAccentColor(e.target.value)}
                        className="h-10 w-10 rounded cursor-pointer border-0"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {CARD_COLORS.slice(0, 12).map(c => (
                          <button
                            key={c}
                            onClick={() => setAccentColor(c)}
                            className={`h-6 w-6 rounded-full border-2 transition-transform ${
                              accentColor === c ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Font Family
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {FONT_OPTIONS.map(font => (
                        <button
                          key={font}
                          onClick={() => setFontFamily(font)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            fontFamily === font
                              ? "bg-cyan-500 text-white shadow-sm"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted"
                          }`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Base Font Size: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      value={fontSize}
                      onChange={e => setFontSize(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Preview
                </h2>
                <div className="w-full max-w-[220px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/20">
                  <CardPreview
                    data={MOCK_DATA}
                    design={templateId}
                    color={accentColor}
                    selectedFields={selectedFields}
                    compact
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Custom Design Tab */
          <div className="text-center py-20 space-y-4">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Custom Template Designer</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Create a fully custom template from scratch. This will be the standard design for all your employees.
            </p>
            <Link to="/designer?corporate=true">
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-violet-700 transition-all shadow-lg">
                Open Custom Designer
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
