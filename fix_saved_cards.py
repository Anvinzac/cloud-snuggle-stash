import re

with open('src/components/businesscard/SavedCardsBrowser.tsx', 'r') as f:
    code = f.read()

# 1. Update imports
if 'LayoutGrid' not in code:
    code = code.replace(
        'import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight, Search } from "lucide-react";',
        'import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight, Search, LayoutGrid, List } from "lucide-react";'
    )

# 2. Update state to include viewMode
if 'const [viewMode' not in code:
    code = code.replace(
        'const [searchQuery, setSearchQuery] = useState("");',
        'const [searchQuery, setSearchQuery] = useState("");\n  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");'
    )

# 3. Add toggle button next to Filter
filter_btn = r'''          <Button
            variant={showFilters \? "default" : "outline"}
            size="sm"
            className="h-8"
            onClick=\{\(\) => setShowFilters\(!showFilters\)\}
          >
            <Filter className="h-3.5 w-3.5 mr-1" /> Filter
          </Button>'''

new_filter_btn = '''          <div className="flex gap-2">
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
          </div>'''

code = re.sub(filter_btn, new_filter_btn, code)

# 4. Update rendering to support grid
old_render = r'''        \{sorted\.length === 0 \? \(
          <div className="text-center py-16 text-muted-foreground text-sm">
            No contacts found
          </div>
        \) : \(
          <div className="space-y-0\.5">
            \{sorted\.map\(\(contact\) => \(
              <ContactRow
                key=\{contact\.id\}
                contact=\{contact\}
                onClick=\{\(\) => setSelectedCard\(contact\)\}
              />
            \)\)\}
          </div>
        \)\}'''

new_render = '''        {sorted.length === 0 ? (
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
        )}'''

code = re.sub(old_render, new_render, code)

# 5. Fix FullScreenCard Close -> Back button
code = code.replace(
    '<X className="h-4 w-4 mr-1" /> Close',
    '<ArrowLeft className="h-4 w-4 mr-1" /> Back'
)

with open('src/components/businesscard/SavedCardsBrowser.tsx', 'w') as f:
    f.write(code)

