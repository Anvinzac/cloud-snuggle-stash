import { useState, useEffect } from "react";
import { CARD_FIELDS, CARD_DESIGNS, CARD_COLORS, ContactData, MOCK_CONTACTS, SavedContact } from "./types";
import { CardPreview } from "./CardPreview";
import { ImportTagging } from "./ImportTagging";
import { SavedCardsBrowser } from "./SavedCardsBrowser";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft, Check, Copy, CreditCard,
  Eye, EyeOff, Palette, QrCode, Users, X, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface BusinessCardSectionProps {
  user: any;
  pasteFields: { field_name: string; field_value: string }[];
  testMode: boolean;
  onBack: () => void;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let code = "";
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) code += chars[array[i] % chars.length];
  return code;
}

type View = "menu" | "create" | "design" | "preview" | "qr" | "saved" | "import";

export const BusinessCardSection = ({ user, pasteFields, testMode, onBack }: BusinessCardSectionProps) => {
  const [view, setView] = useState<View>("menu");
  const [cardData, setCardData] = useState<ContactData>({});
  const [selectedFields, setSelectedFields] = useState<string[]>(["name", "title", "company", "phone", "email"]);
  const [design, setDesign] = useState("avant-garde");
  const [color, setColor] = useState(CARD_COLORS[0]);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [savedContacts, setSavedContacts] = useState<SavedContact[]>([]);
  const [importData, setImportData] = useState<ContactData | null>(null);
  const [importDesign, setImportDesign] = useState("avant-garde");
  const [importColor, setImportColor] = useState(CARD_COLORS[0]);
  const [showControls, setShowControls] = useState(true);
  const [hiddenDesigns, setHiddenDesigns] = useState<string[]>([]);

  useEffect(() => {
    const map: Record<string, string> = {};
    const fieldMapping: Record<string, string> = {
      "Full Name": "name",
      "Email": "email",
      "Phone": "phone",
      "Address": "address",
      "Company Name": "company",
      "Facebook": "facebook",
      "Instagram": "instagram",
      "TikTok": "tiktok",
    };
    pasteFields.forEach((f) => {
      const key = fieldMapping[f.field_name];
      if (key) map[key] = f.field_value;
    });
    setCardData((prev) => ({ ...prev, ...map }));
  }, [pasteFields]);

  const updateField = (key: string, value: string) => {
    setCardData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleField = (key: string) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleGenerateQR = async () => {
    const code = generateCode();
    const snapshot = selectedFields
      .filter((k) => cardData[k]?.trim())
      .map((k) => ({ name: k, value: cardData[k]! }));

    if (!snapshot.length) { toast.error("No data to share"); return; }

    if (testMode) {
      setQrUrl(`${window.location.origin}/paste?card=${code}`);
      toast.info("Test mode: QR generated (link won't work for retrieval)");
      setView("qr");
      return;
    }

    const cardSnapshot = {
      fields: snapshot,
      design,
      color,
    };

    const { error } = await supabase.from("paste_shares").insert({
      code,
      user_id: user.id,
      shared_fields: cardSnapshot,
    });
    if (error) { toast.error("Failed to generate QR"); return; }
    setQrUrl(`${window.location.origin}/paste?card=${code}`);
    setView("qr");
  };

  const handleImportSave = async (tags: {
    category: string;
    careerTag: string | null;
    careerSubTag: string | null;
    status: string;
    customTag: string | null;
  }) => {
    if (!importData) return;

    const newContact: Omit<SavedContact, "id" | "created_at" | "updated_at"> = {
      user_id: user.id,
      contact_data: importData,
      card_design: importDesign,
      card_color: importColor,
      category: tags.category,
      career_tag: tags.careerTag,
      career_sub_tag: tags.careerSubTag,
      status: tags.status,
      custom_tag: tags.customTag,
      notes: null,
    };

    if (testMode) {
      setSavedContacts((prev) => [...prev, {
        ...newContact,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
      toast.success("Contact saved!");
      setView("saved");
      return;
    }

    const { error } = await supabase.from("saved_contacts").insert(newContact as any);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Contact saved!");
    setView("saved");
  };

  if (view === "menu") {
    const hasData = Object.values(cardData).some(v => v && typeof v === 'string' && v.trim().length > 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 overflow-y-auto">
        <div className="max-w-lg mx-auto pt-8 px-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
                <p className="text-xs text-muted-foreground">Manage your card and connections</p>
              </div>
            </div>
          </div>

          {/* User Card Section */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-semibold text-foreground">My Card</h2>
              {hasData && (
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground" onClick={() => setView("create")}>
                  Edit Card
                </Button>
              )}
            </div>
            
            {hasData ? (
              <div className="w-full max-w-[200px] mx-auto rounded-2xl overflow-hidden shadow-lg relative group">
                <CardPreview data={cardData} design={design} color={color} selectedFields={selectedFields} compact />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-[.hover]:opacity-100 sm:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setView("design")} className="h-8 shadow-md">
                    <Palette className="h-3.5 w-3.5 mr-2" /> Redesign
                  </Button>
                  <Button variant="default" size="sm" onClick={handleGenerateQR} className="h-8 bg-white/20 hover:bg-white/30 text-white shadow-md">
                    <QrCode className="h-3.5 w-3.5 mr-2" /> Share
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setView("create")}
                className="w-full aspect-[9/16] max-w-[200px] mx-auto rounded-2xl border-2 border-dashed border-border/60 bg-card/40 hover:bg-muted/60 transition-all flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-foreground hover:border-primary/50"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="text-center px-4 space-y-1">
                  <p className="text-sm font-medium text-foreground">Create Your Card</p>
                  <p className="text-[10px] opacity-70">Design a digital business card to share</p>
                </div>
              </button>
            )}
          </div>
          
          <div className="h-px w-full bg-border/50" />
        </div>

        {/* Saved Cards Browser Embedded */}
        <div className="mt-2 pb-8">
           <SavedCardsBrowser
             contacts={savedContacts}
             onBack={() => {}}
             testMode={testMode}
             isEmbedded={true}
           />
        </div>
      </div>
    );
  }

  if (view === "create") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
        <div className="max-w-lg mx-auto pt-6 space-y-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setView("menu")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold text-foreground">Card Information</h2>
          </div>

          <div className="w-full max-w-[200px] mx-auto rounded-2xl overflow-hidden shadow-lg">
            <CardPreview data={cardData} design={design} color={color} selectedFields={selectedFields} compact />
          </div>

          <div className="space-y-3">
            {CARD_FIELDS.map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <Checkbox
                  checked={selectedFields.includes(f.key)}
                  onCheckedChange={() => toggleField(f.key)}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Label className="text-xs text-muted-foreground">{f.icon} {f.label}</Label>
                  <Input
                    value={cardData[f.key] || ""}
                    onChange={(e) => updateField(f.key, e.target.value)}
                    placeholder={`Enter ${f.label.toLowerCase()}`}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setView("design")}
            className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white shadow-lg"
          >
            <Palette className="h-4 w-4 mr-2" /> Choose Design
          </Button>
        </div>
      </div>
    );
  }

  if (view === "design") {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col">
        {/* Full-Screen Card Preview */}
        <div className="flex-1 relative transition-all duration-500 ease-in-out p-4 flex items-center justify-center">
           {/* Card ambient glow based on selected color */}
           <div className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-colors duration-700" style={{ background: color }} />
           
           <div className={`transition-all duration-500 ease-out w-full h-full flex flex-col justify-center items-center ${showControls ? "pb-[280px]" : ""}`}>
             <div className={`transition-transform duration-500 ease-out h-full max-h-[70vh] w-full max-w-[340px] flex justify-center items-center ${showControls ? "scale-95" : "scale-110"}`}>
               <div className="h-full max-h-full w-auto aspect-[300/533] mx-auto flex-shrink-1">
                 <CardPreview data={cardData} design={design} color={color} selectedFields={selectedFields} />
               </div>
             </div>
           </div>
        </div>

        {/* Floating Header Actions */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-50 pointer-events-none">
           <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-full pointer-events-auto shadow-lg border border-white/10" onClick={() => setView("create")}>
             <ArrowLeft className="h-5 w-5" />
           </Button>
           <Button onClick={handleGenerateQR} className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] pointer-events-auto border-none h-10 px-5 font-semibold">
             <QrCode className="h-4 w-4 mr-2" /> Share
           </Button>
        </div>

        {/* Floating Edit Button (visible when drawer is collapsed) */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showControls ? "opacity-0 pointer-events-none scale-90 translate-y-8" : "opacity-100 pointer-events-auto scale-100 translate-y-0"}`}>
           <Button onClick={() => setShowControls(true)} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/20 rounded-full shadow-2xl px-6 h-12 font-medium">
             <Palette className="h-4 w-4 mr-2" /> Customize
           </Button>
        </div>

        {/* Collapsible Glassmorphic Drawer */}
        <div className={`absolute bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showControls ? "translate-y-0" : "translate-y-[120%]"}`}>
          <div className="max-w-lg mx-auto bg-black/60 dark:bg-black/80 backdrop-blur-3xl border-t border-x border-white/10 rounded-t-3xl p-6 shadow-2xl relative pt-10">
            {/* Drawer Drag Handle / Close Button */}
            <div className="absolute top-0 left-0 right-0 flex justify-center -mt-3">
               <button onClick={() => setShowControls(false)} className="bg-black/50 hover:bg-black/80 text-white/50 hover:text-white backdrop-blur-xl p-1.5 rounded-full border border-white/10 transition-all shadow-lg hover:scale-110">
                 <ChevronDown className="h-5 w-5" />
               </button>
            </div>
            
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-white/50 mb-3 uppercase tracking-widest">Design Style</p>
                <div className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-6 px-6 scrollbar-hide snap-x">
                  {CARD_DESIGNS.filter(d => !hiddenDesigns.includes(d.id)).map((d) => (
                    <div key={d.id} className="relative shrink-0 snap-start mt-2">
                      <button
                        onClick={() => setDesign(d.id)}
                        className={`px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${
                          design === d.id
                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105"
                            : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white active:scale-95"
                        }`}
                      >
                        {d.label}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHiddenDesigns(prev => [...prev, d.id]);
                          
                          // Save mapping automatically to file
                          fetch('/api/hide-theme', {
                            method: 'POST',
                            body: JSON.stringify({ themeId: d.id }),
                            headers: { 'Content-Type': 'application/json' }
                          }).catch(console.error);

                          if (design === d.id) {
                            const remaining = CARD_DESIGNS.filter(x => x.id !== d.id && !hiddenDesigns.includes(x.id));
                            if (remaining.length > 0) setDesign(remaining[0].id);
                          }
                        }}
                        className="absolute -top-3 -right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {hiddenDesigns.length > 0 && (
                  <div className="mt-2 p-2 bg-red-500/10 rounded border border-red-500/20 text-xs text-red-200">
                    <p className="font-bold mb-1">To be removed next time:</p>
                    <div className="break-all font-mono select-all">"{hiddenDesigns.join('", "')}"</div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-white/50 mb-3 uppercase tracking-widest">Theme Color</p>
                <div className="grid grid-cols-8 gap-3">
                  {CARD_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-10 w-10 md:h-12 md:w-12 rounded-full transition-all duration-300 shadow-md relative group ${color === c ? "scale-110" : "hover:scale-105 opacity-80 hover:opacity-100"}`}
                      style={{ background: c }}
                    >
                      {color === c && (
                        <div className="absolute inset-0 rounded-full border-2 border-white scale-110 opacity-100 transition-all shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "preview") {
    return (
      <div className="fixed inset-0 z-50">
        <CardPreview data={cardData} design={design} color={color} selectedFields={selectedFields} />
        <div className="absolute bottom-6 left-4 right-4 flex justify-between">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={() => setView("design")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button
            size="sm"
            onClick={handleGenerateQR}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            <QrCode className="h-4 w-4 mr-1" /> Share via QR
          </Button>
        </div>
      </div>
    );
  }

  if (view === "qr" && qrUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
        <div className="max-w-lg mx-auto pt-6 space-y-5">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-foreground">Share Your Card</h2>
            <p className="text-xs text-muted-foreground">Scan to view — one-time use only</p>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-xl inline-block">
              <QRCodeSVG value={qrUrl} size={220} level="H" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground break-all font-mono text-center">{qrUrl}</p>

          <div className="w-full max-w-[180px] mx-auto rounded-xl overflow-hidden shadow-lg">
            <CardPreview data={cardData} design={design} color={color} selectedFields={selectedFields} compact />
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { setView("design"); setQrUrl(null); }}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={() => { navigator.clipboard.writeText(qrUrl); toast.success("Link copied!"); }}>
              <Copy className="h-4 w-4 mr-1" /> Copy Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "import") {
    return (
      <ImportTagging
        onSave={handleImportSave}
        onCancel={() => setView("saved")}
      />
    );
  }

  if (view === "saved") {
    return (
      <SavedCardsBrowser
        contacts={savedContacts}
        onBack={() => setView("menu")}
        testMode={testMode}
      />
    );
  }

  return null;
};