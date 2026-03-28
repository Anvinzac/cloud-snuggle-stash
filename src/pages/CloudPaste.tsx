import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/components/ui/sonner";
import {
  Eye, EyeOff, Check, Copy, QrCode, Plus, Trash2, Save,
  ArrowLeft, Clipboard, Shield, Zap, Globe, X, ChevronDown, ChevronRight, Pencil, CreditCard
} from "lucide-react";
import { BusinessCardSection } from "@/components/businesscard/BusinessCardSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PasteField {
  id: string;
  user_id: string;
  field_name: string;
  field_type: string;
  field_value: string;
  display_order: number;
}

const BASIC_FIELDS = [
  { field_name: "Full Name", field_type: "text", placeholder: "e.g. Nguyen Van A" },
  { field_name: "Address", field_type: "text", placeholder: "e.g. 123 Nguyen Hue, Q1, HCM" },
  { field_name: "Email", field_type: "email", placeholder: "e.g. name@email.com" },
  { field_name: "Phone", field_type: "tel", placeholder: "e.g. 0912 345 678" },
];

const ID_FIELDS = [
  { field_name: "ID Card Number", field_type: "text", placeholder: "e.g. 079123456789" },
  { field_name: "Social Security Number", field_type: "text", placeholder: "e.g. 1234567890" },
  { field_name: "Tax ID", field_type: "text", placeholder: "e.g. 0123456789" },
];

const COMPANY_FIELDS = [
  { field_name: "Company Name", field_type: "text", placeholder: "e.g. Công ty TNHH ABC" },
  { field_name: "Company English Name", field_type: "text", placeholder: "e.g. ABC Company Ltd." },
  { field_name: "Company Address", field_type: "text", placeholder: "e.g. 123 Nguyen Hue, Q1, HCM" },
  { field_name: "Tax Code", field_type: "text", placeholder: "e.g. 0312345678" },
];

const SOCIAL_FIELDS = [
  { field_name: "Facebook", field_type: "url", domain: "facebook.com/", placeholder: "your.username" },
  { field_name: "Instagram", field_type: "url", domain: "instagram.com/", placeholder: "your.username" },
  { field_name: "TikTok", field_type: "url", domain: "tiktok.com/@", placeholder: "your.username" },
];

const DOB_FIELD = { field_name: "Date of Birth", field_type: "date" };

const CUSTOM_TYPES = [
  { type: "text", label: "Text", icon: "Aa" },
  { type: "tel", label: "Phone", icon: "📞" },
  { type: "email", label: "Email", icon: "✉️" },
  { type: "url", label: "URL", icon: "🔗" },
  { type: "number", label: "Number", icon: "#" },
  { type: "date", label: "Date", icon: "📅" },
];

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let code = "";
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) code += chars[array[i] % chars.length];
  return code;
}

const socialDomains: Record<string, string> = {
  Facebook: "https://facebook.com/",
  Instagram: "https://instagram.com/",
  TikTok: "https://tiktok.com/@",
};

function extractUsername(fieldName: string, fullValue: string): string {
  const domain = socialDomains[fieldName];
  if (!domain || !fullValue) return fullValue;
  if (fullValue.startsWith(domain)) return fullValue.slice(domain.length);
  const httpDomain = domain.replace("https://", "http://");
  if (fullValue.startsWith(httpDomain)) return fullValue.slice(httpDomain.length);
  const wwwDomain = domain.replace("https://", "https://www.");
  if (fullValue.startsWith(wwwDomain)) return fullValue.slice(wwwDomain.length);
  return fullValue;
}

function buildFullUrl(fieldName: string, username: string): string {
  const domain = socialDomains[fieldName];
  if (!domain || !username) return username;
  if (username.startsWith("http")) return username;
  return domain + username;
}

function parseDob(value: string): { day: string; month: string; year: string } {
  if (!value) return { day: "", month: "", year: "" };
  const parts = value.split("-");
  if (parts.length === 3) return { year: parts[0], month: parts[1], day: parts[2] };
  return { day: "", month: "", year: "" };
}

function buildDob(day: string, month: string, year: string): string {
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => (currentYear - i).toString());
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

function validateField(type: string, value: string): string | null {
  if (!value.trim()) return null;
  switch (type) {
    case "email": return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Invalid email";
    case "tel": return /^[\d\s\-+().]{7,20}$/.test(value) ? null : "Invalid phone number";
    case "url": return /^https?:\/\/.+|^[\w.-]+\.[a-z]{2,}/i.test(value) ? null : "Invalid URL";
    case "number": return /^-?\d+(\.\d+)?$/.test(value) ? null : "Must be a number";
    default: return null;
  }
}

