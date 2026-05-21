import { useState } from "react";
import { CARD_DESIGNS, TEMPLATE_DEFAULT_COLORS } from "@/components/businesscard/types";
import { CardPreview } from "@/components/businesscard/CardPreview";
import { ArrowLeft, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MOCK_DATA = {
  name: "Alexander Hamilton",
  title: "Treasury Secretary",
  company: "US Government",
  phone: "+1 (202) 555-0192",
  email: "alexander.h@treasury.gov",
  address: "1500 Pennsylvania Avenue, NW",
  website: "treasury.gov",
};

const SELECTED_FIELDS = ["name", "title", "company", "phone", "email", "address", "website"];

export default function TemplateSelection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = CARD_DESIGNS.filter(
    (d) => !search || d.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (designId: string) => {
    const color = TEMPLATE_DEFAULT_COLORS[designId] || "#1a1a2e";
    navigate(`/designer?template=${designId}&templateColor=${encodeURIComponent(color)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <button className="h-10 w-10 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-border/30 flex items-center justify-center hover:bg-muted transition-colors shadow-sm">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
              Choose a Template
            </h1>
            <p className="text-sm text-muted-foreground">
              Select a design theme to start creating your card
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
          />
        </div>

        {/* Template Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No templates found</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((design) => {
              const templateColor = TEMPLATE_DEFAULT_COLORS[design.id] || "#1a1a2e";
              return (
                <button
                  key={design.id}
                  onClick={() => handleSelect(design.id)}
                  className="group relative text-left"
                >
                  <div className="w-full aspect-[300/533] rounded-2xl overflow-hidden shadow-lg border border-border/20 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                    <CardPreview
                      data={MOCK_DATA}
                      design={design.id}
                      color={templateColor}
                      selectedFields={SELECTED_FIELDS}
                      compact
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-white/90 dark:bg-gray-700/90 rounded-xl text-sm font-semibold shadow-lg text-foreground">
                        Use Template
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-xs font-semibold text-foreground text-center truncate px-1">
                    {design.label}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {CARD_DESIGNS.length} templates
          </p>
        </div>
      </div>
    </div>
  );
}
