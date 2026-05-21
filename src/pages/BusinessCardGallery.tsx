import { useState, useEffect } from "react";
import { CARD_DESIGNS, CARD_COLORS, MOCK_CONTACTS, SavedContact, SavedCardDesign } from "@/components/businesscard/types";
import { CardPreview } from "@/components/businesscard/CardPreview";
import { SavedCardsBrowser } from "@/components/businesscard/SavedCardsBrowser";
import { ArrowLeft, Palette, Plus, Eye, EyeOff, CreditCard, QrCode, Zap, FolderOpen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const MOCK_DATA = {
  name: "Alexander Hamilton",
  title: "Treasury Secretary",
  company: "US Government",
  phone: "+1 (202) 555-0192",
  email: "alexander.h@treasury.gov",
  address: "1500 Pennsylvania Avenue, NW",
  website: "treasury.gov",
};

const DEV_TEST_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "test@example.com",
  user_metadata: { full_name: "Test User" },
};

export default function BusinessCardGallery() {
  const [color, setColor] = useState(CARD_COLORS[0]);
  const [selectedFields] = useState(["name", "title", "company", "phone", "email", "address", "website"]);
  const [showMockData, setShowMockData] = useState(false);
  const [savedContacts, setSavedContacts] = useState<SavedContact[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<SavedCardDesign[]>([]);
  const [loading, setLoading] = useState(true);

  const isTestUser = true;
  const userId = DEV_TEST_USER.id;

  useEffect(() => {
    loadSavedDesigns();
  }, []);

  const loadSavedDesigns = async () => {
    if (isTestUser) {
      const stored = localStorage.getItem("test_card_designs");
      if (stored) setSavedDesigns(JSON.parse(stored));
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("card_designs")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (data) setSavedDesigns(data as SavedCardDesign[]);
    setLoading(false);
  };

  const deleteDesign = async (id: string) => {
    if (isTestUser) {
      const stored = localStorage.getItem("test_card_designs");
      if (stored) {
        const designs: SavedCardDesign[] = JSON.parse(stored).filter((d: SavedCardDesign) => d.id !== id);
        localStorage.setItem("test_card_designs", JSON.stringify(designs));
        setSavedDesigns(designs);
      }
      toast.success("Design deleted");
      return;
    }
    const { error } = await supabase.from("card_designs").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    await loadSavedDesigns();
    toast.success("Design deleted");
  };

  const premiumDesigns = CARD_DESIGNS;

  const mockContactsForBrowser = showMockData ? (MOCK_CONTACTS as SavedContact[]) : savedContacts;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-xl">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">Card Studio</h1>
              <p className="text-sm text-muted-foreground">Design, collect, and share business cards</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowMockData(!showMockData)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                showMockData
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                  : "bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted"
              }`}
            >
              {showMockData ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showMockData ? "Hide Test Data" : "Show Test Data"}
            </button>

            <Link to="/designer/new">
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-violet-700 transition-all shadow-lg">
                <Palette className="w-4 h-4" /> Design Card
              </button>
            </Link>

            <Link to="/share">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-border/50 rounded-lg font-semibold hover:bg-muted transition-all shadow-sm">
                <QrCode className="w-4 h-4" /> Share Fields
              </button>
            </Link>
          </div>
        </div>

        {/* My Saved Designs */}
        {savedDesigns.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-violet-500" /> My Saved Designs
              <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full font-medium">{savedDesigns.length}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedDesigns.map(design => (
                <div key={design.id} className="group relative">
                  <Link to={`/designer?id=${design.id}`}>
                    <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border border-border/20 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all">
                      <div
                        className="w-full h-full relative"
                        style={{
                          background: design.bg_type === 'gradient'
                            ? `linear-gradient(${design.gradient_angle}deg, ${design.gradient_color1}, ${design.gradient_color2})`
                            : design.bg_type === 'solid'
                            ? design.solid_color
                            : design.bg_image ? `url(${design.bg_image}) center/cover` : '#333'
                        }}
                      >
                        {design.elements.slice(0, 3).map((el, i) => (
                          <div
                            key={el.id}
                            className="absolute truncate px-1"
                            style={{
                              left: `${(el.x / 300) * 100}%`,
                              top: `${(el.y / 533) * 100}%`,
                              fontSize: `${el.fontSize * 0.6}px`,
                              fontFamily: el.fontFamily,
                              fontWeight: el.fontWeight,
                              color: el.color,
                              maxWidth: `${(el.width / 300) * 100}%`,
                            }}
                          >
                            {el.text}
                          </div>
                        ))}
                        {design.elements.length > 3 && (
                          <div className="absolute bottom-2 right-2 text-[8px] text-white/50">+{design.elements.length - 3}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground truncate flex-1">{design.design_name}</p>
                    <button
                      onClick={(e) => { e.preventDefault(); deleteDesign(design.id); }}
                      className="shrink-0 ml-2 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Guide to Design */}
        {savedDesigns.length === 0 && mockContactsForBrowser.length === 0 && (
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="text-center space-y-3">
              <h2 className="text-lg font-bold text-foreground">Your Card</h2>
              <div className="w-full max-w-[220px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/20">
                <CardPreview data={MOCK_DATA} design="avant-garde" color={color} selectedFields={selectedFields} compact />
              </div>
              <Link to="/designer/new">
                <button className="mt-3 flex items-center gap-2 mx-auto px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-violet-700 transition-all shadow-lg">
                  <Plus className="w-4 h-4" /> Create Your Card
                </button>
              </Link>
            </div>

            {/* Getting Started Guide */}
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">Getting Started</h3>
              <div className="grid gap-3">
                {[
                  { icon: Palette, title: "Design Your Card", desc: "Use the card designer to create your unique business card with drag & drop" },
                  { icon: CreditCard, title: "Collect Cards", desc: "Save cards from people you meet to build your network" },
                  { icon: Zap, title: "Share & Connect", desc: "Share your card via QR code or link with anyone" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-4">
                    <div className="shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Saved Cards Browser */}
        {mockContactsForBrowser.length > 0 && (
          <SavedCardsBrowser
            contacts={mockContactsForBrowser}
            onBack={() => {}}
            testMode={showMockData}
            isEmbedded={true}
          />
        )}

        {/* Template Gallery (only when showing mock data) */}
        {showMockData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Template Gallery</h2>
              <div className="flex gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-2 rounded-xl shadow-sm">
                {CARD_COLORS.slice(0, 8).map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full shrink-0 border-2 transition-transform ${color === c ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumDesigns.slice(0, 6).map(design => (
                <div key={design.id} className="flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-foreground flex items-center justify-between">
                    {design.label}
                  </h3>
                  <Link to="/designer">
                    <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border border-border/20 cursor-pointer hover:shadow-xl transition-shadow group relative">
                      <CardPreview
                        data={MOCK_DATA}
                        design={design.id}
                        color={color}
                        selectedFields={selectedFields}
                        compact
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-white/90 rounded-lg text-sm font-semibold shadow-lg">
                          Use This Template
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
