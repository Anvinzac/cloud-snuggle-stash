import { useState } from "react";
import { SavedContact, CONTACT_CATEGORIES, STATUS_OPTIONS, MOCK_CONTACTS } from "./types";
import { CardPreview } from "./CardPreview";
import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight, Search, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SavedCardsBrowserProps {
  contacts: SavedContact[];
  onBack: () => void;
  testMode?: boolean;
  isEmbedded?: boolean;
}

const ContactRow = ({
  contact,
  onClick,
}: {
  contact: SavedContact;
  onClick: () => void;
}) => {
  const d = contact.contact_data;
  const st = STATUS_OPTIONS.find((s) => s.value === contact.status);
  const initials = (d.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
        hover:bg-muted/40 active:scale-[0.98] text-left"
    >
      <div
        className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md"
        style={{ background: contact.card_color }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground truncate">{d.name || "Unnamed"}</span>
          {st && st.value !== "Normal" && (
            <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold ${st.color}`}>
              {st.value}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
          {d.title && <span className="truncate">{d.title}</span>}
          {d.title && d.company && <span className="opacity-40">·</span>}
          {d.company && <span className="truncate opacity-70">{d.company}</span>}
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-0.5">
        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/80 text-muted-foreground">
          {contact.category}
        </span>
        {contact.career_tag && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400">
            {contact.career_tag}
          </span>
        )}
      </div>
    </button>
  );
};

const FullScreenCard = ({
  contact,
  sorted,
  onClose,
  onNavigate,
}: {
  contact: SavedContact;
  sorted: SavedContact[];
  onClose: () => void;
  onNavigate: (c: SavedContact) => void;
}) => {
  const idx = sorted.findIndex((c) => c.id === contact.id);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full w-full">
        <CardPreview
          data={contact.contact_data}
          design={contact.card_design}
          color={contact.card_color}
          selectedFields={Object.keys(contact.contact_data).filter((k) => contact.contact_data[k]?.trim())}
        />
        <div className="absolute bottom-20 left-4 right-4 flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 text-white backdrop-blur-sm">
            {contact.category}
          </span>
          {contact.career_tag && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/30 text-white backdrop-blur-sm">
              {contact.career_tag}
            </span>
          )}
          {contact.career_sub_tag && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-400/20 text-white backdrop-blur-sm">
              {contact.career_sub_tag}
            </span>
          )}
          {contact.custom_tag && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/30 text-white backdrop-blur-sm">
              {contact.custom_tag}
            </span>
          )}
          {(() => {
            const st = STATUS_OPTIONS.find((s) => s.value === contact.status);
            return st ? (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${st.color}`}>
                {st.value}
              </span>
            ) : null;
          })()}
        </div>
        <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex gap-2">
            {prev && (
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8" onClick={() => onNavigate(prev)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            {next && (
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8" onClick={() => onNavigate(next)}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SavedCardsBrowser = ({ contacts: propContacts, onBack, testMode, isEmbedded }: SavedCardsBrowserProps) => {
  const contacts = testMode ? (MOCK_CONTACTS as SavedContact[]) : propContacts;

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [filterCareer, setFilterCareer] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "date" | "status">("date");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SavedContact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

  const processedContacts = contacts.map((c) => {
    if (c.status === "Normal" && new Date(c.updated_at) < threeMonthsAgo) {
      return { ...c, status: "Expired" };
    }
    return c;
  });

  const categories = ["All", ...CONTACT_CATEGORIES];

  const filtered = processedContacts
    .filter((c) => activeCategory === "All" || c.category === activeCategory)
    .filter((c) => !filterCareer || c.career_tag === filterCareer)
    .filter((c) => !filterStatus || c.status === filterStatus)
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const d = c.contact_data;
      return (
        d.name?.toLowerCase().includes(q) ||
        d.company?.toLowerCase().includes(q) ||
        d.title?.toLowerCase().includes(q) ||
        c.custom_tag?.toLowerCase().includes(q)
      );
    });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return (a.contact_data.name || "").localeCompare(b.contact_data.name || "");
    if (sortBy === "date") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    const statusOrder = ["Important", "C-level", "Officials", "Normal", "Expired"];
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });

  if (selectedCard) {
    return (
      <FullScreenCard
        contact={selectedCard}
        sorted={sorted}
        onClose={() => setSelectedCard(null)}
        onNavigate={setSelectedCard}
      />
    );
  }

  const usedCareers = [...new Set(processedContacts.map((c) => c.career_tag).filter(Boolean))];

  return (
    <div className={isEmbedded ? "" : "min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950"}>
      <div className={`max-w-lg mx-auto px-4 ${isEmbedded ? "pt-2 pb-4" : "pt-6 pb-8"} space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isEmbedded && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-lg font-bold text-foreground">Saved Cards</h2>
            <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full font-medium">
              {sorted.length}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode(v => v === "list" ? "grid" : "list")}
            >
              {viewMode === "list" ? <LayoutGrid className="h-4 w-4 text-muted-foreground" /> : <List className="h-4 w-4 text-muted-foreground" />}
            </Button>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              className="h-8"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3.5 w-3.5 mr-1" /> Filter
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, company, title..."
            className="pl-9 h-9 text-sm rounded-xl bg-muted/40 border-transparent focus:border-primary/30"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                activeCategory === c
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="space-y-3 p-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Career</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterCareer(null)}
                  className={`px-2 py-1 rounded-full text-[11px] font-medium ${!filterCareer ? "bg-violet-500 text-white" : "bg-muted/60 text-muted-foreground"}`}
                >
                  All
                </button>
                {usedCareers.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterCareer(filterCareer === c ? null : c!)}
                    className={`px-2 py-1 rounded-full text-[11px] font-medium ${filterCareer === c ? "bg-violet-500 text-white" : "bg-muted/60 text-muted-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Status</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterStatus(null)}
                  className={`px-2 py-1 rounded-full text-[11px] font-medium ${!filterStatus ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"}`}
                >
                  All
                </button>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setFilterStatus(filterStatus === s.value ? null : s.value)}
                    className={`px-2 py-1 rounded-full text-[11px] font-medium ${filterStatus === s.value ? s.color + " ring-1 ring-primary/30" : "bg-muted/60 text-muted-foreground"}`}
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Sort by</p>
              <div className="flex gap-1.5">
                {([["date", "Newest"], ["name", "A→Z"], ["status", "Priority"]] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setSortBy(val)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${sortBy === val ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No contacts found
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-0.5">
            {sorted.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onClick={() => setSelectedCard(contact)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-8">
            {sorted.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedCard(contact)}
                className="w-full text-left transition-transform active:scale-95 group"
              >
                <div className="pointer-events-none rounded-2xl overflow-hidden shadow-lg border border-border/10 ring-1 ring-black/5 group-hover:shadow-xl transition-shadow w-full aspect-[9/16] relative bg-muted">
                  <div className="absolute inset-0 scale-[1] origin-top">
                    <CardPreview
                      data={contact.contact_data}
                      design={contact.card_design}
                      color={contact.card_color}
                      selectedFields={Object.keys(contact.contact_data).filter((k) => contact.contact_data[k]?.trim())}
                      compact
                    />
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <p className="text-xs font-semibold text-foreground truncate">{contact.contact_data.name || "Unnamed"}</p>
                  <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">{contact.contact_data.title || "No title"}</p>
                  {contact.contact_data.company && <p className="text-[10px] text-muted-foreground/70 truncate">{contact.contact_data.company}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};