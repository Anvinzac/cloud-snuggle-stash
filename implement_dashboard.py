import re

# 1. Update SavedCardsBrowser.tsx
with open('src/components/businesscard/SavedCardsBrowser.tsx', 'r') as f:
    scb_code = f.read()

scb_props_target = '''interface SavedCardsBrowserProps {
  contacts: SavedContact[];
  onBack: () => void;
  testMode?: boolean;
}'''
scb_props_replacement = '''interface SavedCardsBrowserProps {
  contacts: SavedContact[];
  onBack: () => void;
  testMode?: boolean;
  isEmbedded?: boolean;
}'''
scb_code = scb_code.replace(scb_props_target, scb_props_replacement)

scb_component_def = r'''export const SavedCardsBrowser = \(\{\s*contacts:\s*propContacts,\s*onBack,\s*testMode\s*\}\s*:\s*SavedCardsBrowserProps\) => \{'''
scb_component_rep = '''export const SavedCardsBrowser = ({ contacts: propContacts, onBack, testMode, isEmbedded }: SavedCardsBrowserProps) => {'''
scb_code = re.sub(scb_component_def, scb_component_rep, scb_code)

scb_render_target = r'''    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <div className="max-w-lg mx-auto pt-6 pb-8 px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick=\{onBack\}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold text-foreground">Saved Cards</h2>'''

scb_render_replacement = '''    <div className={isEmbedded ? "" : "min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950"}>
      <div className={`max-w-lg mx-auto px-4 ${isEmbedded ? "pt-2 pb-4" : "pt-6 pb-8"} space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isEmbedded && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-lg font-bold text-foreground">Saved Cards</h2>'''

scb_code = re.sub(scb_render_target, scb_render_replacement, scb_code)

with open('src/components/businesscard/SavedCardsBrowser.tsx', 'w') as f:
    f.write(scb_code)

# 2. Update BusinessCardSection.tsx
with open('src/components/businesscard/BusinessCardSection.tsx', 'r') as f:
    bcs_code = f.read()

bcs_menu_target = r'''  if \(view === "menu"\) \{
    return \(
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
        <div className="max-w-lg mx-auto pt-6 space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick=\{onBack\}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Business Card</h1>
              <p className="text-xs text-muted-foreground">Create, share & collect cards</p>
            </div>
          </div>

          <div className="grid gap-3">
            <button
              onClick=\{\(\) => setView\("create"\)\}
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
              onClick=\{\(\) => setView\("saved"\)\}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-muted/30 transition-all text-left"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Saved Cards</h3>
                <p className="text-xs text-muted-foreground">Browse contacts you've collected \(\{testMode \? MOCK_CONTACTS.length : savedContacts.length\}\)</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    \);
  \}'''

bcs_menu_replacement = '''  if (view === "menu") {
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
  }'''

bcs_code = re.sub(bcs_menu_target, bcs_menu_replacement, bcs_code)
with open('src/components/businesscard/BusinessCardSection.tsx', 'w') as f:
    f.write(bcs_code)

