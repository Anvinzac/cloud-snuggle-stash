import { useState, useEffect } from "react";
import { CARD_FIELDS, CARD_DESIGNS, CARD_COLORS, ContactData, MOCK_CONTACTS, SavedContact } from "./types";
import { CardPreview } from "./CardPreview";
import { ImportTagging } from "./ImportTagging";
import { SavedCardsBrowser } from "./SavedCardsBrowser";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft, Check, Copy, CreditCard,
  Eye, EyeOff, Palette, QrCode, Users, X
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
  const [design, setDesign] = useState("classic");
  const [color, setColor] = useState(CARD_COLORS[0]);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [savedContacts, setSavedContacts] = useState<SavedContact[]>([]);
  const [importData, setImportData] = useState<ContactData | null>(null);
  const [importDesign, setImportDesign] = useState("classic");
  const [importColor, setImportColor] = useState(CARD_COLORS[0]);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
        <div className="max-w-lg mx-auto pt-6 space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Business Card</h1>
              <p className="text-xs text-muted-foreground">Create, share & collect cards</p>
            </div>
          </div>

          <div className="grid gap-3">
            <button
              onClick={() => setView("create")}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-muted/30 transition-all text-left"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Create My Card</h3>
                <p className="text-xs text-muted-foreground">Design your business card & share via QR</p>
              </div>
            </button>

            <button
              onClick={() => setView("saved")}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-muted/30 transition-all text-left"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Saved Cards</h3>
                <p className="text-xs text-muted-foreground">Browse contacts you've collected ({testMode ? MOCK_CONTACTS.length : savedContacts.length})</p>
              </div>
            </button>
          </div>
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
        <div className="max-w-lg mx-auto pt-6 space-y-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setView("create")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold text-foreground">Card Design</h2>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Style</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              {CARD_DESIGNS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDesign(d.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    design === d.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Color</p>
            <div className="grid grid-cols-8 gap-2">
              {CARD_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden shadow-xl">
            <CardPreview data={cardData} design={design} color={color} selectedFields={selectedFields} compact />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setView("preview")}>
              <Eye className="h-4 w-4 mr-1" /> Full Preview
            </Button>
            <Button
              onClick={handleGenerateQR}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white shadow-lg"
            >
              <QrCode className="h-4 w-4 mr-1" /> Share
            </Button>
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