// ─── Receiver View ───
const ReceiverView = ({ code }: { code: string }) => {
  const [fields, setFields] = useState<{ name: string; value: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const fetchShare = async () => {
      try {
        const res = await supabase.functions.invoke("paste-retrieve", { body: { code } });
        if (res.error || res.data?.error) {
          setError(res.data?.error || "Failed to load shared data");
        } else {
          setFields(res.data.fields);
        }
      } catch {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchShare();
  }, [code]);

  const handleCopy = async (value: string, name: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex items-center justify-center">
        <div className="animate-pulse text-lg text-muted-foreground">Loading shared data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <X className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{error}</h2>
          <p className="text-muted-foreground text-sm">This link may have already been used or expired.</p>
          <Link to="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Go to CloudPaste
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
      <div className="max-w-lg mx-auto pt-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
            <Clipboard className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Shared Information</h1>
          <p className="text-xs text-muted-foreground">⚠️ This is a one-time view. Save what you need now.</p>
        </div>
        <div className="space-y-2">
          {fields?.map((f) => (
            <div key={f.name} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/90 backdrop-blur-sm p-3 shadow-sm">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-muted-foreground">{f.name}</div>
                <div className="text-sm font-semibold text-foreground truncate">{f.value}</div>
              </div>
              <button onClick={() => handleCopy(f.value, f.name)} className="shrink-0 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                {copied === f.name ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-primary" />}
              </button>
            </div>
          ))}
        </div>
        <div className="text-center pt-4">
          <Link to="/">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Get CloudPaste</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Main CloudPaste Page ───
const CloudPaste = () => {
  const [searchParams] = useSearchParams();
  const pasteCode = searchParams.get("id");
  if (pasteCode) return <ReceiverView code={pasteCode} />;
  return <CloudPasteApp />;
};

const DEV_TEST_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "test@example.com",
  user_metadata: { full_name: "Test User" },
};

const isTestUser = (user: any) => user.id === DEV_TEST_USER.id;

const TEST_FIELDS: PasteField[] = [
  { id: "t1", user_id: DEV_TEST_USER.id, field_name: "Full Name", field_type: "text", field_value: "Nguyen Van A", display_order: 0 },
  { id: "t2", user_id: DEV_TEST_USER.id, field_name: "Address", field_type: "text", field_value: "123 Nguyen Hue, Q1, HCM", display_order: 1 },
  { id: "t3", user_id: DEV_TEST_USER.id, field_name: "Email", field_type: "email", field_value: "vana@gmail.com", display_order: 2 },
  { id: "t4", user_id: DEV_TEST_USER.id, field_name: "Phone", field_type: "tel", field_value: "0912 345 678", display_order: 3 },
  { id: "t5", user_id: DEV_TEST_USER.id, field_name: "Facebook", field_type: "url", field_value: "https://facebook.com/vana123", display_order: 4 },
  { id: "t6", user_id: DEV_TEST_USER.id, field_name: "Instagram", field_type: "url", field_value: "https://instagram.com/vana.ig", display_order: 5 },
];

const CloudPasteApp = () => {
  const { user, loading: authLoading } = useAuth();
  const activeUser = user || DEV_TEST_USER;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <AuthenticatedView user={activeUser} />;
};

// ─── Guest / Landing View ───
const GuestView = () => {
  const signIn = async (provider: "google" | "facebook") => {
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin + "/" } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
      <div className="max-w-lg mx-auto pt-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-xl">
            <Clipboard className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">CloudPaste</h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">Share your info securely with a one-time QR code.</p>
        </div>
        <div className="grid gap-3">
          {[
            { icon: Shield, title: "Secure Storage", desc: "Your data is encrypted and stored safely" },
            { icon: QrCode, title: "QR Code Sharing", desc: "Generate a one-time QR — receiver scans and it's done" },
            { icon: Zap, title: "One-Time Use", desc: "Each QR code expires after a single scan" },
            { icon: Globe, title: "Works Everywhere", desc: "Share across any device, no app install needed" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-3">
              <div className="shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-center text-xs text-muted-foreground font-medium">Sign in to get started</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => signIn("google")} className="flex h-12 flex-1 max-w-[180px] items-center justify-center gap-2 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-border/50 transition-all hover:shadow-lg active:scale-95">
              <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span className="text-sm font-medium text-foreground">Google</span>
            </button>
            <button onClick={() => signIn("facebook")} className="flex h-12 flex-1 max-w-[180px] items-center justify-center gap-2 rounded-xl bg-[#1877F2] shadow-md transition-all hover:bg-[#166FE5] hover:shadow-lg active:scale-95">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span className="text-sm font-medium text-white">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Collapsible Section ───
const CollapsibleSection = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-2 border-t border-border/30 pt-3">{children}</div>}
    </div>
  );
};

// ─── Single Field Row ───
const FieldRow = ({
  fieldName, fieldType, value, onChange, onRemove, placeholder, domain, savedIndicator
}: {
  fieldName: string; fieldType: string; value: string; onChange: (v: string) => void;
  onRemove?: () => void; placeholder?: string; domain?: string; savedIndicator: boolean;
}) => {
  const [localVal, setLocalVal] = useState(domain ? extractUsername(fieldName, value) : value);
  const [touched, setTouched] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const error = touched ? validateField(fieldType, domain ? buildFullUrl(fieldName, localVal) : localVal) : null;

  useEffect(() => {
    setLocalVal(domain ? extractUsername(fieldName, value) : value);
  }, [value, domain, fieldName]);

  const handleBlur = () => {
    setTouched(true);
    const finalValue = domain ? buildFullUrl(fieldName, localVal) : localVal;
    if (finalValue !== value) {
      onChange(finalValue);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  const handleChange = (v: string) => {
    setLocalVal(v);
    setTouched(true);
  };

  const handleClear = () => {
    setLocalVal("");
    setTouched(false);
    onChange(domain ? "" : "");
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <Label className="text-xs text-muted-foreground">{fieldName}</Label>
          <div className="flex items-center relative">
            {domain && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1.5 rounded-l-md border border-r-0 border-input whitespace-nowrap">
                {domain}
              </span>
            )}
            <div className="relative flex-1">
              <Input
                type={fieldType === "tel" ? "tel" : fieldType === "email" ? "email" : fieldType === "number" ? "number" : "text"}
                value={localVal}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                placeholder={placeholder || `Enter ${fieldName.toLowerCase()}`}
                className={`h-8 text-sm pr-8 ${domain ? "rounded-l-none" : ""} ${error ? "border-destructive" : ""}`}
              />
              {localVal.trim() && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 pt-4">
          {(justSaved || savedIndicator) && localVal.trim() && !error && (
            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-green-500 animate-in fade-in duration-300">
              <Check className="h-3.5 w-3.5" />
            </div>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="shrink-0 h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-[11px] text-destructive pl-1">{error}</p>}
    </div>
  );
};

// ─── DOB Picker Row ───
const DobRow = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const parsed = parseDob(value);
  const [day, setDay] = useState(parsed.day);
  const [month, setMonth] = useState(parsed.month);
  const [year, setYear] = useState(parsed.year);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const p = parseDob(value);
    setDay(p.day); setMonth(p.month); setYear(p.year);
  }, [value]);

  const handleChange = (d: string, m: string, y: string) => {
    setDay(d); setMonth(m); setYear(y);
    const built = buildDob(d, m, y);
    if (built && built !== value) {
      onChange(built);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  const selectClass = "h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground";

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Date of Birth</Label>
          <div className="flex gap-2 mt-1">
            <select value={day} onChange={(e) => handleChange(e.target.value, month, year)} className={`${selectClass} w-[70px]`}>
              <option value="">Day</option>
              {days.map((d) => <option key={d} value={d.padStart(2, "0")}>{d}</option>)}
            </select>
            <select value={month} onChange={(e) => handleChange(day, e.target.value, year)} className={`${selectClass} w-[80px]`}>
              <option value="">Month</option>
              {months.map((m) => <option key={m} value={m.padStart(2, "0")}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => handleChange(day, month, e.target.value)} className={`${selectClass} w-[90px]`}>
              <option value="">Year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        {justSaved && value && (
          <div className="pt-4 h-7 w-7 rounded-lg flex items-center justify-center text-green-500 animate-in fade-in duration-300">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Custom Field Creator ───
const CustomFieldCreator = ({ onAdd }: { onAdd: (name: string, type: string) => void }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");

  const handleAdd = () => {
    if (!customName.trim() || !selectedType) return;
    onAdd(customName.trim(), selectedType);
    setCustomName("");
    setSelectedType(null);
  };

  return (
    <div className="space-y-3">
      {!selectedType ? (
        <div className="grid grid-cols-3 gap-2">
          {CUSTOM_TYPES.map((t) => (
            <button
              key={t.type}
              onClick={() => setSelectedType(t.type)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border/50 bg-card/80 hover:bg-muted/50 hover:border-primary/30 transition-all"
            >
              <span className="text-lg">{t.icon}</span>
              <span className="text-xs font-medium text-muted-foreground">{t.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-end gap-2 p-3 rounded-xl border border-primary/20 bg-primary/5 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">
              Field name ({CUSTOM_TYPES.find((t) => t.type === selectedType)?.label})
            </Label>
            <Input
              autoFocus
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Zalo Number"
              className="h-8 text-sm"
            />
          </div>
          <Button size="sm" variant="outline" onClick={handleAdd} className="h-8" disabled={!customName.trim()}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setSelectedType(null); setCustomName(""); }} className="h-8">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

// ─── Authenticated View ───
const AuthenticatedView = ({ user }: { user: any }) => {
  const [fields, setFields] = useState<PasteField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [qrData, setQrData] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [businessCardMode, setBusinessCardMode] = useState(false);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<{ field_name: string; field_type: string }[]>([]);
  const [savedFields, setSavedFields] = useState<Set<string>>(new Set());

  const testMode = isTestUser(user);

  useEffect(() => { fetchFields(); }, []);

  const fetchFields = async () => {
    if (testMode) {
      setFields(TEST_FIELDS);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("paste_fields")
      .select("*")
      .eq("user_id", user.id)
      .order("display_order");
    if (data) setFields(data as PasteField[]);
    setLoading(false);
  };

  const hasFields = fields.length > 0;

  const initSetup = () => {
    const values: Record<string, string> = {};
    const customs: { field_name: string; field_type: string }[] = [];
    const knownNames = new Set([
      ...BASIC_FIELDS.map((f) => f.field_name),
      ...ID_FIELDS.map((f) => f.field_name),
      ...COMPANY_FIELDS.map((f) => f.field_name),
      ...SOCIAL_FIELDS.map((f) => f.field_name),
      DOB_FIELD.field_name,
    ]);

    fields.forEach((f) => {
      values[f.field_name] = f.field_value;
      if (!knownNames.has(f.field_name)) {
        customs.push({ field_name: f.field_name, field_type: f.field_type });
      }
    });

    setDraftValues(values);
    setCustomFields(customs);
    setSavedFields(new Set());
    setEditMode(true);
  };

  useEffect(() => {
    if (!loading && !hasFields) initSetup();
  }, [loading, hasFields]);

  const updateDraft = async (name: string, value: string) => {
    setDraftValues((prev) => ({ ...prev, [name]: value }));
    setSavedFields((prev) => { const next = new Set(prev); next.add(name); return next; });

    if (!testMode) {
      const allDefs = [
        ...BASIC_FIELDS, ...ID_FIELDS, ...COMPANY_FIELDS, ...SOCIAL_FIELDS,
        { field_name: DOB_FIELD.field_name, field_type: DOB_FIELD.field_type },
        ...customFields,
      ];
      const def = allDefs.find((f) => f.field_name === name);
      const fieldType = def?.field_type || "text";

      if (value.trim()) {
        const { data: existing } = await supabase
          .from("paste_fields")
          .select("id")
          .eq("user_id", user.id)
          .eq("field_name", name)
          .maybeSingle();

        if (existing) {
          await supabase.from("paste_fields").update({ field_value: value }).eq("id", existing.id);
        } else {
          await supabase.from("paste_fields").insert({
            user_id: user.id,
            field_name: name,
            field_type: fieldType,
            field_value: value,
            display_order: 0,
          });
        }
      } else {
        await supabase.from("paste_fields").delete().eq("user_id", user.id).eq("field_name", name);
      }
    }
  };

  const addCustomField = (name: string, type: string) => {
    setCustomFields((prev) => [...prev, { field_name: name, field_type: type }]);
  };

  const removeCustomField = (name: string) => {
    setCustomFields((prev) => prev.filter((f) => f.field_name !== name));
    setDraftValues((prev) => { const next = { ...prev }; delete next[name]; return next; });
  };

  const saveFields = async () => {
    setSaving(true);
    try {
      const allFieldDefs = [
        ...BASIC_FIELDS.map((f) => ({ name: f.field_name, type: f.field_type })),
        { name: DOB_FIELD.field_name, type: DOB_FIELD.field_type },
        ...ID_FIELDS.map((f) => ({ name: f.field_name, type: f.field_type })),
        ...COMPANY_FIELDS.map((f) => ({ name: f.field_name, type: f.field_type })),
        ...SOCIAL_FIELDS.map((f) => ({ name: f.field_name, type: f.field_type })),
        ...customFields.map((f) => ({ name: f.field_name, type: f.field_type })),
      ];

      const newFields = allFieldDefs
        .filter((f) => draftValues[f.name]?.trim())
        .map((f, i) => ({
          id: `local-${i}`,
          user_id: user.id,
          field_name: f.name,
          field_type: f.type,
          field_value: draftValues[f.name],
          display_order: i,
        }));

      if (testMode) {
        setFields(newFields);
        setEditMode(false);
        toast.success("Saved!");
        setSaving(false);
        return;
      }

      await supabase.from("paste_fields").delete().eq("user_id", user.id);
      const inserts = newFields.map(({ id, ...rest }) => rest);
      if (inserts.length) {
        await supabase.from("paste_fields").insert(inserts);
      }
      await fetchFields();
      setEditMode(false);
      toast.success("Saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const generateQR = async () => {
    const selected = fields.filter((f) => selectedIds.has(f.id));
    if (!selected.length) { toast.error("Select at least one field"); return; }
    const code = generateCode();
    const snapshot = selected.map((f) => ({ name: f.field_name, value: f.field_value }));

    if (testMode) {
      setQrData(`${window.location.origin}/?id=${code}`);
      toast.info("Test mode: QR generated (link won't work for retrieval)");
      return;
    }

    const { error } = await supabase.from("paste_shares").insert({ code, user_id: user.id, shared_fields: snapshot });
    if (error) { toast.error("Failed to generate share"); return; }
    setQrData(`${window.location.origin}/?id=${code}`);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const toggleVisibility = (id: string) => {
    setVisibleIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const removeField = async (id: string) => {
    setRemovingIds((prev) => { const next = new Set(prev); next.add(id); return next; });
    setTimeout(async () => {
      const updatedFields = fields.filter((f) => f.id !== id);
      setFields(updatedFields);
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
      setRemovingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });

      if (!testMode) {
        await supabase.from("paste_fields").delete().eq("id", id);
      }

      if (updatedFields.length === 0) {
        setDeleteMode(false);
      }
      toast.success("Field removed");
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading your data...</div>
      </div>
    );
  }

  if (businessCardMode) {
    return (
      <BusinessCardSection
        user={user}
        pasteFields={fields.map((f) => ({ field_name: f.field_name, field_value: f.field_value }))}
        testMode={testMode}
        onBack={() => setBusinessCardMode(false)}
      />
    );
  }

  if (qrData) {
    const sharedFields = fields.filter((f) => selectedIds.has(f.id));
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
        <div className="max-w-lg mx-auto pt-6 space-y-5">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-foreground">Scan to receive</h2>
            <p className="text-xs text-muted-foreground">This QR code is valid for one scan only</p>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-xl inline-block">
              <QRCodeSVG value={qrData} size={220} level="H" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground break-all font-mono text-center">{qrData}</p>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Shared fields:</p>
            {sharedFields.map((f) => (
              <div key={f.id} className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-muted-foreground">{f.field_name}</div>
                  <div className="text-sm font-semibold text-foreground truncate">
                    {visibleIds.has(f.id) ? f.field_value : "•".repeat(Math.min(f.field_value.length, 20))}
                  </div>
                </div>
                <button onClick={() => toggleVisibility(f.id)} className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                  {visibleIds.has(f.id) ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setQrData(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={() => { navigator.clipboard.writeText(qrData); toast.success("Link copied!"); }}>
              <Copy className="h-4 w-4 mr-1" /> Copy Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Setup / Edit Mode ───
  if (editMode) {
    const ALL_STANDARD_FIELDS = [
      ...BASIC_FIELDS.map((f) => ({ ...f, section: "basic" as const })),
      { field_name: DOB_FIELD.field_name, field_type: DOB_FIELD.field_type, section: "dob" as const, placeholder: undefined, domain: undefined },
      ...ID_FIELDS.map((f) => ({ ...f, section: "id" as const })),
      ...COMPANY_FIELDS.map((f) => ({ ...f, section: "company" as const })),
      ...SOCIAL_FIELDS.map((f) => ({ ...f, section: "social" as const })),
    ];

    const filledStandard = ALL_STANDARD_FIELDS.filter((f) => draftValues[f.field_name]?.trim());
    const emptyStandard = ALL_STANDARD_FIELDS.filter((f) => !draftValues[f.field_name]?.trim());
    const filledCustom = customFields.filter((f) => draftValues[f.field_name]?.trim());
    const emptyCustom = customFields.filter((f) => !draftValues[f.field_name]?.trim());

    const renderFieldRow = (f: any) => {
      if (f.field_name === DOB_FIELD.field_name) {
        return (
          <DobRow
            key={f.field_name}
            value={draftValues[f.field_name] || ""}
            onChange={(v) => updateDraft(f.field_name, v)}
          />
        );
      }
      const socialDef = SOCIAL_FIELDS.find((s) => s.field_name === f.field_name);
      return (
        <FieldRow
          key={f.field_name}
          fieldName={f.field_name}
          fieldType={f.field_type}
          value={draftValues[f.field_name] || ""}
          onChange={(v) => updateDraft(f.field_name, v)}
          placeholder={f.placeholder}
          domain={socialDef?.domain}
          onRemove={deleteMode && !BASIC_FIELDS.some((b) => b.field_name === f.field_name) && !ID_FIELDS.some((b) => b.field_name === f.field_name) && f.field_name !== DOB_FIELD.field_name && !SOCIAL_FIELDS.some((b) => b.field_name === f.field_name)
            ? () => removeCustomField(f.field_name)
            : undefined}
          savedIndicator={savedFields.has(f.field_name)}
        />
      );
    };

    const renderDeletableRow = (f: any) => {
      if (f.field_name === DOB_FIELD.field_name) {
        return (
          <div key={f.field_name} className="flex items-center gap-2">
            <div className="flex-1">
              <DobRow
                value={draftValues[f.field_name] || ""}
                onChange={(v) => updateDraft(f.field_name, v)}
              />
            </div>
            {deleteMode && draftValues[f.field_name]?.trim() && (
              <button
                onClick={() => updateDraft(f.field_name, "")}
                className="shrink-0 h-8 w-8 rounded-lg text-destructive hover:bg-destructive/20 flex items-center justify-center transition-colors animate-in fade-in zoom-in-75 duration-200 mt-4"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      }
      const socialDef = SOCIAL_FIELDS.find((s) => s.field_name === f.field_name);
      const isCustom = customFields.some((c) => c.field_name === f.field_name);
      return (
        <FieldRow
          key={f.field_name}
          fieldName={f.field_name}
          fieldType={f.field_type}
          value={draftValues[f.field_name] || ""}
          onChange={(v) => updateDraft(f.field_name, v)}
          placeholder={f.placeholder}
          domain={socialDef?.domain}
          onRemove={deleteMode ? (isCustom ? () => removeCustomField(f.field_name) : () => updateDraft(f.field_name, "")) : undefined}
          savedIndicator={savedFields.has(f.field_name)}
        />
      );
    };

    const hasFilled = filledStandard.length > 0 || filledCustom.length > 0;
    const hasEmpty = emptyStandard.length > 0 || emptyCustom.length > 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 p-4">
        <div className="max-w-lg mx-auto pt-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
                <Clipboard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {hasFields ? "Edit Your Info" : "Set Up CloudPaste"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {deleteMode ? "Tap 🗑️ to clear fields" : "Filled fields appear on top"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {hasFilled && (
                <Button
                  variant={deleteMode ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setDeleteMode(!deleteMode)}
                >
                  {deleteMode ? <Check className="h-4 w-4 mr-1" /> : <Trash2 className="h-4 w-4 mr-1" />}
                  {deleteMode ? "Done" : "Delete"}
                </Button>
              )}
              {hasFields && !deleteMode && (
                <Button variant="ghost" size="sm" onClick={() => { setEditMode(false); setDeleteMode(false); }}>Cancel</Button>
              )}
            </div>
          </div>

          {hasFilled && (
            <div className="space-y-2">
              {filledStandard.map((f) => deleteMode ? renderDeletableRow(f) : renderFieldRow(f))}
              {filledCustom.map((f) => deleteMode ? renderDeletableRow(f) : renderFieldRow(f))}
            </div>
          )}

          {!deleteMode && (
            <Button
              onClick={saveFields}
              disabled={saving}
              className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white shadow-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save & Continue"}
            </Button>
          )}

          {!deleteMode && hasEmpty && (
            <div className="space-y-3">
              {emptyStandard.some((f) => f.section === "basic") && (
                <CollapsibleSection title="📝 Basic Info">
                  {emptyStandard.filter((f) => f.section === "basic").map((f) => renderFieldRow(f))}
                </CollapsibleSection>
              )}
              {emptyStandard.some((f) => f.section === "dob") && (
                <CollapsibleSection title="📅 Date of Birth">
                  {emptyStandard.filter((f) => f.section === "dob").map((f) => renderFieldRow(f))}
                </CollapsibleSection>
              )}
              {emptyStandard.some((f) => f.section === "id") && (
                <CollapsibleSection title="🪪 Identity Documents">
                  {emptyStandard.filter((f) => f.section === "id").map((f) => renderFieldRow(f))}
                </CollapsibleSection>
              )}
              {emptyStandard.some((f) => f.section === "company") && (
                <CollapsibleSection title="🏢 Company">
                  {emptyStandard.filter((f) => f.section === "company").map((f) => renderFieldRow(f))}
                </CollapsibleSection>
              )}
              {emptyStandard.some((f) => f.section === "social") && (
                <CollapsibleSection title="📱 Social Media">
                  {emptyStandard.filter((f) => f.section === "social").map((f) => renderFieldRow(f))}
                </CollapsibleSection>
              )}

              <CollapsibleSection title="✨ Custom Fields">
                {emptyCustom.map((f) => renderFieldRow(f))}
                <CustomFieldCreator onAdd={addCustomField} />
              </CollapsibleSection>
            </div>
          )}

          {!deleteMode && !hasEmpty && (
            <CollapsibleSection title="✨ Custom Fields">
              <CustomFieldCreator onAdd={addCustomField} />
            </CollapsibleSection>
          )}

          {!deleteMode && (
            <div className="text-center">
              {hasFields ? (
                <Button variant="ghost" size="sm" onClick={() => setEditMode(false)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              ) : (
                <Link to="/"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Button></Link>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Main: Select & Share Mode ───
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 pb-28 pt-8 px-4 selection:bg-purple-200 dark:selection:bg-purple-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl ring-4 ring-white/50 dark:ring-white/10">
              <Clipboard className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">CloudPaste</h1>
              <p className="text-sm text-muted-foreground font-medium">Select fields to build your shareable QR</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" className="h-10 rounded-xl border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30" onClick={() => setBusinessCardMode(true)}>
              <CreditCard className="h-4 w-4 mr-2 text-indigo-500" /> Card Design
            </Button>
            <Button variant="ghost" className="h-10 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30" onClick={initSetup}>
              <Pencil className="h-4 w-4 mr-2 text-purple-500" /> Edit Info
            </Button>
          </div>
        </div>

        {/* Bento Box Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(() => {
            const basicNames = new Set(BASIC_FIELDS.map((f) => f.field_name));
            const idNames = new Set(ID_FIELDS.map((f) => f.field_name));
            const companyNames = new Set(COMPANY_FIELDS.map((f) => f.field_name));
            const socialNames = new Set(SOCIAL_FIELDS.map((f) => f.field_name));
            const dobName = DOB_FIELD.field_name;

            const categories: { label: string; emoji: string; desc: string; fieldIds: string[], color: string }[] = [];
            const addCategory = (label: string, emoji: string, desc: string, color: string, nameSet: Set<string>) => {
              const ids = fields.filter((f) => nameSet.has(f.field_name)).map((f) => f.id);
              if (ids.length > 0) categories.push({ label, emoji, desc, color, fieldIds: ids });
            };

            addCategory("Basic Info", "📝", "Core personal details", "from-blue-500/10 to-cyan-500/10 border-blue-200/50 dark:border-blue-500/20 text-blue-600 dark:text-blue-400", basicNames);
            
            const dobIds = fields.filter((f) => f.field_name === dobName).map((f) => f.id);
            if (dobIds.length > 0) categories.push({ label: "Date of Birth", emoji: "📅", desc: "Your birthday", color: "from-amber-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-500/20 text-amber-600 dark:text-amber-400", fieldIds: dobIds });
            
            addCategory("Identity", "🪪", "Official documents", "from-rose-500/10 to-red-500/10 border-rose-200/50 dark:border-rose-500/20 text-rose-600 dark:text-rose-400", idNames);
            addCategory("Company", "🏢", "Work & business", "from-emerald-500/10 to-green-500/10 border-emerald-200/50 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400", companyNames);
            addCategory("Social", "📱", "Online presence", "from-purple-500/10 to-fuchsia-500/10 border-purple-200/50 dark:border-purple-500/20 text-purple-600 dark:text-purple-400", socialNames);
            
            const knownNames = new Set([...basicNames, ...idNames, ...companyNames, ...socialNames, dobName]);
            const customIds = fields.filter((f) => !knownNames.has(f.field_name)).map((f) => f.id);
            if (customIds.length > 0) categories.push({ label: "Custom", emoji: "✨", desc: "Your unique fields", color: "from-pink-500/10 to-rose-500/10 border-pink-200/50 dark:border-pink-500/20 text-pink-600 dark:text-pink-400", fieldIds: customIds });

            const toggleCategory = (fieldIds: string[]) => {
              const allSelected = fieldIds.every((id) => selectedIds.has(id));
              setSelectedIds((prev) => {
                const next = new Set(prev);
                fieldIds.forEach((id) => allSelected ? next.delete(id) : next.add(id));
                return next;
              });
            };

            const renderFieldChip = (field: PasteField) => {
              const isVisible = visibleIds.has(field.id);
              const isSelected = selectedIds.has(field.id);
              return (
                <div
                  key={field.id}
                  onClick={() => toggleSelection(field.id)}
                  className={`relative group flex flex-col justify-center px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 ease-out select-none overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02] ring-1 ring-white/20 active:scale-95"
                      : "bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 border-border/50 border hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm active:scale-95"
                  }`}
                >
                  {/* Subtle inner glow for selected state */}
                  {isSelected && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  
                  <div className="flex items-center justify-between gap-3 relative z-10">
                    <div className="min-w-0 flex-1">
                      <div className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${isSelected ? "text-indigo-100" : "text-muted-foreground"}`}>
                        {field.field_name}
                      </div>
                      <div className={`text-sm font-semibold truncate ${isSelected ? "text-white" : "text-foreground"}`}>
                        {isVisible ? field.field_value : "•".repeat(Math.min(field.field_value.length, 12))}
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleVisibility(field.id); }} 
                      className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                        isSelected 
                          ? "bg-white/20 hover:bg-white/30 text-white" 
                          : "bg-muted/50 hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-white animate-pulse" />
                  )}
                </div>
              );
            };

            return categories.map((cat, idx) => {
              const allSelected = cat.fieldIds.every((id) => selectedIds.has(id));
              const someSelected = cat.fieldIds.some((id) => selectedIds.has(id));
              
              // Give some bento boxes a span to make the grid masonry-like
              const isLarge = cat.fieldIds.length > 3;
              const colSpanClass = isLarge ? "md:col-span-2 lg:col-span-2" : "col-span-1";

              return (
                <div 
                  key={cat.label} 
                  className={`bg-card/40 dark:bg-card/20 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-3xl p-5 shadow-sm transition-all hover:shadow-md ${colSpanClass} relative overflow-hidden flex flex-col`}
                >
                  {/* Decorative background gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none`} />

                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex gap-3">
                      <div className="text-2xl pt-1">{cat.emoji}</div>
                      <div>
                        <h2 className="text-base font-bold text-foreground">{cat.label}</h2>
                        <p className="text-xs text-muted-foreground">{cat.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCategory(cat.fieldIds)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                        allSelected 
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" 
                          : "bg-muted text-muted-foreground hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20"
                      }`}
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 flex-1 content-start">
                    {cat.fieldIds.map((id) => renderFieldChip(fields.find((f) => f.id === id)!))}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Floating Action Bar (FAB) */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none flex justify-center">
        <div className="pointer-events-auto w-full max-w-lg bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-full p-2.5 shadow-2xl flex items-center justify-between gap-3 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 relative">
          
          {/* Animated background glow if items selected */}
          {selectedIds.size > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse pointer-events-none" />
          )}

          <div className="flex items-center gap-3 pl-3 relative z-10">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Button>
            </Link>
            
            <div className="flex flex-col justify-center h-10">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sharing</span>
              <span className={`text-sm font-bold ${selectedIds.size > 0 ? "text-indigo-600 dark:text-indigo-400" : "text-foreground"}`}>
                {selectedIds.size} Field{selectedIds.size !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          
          <Button
            onClick={generateQR}
            disabled={selectedIds.size === 0}
            className={`h-12 px-6 rounded-full font-bold shadow-lg transition-all duration-300 relative z-10 ${
              selectedIds.size > 0
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white scale-100 ring-2 ring-indigo-500/30 hover:ring-indigo-500/50"
                : "bg-muted text-muted-foreground scale-95 opacity-80"
            }`}
          >
            <QrCode className="h-5 w-5 mr-2" />
            Generate QR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CloudPaste;