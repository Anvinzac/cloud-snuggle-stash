import { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, RotateCcw, Save, FolderOpen, Type, Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { CanvasElement, SavedCardDesign, ContactData } from '@/components/businesscard/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface TextField {
  id: string;
  label: string;
  placeholder: string;
}

interface Frame {
  id: string;
  label: string;
  style: React.CSSProperties;
}

const DEV_TEST_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'test@example.com',
  user_metadata: { full_name: 'Test User' },
};

const TEXT_FIELDS: TextField[] = [
  { id: 'name', label: 'Name', placeholder: 'Nguyen Van A' },
  { id: 'position', label: 'Position', placeholder: 'Senior Manager' },
  { id: 'company', label: 'Company', placeholder: 'VinGroup Corp' },
  { id: 'phone', label: 'Phone', placeholder: '+84 912 345 678' },
  { id: 'email', label: 'Email', placeholder: 'nguyen@company.vn' },
  { id: 'address', label: 'Address', placeholder: '123 Nguyen Hue, Q1, HCM' },
  { id: 'website', label: 'Website', placeholder: 'company.vn' },
  { id: 'quote', label: 'Favorite Quote', placeholder: 'Your inspiring quote' },
  { id: 'social', label: 'Social Media', placeholder: '@username' }
];

const FRAMES: Frame[] = [
  { id: 'none', label: 'None', style: {} },
  { id: 'rect1', label: 'Rectangle', style: { top: '20px', left: '20px', width: '260px', height: '180px', borderRadius: '0' } },
  { id: 'rect2', label: 'Wide Rect', style: { top: '40px', left: '20px', width: '260px', height: '120px', borderRadius: '0' } },
  { id: 'circle1', label: 'Circle', style: { top: '30px', left: '90px', width: '120px', height: '120px', borderRadius: '50%' } },
  { id: 'rounded1', label: 'Rounded', style: { top: '20px', left: '20px', width: '260px', height: '180px', borderRadius: '16px' } },
  { id: 'split1', label: 'Split Top', style: { top: '0', left: '0', width: '300px', height: '200px', borderRadius: '0', borderBottom: '3px solid rgba(0,0,0,0.3)' } },
  { id: 'split2', label: 'Split Side', style: { top: '0', left: '0', width: '100px', height: '533px', borderRadius: '0', borderRight: '3px solid rgba(0,0,0,0.3)' } },
  { id: 'corner1', label: 'Corner', style: { top: '20px', right: '20px', width: '140px', height: '140px', borderRadius: '8px' } },
  { id: 'bottom1', label: 'Bottom', style: { bottom: '20px', left: '20px', width: '260px', height: '100px', borderRadius: '8px' } }
];

interface SidebarContentProps {
  designName: string;
  setDesignName: (v: string) => void;
  bgType: 'gradient' | 'image' | 'solid';
  setBgType: (v: 'gradient' | 'image' | 'solid') => void;
  gradientColor1: string;
  setGradientColor1: (v: string) => void;
  gradientColor2: string;
  setGradientColor2: (v: string) => void;
  gradientAngle: number;
  setGradientAngle: (v: number) => void;
  solidColor: string;
  setSolidColor: (v: string) => void;
  bgImage: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentFrame: string;
  setCurrentFrame: (v: string) => void;
  selectedElement: CanvasElement | null;
  updateSelectedElement: (updates: Partial<CanvasElement>) => void;
  deleteSelected: () => void;
}

function SidebarContent({
  designName, setDesignName, bgType, setBgType,
  gradientColor1, setGradientColor1, gradientColor2, setGradientColor2,
  gradientAngle, setGradientAngle, solidColor, setSolidColor,
  bgImage, handleImageUpload, currentFrame, setCurrentFrame,
  selectedElement, updateSelectedElement, deleteSelected,
}: SidebarContentProps) {
  return (
    <>
      <div className="mb-6">
        <label className="text-xs text-gray-400 mb-1 block">Design Name</label>
        <input
          type="text"
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
          placeholder="Untitled Design"
        />
      </div>

      <hr className="border-gray-800 my-6" />

      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Background</h3>

      <div className="space-y-2 mb-6">
        <Button variant={bgType === 'gradient' ? 'default' : 'outline'} size="sm" className="w-full" onClick={() => setBgType('gradient')}>Gradient</Button>
        <Button variant={bgType === 'image' ? 'default' : 'outline'} size="sm" className="w-full" onClick={() => setBgType('image')}>Image</Button>
        <Button variant={bgType === 'solid' ? 'default' : 'outline'} size="sm" className="w-full" onClick={() => setBgType('solid')}>Solid Color</Button>
      </div>

      {bgType === 'gradient' && (
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[9px] text-gray-500 mb-1 block">Color 1</label>
              <input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} className="w-full h-10 rounded border border-gray-700 cursor-pointer" />
            </div>
            <div className="flex-1">
              <label className="text-[9px] text-gray-500 mb-1 block">Color 2</label>
              <input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} className="w-full h-10 rounded border border-gray-700 cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Angle: {gradientAngle}°</label>
            <input type="range" min="0" max="360" value={gradientAngle} onChange={(e) => setGradientAngle(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      )}

      {bgType === 'image' && (
        <div className="mb-6">
          <div onClick={() => document.getElementById('bgImageInput')?.click()} className="border-2 border-dashed border-gray-700 rounded-lg p-5 text-center cursor-pointer hover:border-gray-600 hover:bg-gray-800/50 transition-all">
            <input id="bgImageInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="text-xs text-gray-500">Click to upload image</div>
          </div>
        </div>
      )}

      {bgType === 'solid' && (
        <div className="mb-6">
          <input type="color" value={solidColor} onChange={(e) => setSolidColor(e.target.value)} className="w-full h-10 rounded border border-gray-700 cursor-pointer" />
        </div>
      )}

      <hr className="border-gray-800 my-6" />

      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Frames</h3>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {FRAMES.map(frame => (
          <div key={frame.id} onClick={() => setCurrentFrame(frame.id)} className={`aspect-square border-2 rounded cursor-pointer transition-all relative ${currentFrame === frame.id ? 'border-cyan-400 bg-cyan-400/10' : 'border-gray-700 hover:border-gray-600'}`}>
            <div className="absolute inset-2 border-2 border-gray-600 rounded-sm" />
          </div>
        ))}
      </div>

      {selectedElement && (
        <>
          <hr className="border-gray-800 my-6" />
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Selected Element</h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Font Family</label>
              <select value={selectedElement.fontFamily} onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm">
                <option value="Inter">Inter</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Font Size</label>
              <input type="number" min="8" max="72" value={selectedElement.fontSize} onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm" />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Font Weight</label>
              <select value={selectedElement.fontWeight} onChange={(e) => updateSelectedElement({ fontWeight: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm">
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Text Color</label>
              <input type="color" value={selectedElement.color} onChange={(e) => updateSelectedElement({ color: e.target.value })} className="w-full h-10 rounded border border-gray-700 cursor-pointer" />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Text Content</label>
              <input type="text" value={selectedElement.text} onChange={(e) => updateSelectedElement({ text: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm" />
            </div>

            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-[10px] text-cyan-300">
              Scroll mouse wheel or pinch with 2 fingers to adjust font size
            </div>

            <Button variant="destructive" size="sm" className="w-full mt-3" onClick={deleteSelected}>Delete Element</Button>
          </div>
        </>
      )}
    </>
  );
}

export default function CardDesigner() {
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('id');

  const [bgType, setBgType] = useState<'gradient' | 'image' | 'solid'>('gradient');
  const [gradientColor1, setGradientColor1] = useState('#667eea');
  const [gradientColor2, setGradientColor2] = useState('#764ba2');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [currentFrame, setCurrentFrame] = useState('none');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [draggedField, setDraggedField] = useState<TextField | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDragId, setTouchDragId] = useState<number | null>(null);
  const [designName, setDesignName] = useState('Untitled Design');
  const [saving, setSaving] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedCardDesign[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [loadingDesign, setLoadingDesign] = useState(false);
  const [cardData, setCardData] = useState<ContactData>({});
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'title', 'company', 'phone', 'email']);
  const pinchStartDistance = useRef<number>(0);
  const pinchStartFontSize = useRef<number>(16);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState<'fields' | 'bg' | 'props'>('fields');

  const isTestUser = true;
  const userId = DEV_TEST_USER.id;

  useEffect(() => {
    loadSavedDesigns();
    if (designId) loadDesign(designId);
  }, []);

  const loadSavedDesigns = async () => {
    if (isTestUser) {
      const stored = localStorage.getItem('test_card_designs');
      if (stored) setSavedDesigns(JSON.parse(stored));
      return;
    }
    const { data } = await supabase
      .from('card_designs')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (data) setSavedDesigns(data as SavedCardDesign[]);
  };

  const loadDesign = async (id: string) => {
    setLoadingDesign(true);
    if (isTestUser) {
      const stored = localStorage.getItem('test_card_designs');
      if (stored) {
        const designs: SavedCardDesign[] = JSON.parse(stored);
        const design = designs.find(d => d.id === id);
        if (design) applyDesign(design);
      }
      setLoadingDesign(false);
      return;
    }
    const { data } = await supabase
      .from('card_designs')
      .select('*')
      .eq('id', id)
      .single();
    if (data) applyDesign(data as SavedCardDesign);
    setLoadingDesign(false);
  };

  const applyDesign = (design: SavedCardDesign) => {
    setDesignName(design.design_name);
    setBgType(design.bg_type);
    setGradientColor1(design.gradient_color1);
    setGradientColor2(design.gradient_color2);
    setGradientAngle(design.gradient_angle);
    setSolidColor(design.solid_color);
    setBgImage(design.bg_image);
    setCurrentFrame(design.current_frame);
    setElements(design.elements as CanvasElement[]);
    setCardData(design.card_data || {});
    setSelectedFields(design.selected_fields || []);
    const maxZ = (design.elements as CanvasElement[]).reduce((max, el) => Math.max(max, el.zIndex), 0);
    setNextZIndex(maxZ + 10);
    toast.success('Design loaded');
  };

  const saveDesign = async () => {
    setSaving(true);
    const designData = {
      user_id: userId,
      design_name: designName,
      bg_type: bgType,
      gradient_color1: gradientColor1,
      gradient_color2: gradientColor2,
      gradient_angle: gradientAngle,
      solid_color: solidColor,
      bg_image: bgImage,
      current_frame: currentFrame,
      elements: elements,
      card_data: cardData,
      selected_fields: selectedFields,
    };

    if (isTestUser) {
      const stored = localStorage.getItem('test_card_designs');
      let designs: SavedCardDesign[] = stored ? JSON.parse(stored) : [];
      if (designId) {
        designs = designs.map(d => d.id === designId ? { ...d, ...designData, updated_at: new Date().toISOString() } : d);
      } else {
        const newDesign: SavedCardDesign = {
          ...designData,
          id: `local-${Date.now()}`,
          template_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        designs.unshift(newDesign);
      }
      localStorage.setItem('test_card_designs', JSON.stringify(designs));
      setSavedDesigns(designs);
      toast.success('Design saved!');
      setSaving(false);
      return;
    }

    if (designId) {
      const { error } = await supabase
        .from('card_designs')
        .update(designData)
        .eq('id', designId);
      if (error) { toast.error('Failed to save'); setSaving(false); return; }
    } else {
      const { data, error } = await supabase
        .from('card_designs')
        .insert(designData)
        .select()
        .single();
      if (error) { toast.error('Failed to save'); setSaving(false); return; }
      if (data) toast.success('Design saved!');
    }
    await loadSavedDesigns();
    setSaving(false);
  };

  const deleteDesign = async (id: string) => {
    if (isTestUser) {
      const stored = localStorage.getItem('test_card_designs');
      if (stored) {
        const designs: SavedCardDesign[] = JSON.parse(stored).filter((d: SavedCardDesign) => d.id !== id);
        localStorage.setItem('test_card_designs', JSON.stringify(designs));
        setSavedDesigns(designs);
      }
      toast.success('Design deleted');
      return;
    }
    const { error } = await supabase.from('card_designs').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    await loadSavedDesigns();
    toast.success('Design deleted');
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    if (bgType === 'gradient') {
      return { background: `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})` };
    } else if (bgType === 'solid') {
      return { background: solidColor };
    } else if (bgType === 'image' && bgImage) {
      return { background: `url(${bgImage}) center/cover` };
    }
    return { background: '#fff' };
  };

  const handleDragStart = (field: TextField) => {
    setDraggedField(field);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedField || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: CanvasElement = {
      id: Date.now(),
      fieldId: draggedField.id,
      text: cardData[draggedField.id] || draggedField.placeholder,
      x: Math.max(0, Math.min(x - 50, 250)),
      y: Math.max(0, Math.min(y - 15, 500)),
      width: 120,
      height: 30,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 400,
      color: '#000000',
      zIndex: nextZIndex
    };

    setElements([...elements, newElement]);
    setNextZIndex(nextZIndex + 1);
    setDraggedField(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElement) return;
    const updated = { ...selectedElement, ...updates };
    setSelectedElement(updated);
    setElements(elements.map(el => el.id === updated.id ? updated : el));
  };

  const deleteSelected = () => {
    if (!selectedElement) return;
    setElements(elements.filter(el => el.id !== selectedElement.id));
    setSelectedElement(null);
  };

  const clearCanvas = () => {
    if (confirm('Clear all elements?')) {
      setElements([]);
      setSelectedElement(null);
    }
  };

  const resetCanvas = () => {
    if (confirm('Reset everything?')) {
      setElements([]);
      setSelectedElement(null);
      setCurrentFrame('none');
      setBgType('gradient');
      setGradientColor1('#667eea');
      setGradientColor2('#764ba2');
      setGradientAngle(135);
    }
  };

  const exportDesign = () => {
    const componentCode = generateReactComponent();
    navigator.clipboard.writeText(componentCode);
    toast.success('Design code copied to clipboard!');
  };

  const generateReactComponent = () => {
    const bgStyle = bgType === 'gradient'
      ? `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`
      : bgType === 'solid'
      ? solidColor
      : bgImage ? 'url(IMAGE_DATA_HERE)' : '#fff';

    const frame = FRAMES.find(f => f.id === currentFrame);
    const frameStyles = frame && frame.id !== 'none'
      ? Object.entries(frame.style).map(([k, v]) => `${k}: '${v}'`).join(', ')
      : '';

    const elementsCode = elements.map(el => {
      return `      {selectedFields.includes('${el.fieldId}') && data.${el.fieldId} && (
        <div style={{
          position: 'absolute',
          left: '${el.x}px',
          top: '${el.y}px',
          width: '${el.width}px',
          minHeight: '${el.height}px',
          fontSize: '${el.fontSize}px',
          fontFamily: '${el.fontFamily}',
          fontWeight: ${el.fontWeight},
          color: '${el.color}',
          zIndex: ${el.zIndex},
          padding: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {data.${el.fieldId}}
        </div>
      )}`;
    }).join('\n');

    return `import { BusinessCardTemplateProps } from '../types';

export default function CustomDesign({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  return (
    <div className={baseClass} style={{ background: '${bgStyle}' }}>
${frame && frame.id !== 'none' ? `      <div style={{
        position: 'absolute',
        pointerEvents: 'none',
        border: '2px solid rgba(0,0,0,0.2)',
        ${frameStyles}
      }} />
` : ''}${elementsCode}
    </div>
  );
}`;
  };

  const handleElementMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setSelectedElement(element);
    setIsDraggingElement(true);
    setDragStart({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });
  };

  const handleElementMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingElement || !selectedElement || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - rect.left - dragStart.x, 300 - selectedElement.width));
    const newY = Math.max(0, Math.min(e.clientY - rect.top - dragStart.y, 533 - selectedElement.height));
    updateSelectedElement({ x: newX, y: newY });
  };

  const handleElementMouseUp = () => {
    setIsDraggingElement(false);
    setIsResizing(false);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    setIsResizing(true);
    setSelectedElement(element);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMouseMove = (e: React.MouseEvent) => {
    if (!isResizing || !selectedElement) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const newWidth = Math.max(60, Math.min(selectedElement.width + deltaX, 300 - selectedElement.x));
    const newHeight = Math.max(30, selectedElement.height + deltaY);
    updateSelectedElement({ width: newWidth, height: newHeight });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDraggingElement(false);
      setIsResizing(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const handleTouchStart = (e: React.TouchEvent, element: CanvasElement) => {
    e.stopPropagation();
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const pos = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    setSelectedElement(element);
    setTouchDragId(element.id);
    setIsDraggingElement(true);
    setDragStart({ x: pos.x - element.x, y: pos.y - element.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (pinchStartDistance.current === 0) {
        pinchStartDistance.current = distance;
        pinchStartFontSize.current = selectedElement?.fontSize || 16;
      } else {
        const scaleFactor = distance / pinchStartDistance.current;
        const newFontSize = Math.max(8, Math.min(72, Math.round(pinchStartFontSize.current * scaleFactor)));
        if (selectedElement) {
          setElements(prev => prev.map(el =>
            el.id === selectedElement.id ? { ...el, fontSize: newFontSize } : el
          ));
          setSelectedElement(prev => prev ? { ...prev, fontSize: newFontSize } : null);
        }
      }
      return;
    }

    if (e.touches.length === 1 && touchDragId !== null) {
      const touch = e.touches[0];
      const pos = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      const el = elements.find(e => e.id === touchDragId);
      if (!el) return;
      const newX = Math.max(0, Math.min(pos.x - dragStart.x, 300 - el.width));
      const newY = Math.max(0, Math.min(pos.y - dragStart.y, 533 - el.height));
      setElements(prev => prev.map(e =>
        e.id === touchDragId ? { ...e, x: newX, y: newY } : e
      ));
      setSelectedElement(prev => prev && prev.id === touchDragId ? { ...prev, x: newX, y: newY } : prev);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchStartDistance.current = 0;
    }
    if (e.touches.length === 0) {
      setIsDraggingElement(false);
      setTouchDragId(null);
    }
  };

  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
    }
  };

  const handleResizeTouchStart = (e: React.TouchEvent, element: CanvasElement) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setSelectedElement(element);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleResizeTouchMove = (e: React.TouchEvent) => {
    if (!isResizing || !selectedElement) return;
    e.preventDefault();
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    const newWidth = Math.max(60, Math.min(selectedElement.width + deltaX, 300 - selectedElement.x));
    const newHeight = Math.max(30, selectedElement.height + deltaY);
    setElements(prev => prev.map(el =>
      el.id === selectedElement.id ? { ...el, width: newWidth, height: newHeight } : el
    ));
    setSelectedElement(prev => prev ? { ...prev, width: newWidth, height: newHeight } : null);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const tapToAddField = (field: TextField) => {
    const centerX = 150 - 60;
    const centerY = 266 - 15;
    const newElement: CanvasElement = {
      id: Date.now(),
      fieldId: field.id,
      text: cardData[field.id] || field.placeholder,
      x: Math.max(0, Math.min(centerX, 250)),
      y: Math.max(0, Math.min(centerY, 500)),
      width: 120,
      height: 30,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 400,
      color: '#000000',
      zIndex: nextZIndex
    };
    setElements([...elements, newElement]);
    setNextZIndex(nextZIndex + 1);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!selectedElement) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    const newFontSize = Math.max(8, Math.min(72, selectedElement.fontSize + delta));
    updateSelectedElement({ fontSize: newFontSize });
  };

  if (loadingDesign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading design...</div>
      </div>
    );
  }

  if (showSavedList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setShowSavedList(false)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-bold">My Saved Designs</h2>
              <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">{savedDesigns.length}</span>
            </div>
          </div>

          {savedDesigns.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No saved designs yet</p>
              <p className="text-xs mt-1">Create and save your first card design</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedDesigns.map(design => (
                <div key={design.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold truncate flex-1">{design.design_name}</h3>
                    <button onClick={() => deleteDesign(design.id)} className="text-muted-foreground hover:text-red-400 ml-2">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-600"
                      style={{ background: design.bg_type === 'gradient'
                        ? `linear-gradient(135deg, ${design.gradient_color1}, ${design.gradient_color2})`
                        : design.bg_type === 'solid' ? design.solid_color : '#333'
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">{design.elements.length} elements · {design.current_frame !== 'none' ? design.current_frame : 'no frame'}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/designer?id=${design.id}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <FolderOpen className="h-3 w-3 mr-1" /> Load
                      </Button>
                    </Link>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">{new Date(design.updated_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col overflow-hidden">
      {/* TOP TOOLBAR - mobile only */}
      {isMobile && (
        <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-3 py-2">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <span className="text-sm font-semibold truncate max-w-[120px]">{designName}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={saveDesign} disabled={saving} className="h-9 w-9 p-0 text-green-400">
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSavedList(true)} className="h-9 w-9 p-0">
                <FolderOpen className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={exportDesign} className="h-9 w-9 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-1 mt-2 overflow-x-auto pb-1 -mx-1 px-1">
            <Button variant="ghost" size="sm" onClick={clearCanvas} className="h-8 text-xs shrink-0">
              <Trash2 className="h-3 w-3 mr-1" /> Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={resetCanvas} className="h-8 text-xs shrink-0">
              <RotateCcw className="h-3 w-3 mr-1" /> Reset
            </Button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - desktop only */}
        {!isMobile && (
          <div className="w-[280px] flex-shrink-0 bg-gray-900 border-r border-gray-800 p-5 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h2 className="text-sm font-semibold">Text Fields</h2>
            </div>

            <p className="text-[10px] text-muted-foreground mb-3">Drag to canvas or tap to add at center</p>

            <div className="space-y-2">
              {TEXT_FIELDS.map(field => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(field)}
                  onClick={() => tapToAddField(field)}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-gray-750 hover:border-gray-600 transition-all hover:translate-x-1 touch-manipulation"
                >
                  <div className="text-xs font-medium text-gray-300 mb-1">{field.label}</div>
                  <div className="text-[10px] text-gray-500">{field.placeholder}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CENTER - CANVAS */}
        <div className={`flex flex-col items-center justify-center relative ${isMobile ? 'p-4 flex-1 min-h-0' : 'p-10'}`}>
          {/* Desktop toolbar - floating above canvas */}
          {!isMobile && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 flex gap-2 z-50">
              <Button variant="ghost" size="sm" onClick={saveDesign} disabled={saving} className="h-8 text-xs text-green-400 hover:text-green-300">
                <Save className="h-3 w-3 mr-1" /> {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSavedList(true)} className="h-8 text-xs">
                <FolderOpen className="h-3 w-3 mr-1" /> My Designs
              </Button>
              <Button variant="ghost" size="sm" onClick={exportDesign} className="h-8 text-xs">
                <Download className="h-3 w-3 mr-1" /> Export
              </Button>
              <Button variant="ghost" size="sm" onClick={clearCanvas} className="h-8 text-xs">
                <Trash2 className="h-3 w-3 mr-1" /> Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={resetCanvas} className="h-8 text-xs">
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </Button>
            </div>
          )}

          <div className="relative flex-shrink-0" style={{ maxWidth: isMobile ? 'calc(100vw - 32px)' : undefined, maxHeight: isMobile ? 'calc(100vh - 140px)' : undefined }}>
            <div className="relative w-[300px] h-[533px] shadow-2xl rounded overflow-hidden origin-top" style={isMobile ? {
              transform: `scale(${Math.min(1, (window.innerWidth - 48) / 300, (window.innerHeight - 160) / 533)})`,
            } : undefined}>
              <div
                ref={canvasRef}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onMouseMove={(e) => {
                  if (isDraggingElement) handleElementMouseMove(e);
                  if (isResizing) handleResizeMouseMove(e);
                }}
                onClick={(e) => {
                  if (e.target === canvasRef.current) setSelectedElement(null);
                }}
                onWheel={handleWheel}
                onTouchStart={handleCanvasTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-full relative cursor-default touch-none"
                style={getBackgroundStyle()}
              >
                {/* Frame */}
                {currentFrame !== 'none' && FRAMES.find(f => f.id === currentFrame) && (
                  <div
                    className="absolute pointer-events-none border-2 border-black/20"
                    style={FRAMES.find(f => f.id === currentFrame)!.style}
                  />
                )}

                {/* Elements */}
                {elements.map(el => (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleElementMouseDown(e, el)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement(el);
                    }}
                    onTouchStart={(e) => handleTouchStart(e, el)}
                    className={`absolute select-none p-2 min-w-[60px] min-h-[30px] touch-manipulation ${
                      selectedElement?.id === el.id ? 'outline outline-2 outline-cyan-400 outline-offset-2' : ''
                    } ${isDraggingElement && selectedElement?.id === el.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      minHeight: el.height,
                      fontSize: el.fontSize,
                      fontFamily: el.fontFamily,
                      fontWeight: el.fontWeight,
                      color: el.color,
                      zIndex: el.zIndex,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {el.text}
                    {selectedElement?.id === el.id && (
                      <div
                        onMouseDown={(e) => handleResizeMouseDown(e, el)}
                        onTouchStart={(e) => handleResizeTouchStart(e, el)}
                        onTouchMove={handleResizeTouchMove}
                        onTouchEnd={() => setIsResizing(false)}
                        className="absolute bottom-0 right-0 w-4 h-4 bg-cyan-400 cursor-nwse-resize rounded-sm touch-none"
                        style={{ pointerEvents: 'auto' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isMobile && (
            <p className="text-[10px] text-muted-foreground mt-4">
              {selectedElement ? `Selected: ${selectedElement.fieldId} (${selectedElement.fontSize}px) · Scroll/pinch to resize font` : 'Click an element to select it'}
            </p>
          )}
        </div>

        {/* RIGHT SIDEBAR - desktop only */}
        {!isMobile && (
          <div className="w-[320px] flex-shrink-0 bg-gray-900 border-l border-gray-800 p-5 overflow-y-auto">
            <SidebarContent
              designName={designName}
              setDesignName={setDesignName}
              bgType={bgType}
              setBgType={setBgType}
              gradientColor1={gradientColor1}
              setGradientColor1={setGradientColor1}
              gradientColor2={gradientColor2}
              setGradientColor2={setGradientColor2}
              gradientAngle={gradientAngle}
              setGradientAngle={setGradientAngle}
              solidColor={solidColor}
              setSolidColor={setSolidColor}
              bgImage={bgImage}
              handleImageUpload={handleImageUpload}
              currentFrame={currentFrame}
              setCurrentFrame={setCurrentFrame}
              selectedElement={selectedElement}
              updateSelectedElement={updateSelectedElement}
              deleteSelected={deleteSelected}
            />
          </div>
        )}
      </div>

      {/* MOBILE TAB PANEL */}
      {isMobile && (
        <div className="flex-shrink-0 bg-gray-900 border-t border-gray-800">
          {/* Tab Bar */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setMobileTab('fields')}
              className={`flex-1 py-3 px-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                mobileTab === 'fields' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-800/50' : 'text-gray-400'
              }`}
            >
              <Type className="h-3.5 w-3.5" /> Fields
            </button>
            <button
              onClick={() => setMobileTab('bg')}
              className={`flex-1 py-3 px-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                mobileTab === 'bg' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-800/50' : 'text-gray-400'
              }`}
            >
              <Palette className="h-3.5 w-3.5" /> Background
            </button>
            <button
              onClick={() => setMobileTab('props')}
              className={`flex-1 py-3 px-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                mobileTab === 'props' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-800/50' : 'text-gray-400'
              }`}
            >
              <Settings className="h-3.5 w-3.5" /> Properties
              {selectedElement && <span className="w-2 h-2 bg-cyan-400 rounded-full ml-1" />}
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-h-[45vh] overflow-y-auto p-4">
            {mobileTab === 'fields' && (
              <div>
                <p className="text-[11px] text-muted-foreground mb-3">Tap a field to add to canvas center</p>
                <div className="grid grid-cols-2 gap-2">
                  {TEXT_FIELDS.map(field => (
                    <div
                      key={field.id}
                      onClick={() => tapToAddField(field)}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-3 active:bg-gray-700 transition-colors touch-manipulation"
                    >
                      <div className="text-xs font-medium text-gray-300 mb-0.5">{field.label}</div>
                      <div className="text-[10px] text-gray-500 truncate">{field.placeholder}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mobileTab === 'bg' && (
              <div>
                {/* Design Name */}
                <div className="mb-4">
                  <label className="text-xs text-gray-400 mb-1 block">Design Name</label>
                  <input
                    type="text"
                    value={designName}
                    onChange={(e) => setDesignName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm"
                    placeholder="Untitled Design"
                  />
                </div>

                {/* Background Type */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button
                    variant={bgType === 'gradient' ? 'default' : 'outline'}
                    size="sm"
                    className="h-10"
                    onClick={() => setBgType('gradient')}
                  >
                    Gradient
                  </Button>
                  <Button
                    variant={bgType === 'image' ? 'default' : 'outline'}
                    size="sm"
                    className="h-10"
                    onClick={() => setBgType('image')}
                  >
                    Image
                  </Button>
                  <Button
                    variant={bgType === 'solid' ? 'default' : 'outline'}
                    size="sm"
                    className="h-10"
                    onClick={() => setBgType('solid')}
                  >
                    Solid
                  </Button>
                </div>

                {bgType === 'gradient' && (
                  <div className="space-y-3 mb-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-[11px] text-gray-500 mb-1 block">Color 1</label>
                        <input
                          type="color"
                          value={gradientColor1}
                          onChange={(e) => setGradientColor1(e.target.value)}
                          className="w-full h-12 rounded-lg border border-gray-700 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[11px] text-gray-500 mb-1 block">Color 2</label>
                        <input
                          type="color"
                          value={gradientColor2}
                          onChange={(e) => setGradientColor2(e.target.value)}
                          className="w-full h-12 rounded-lg border border-gray-700 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">Angle: {gradientAngle}°</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradientAngle}
                        onChange={(e) => setGradientAngle(Number(e.target.value))}
                        className="w-full h-10"
                      />
                    </div>
                  </div>
                )}

                {bgType === 'image' && (
                  <div className="mb-4">
                    <div
                      onClick={() => document.getElementById('bgImageInputMobile')?.click()}
                      className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center active:bg-gray-800/50 transition-colors touch-manipulation"
                    >
                      <input
                        id="bgImageInputMobile"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="text-sm text-gray-400">Tap to upload image</div>
                    </div>
                  </div>
                )}

                {bgType === 'solid' && (
                  <div className="mb-4">
                    <input
                      type="color"
                      value={solidColor}
                      onChange={(e) => setSolidColor(e.target.value)}
                      className="w-full h-12 rounded-lg border border-gray-700 cursor-pointer"
                    />
                  </div>
                )}

                {/* Frames */}
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Frames</h4>
                <div className="grid grid-cols-5 gap-2">
                  {FRAMES.map(frame => (
                    <div
                      key={frame.id}
                      onClick={() => setCurrentFrame(frame.id)}
                      className={`aspect-square border-2 rounded cursor-pointer transition-all relative ${
                        currentFrame === frame.id
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-700 active:border-gray-500'
                      }`}
                    >
                      <div className="absolute inset-1.5 border-2 border-gray-600 rounded-sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mobileTab === 'props' && (
              selectedElement ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold">Element: {selectedElement.fieldId}</h4>
                    <Button variant="destructive" size="sm" className="h-8 text-xs" onClick={deleteSelected}>
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Font Family</label>
                    <select
                      value={selectedElement.fontFamily}
                      onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Roboto">Roboto</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Font Size</label>
                      <input
                        type="number"
                        min="8"
                        max="72"
                        value={selectedElement.fontSize}
                        onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Font Weight</label>
                      <select
                        value={selectedElement.fontWeight}
                        onChange={(e) => updateSelectedElement({ fontWeight: Number(e.target.value) })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm"
                      >
                        <option value="300">Light</option>
                        <option value="400">Regular</option>
                        <option value="500">Medium</option>
                        <option value="600">Bold</option>
                        <option value="700">Heavy</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Text Color</label>
                    <input
                      type="color"
                      value={selectedElement.color}
                      onChange={(e) => updateSelectedElement({ color: e.target.value })}
                      className="w-full h-12 rounded-lg border border-gray-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Text Content</label>
                    <input
                      type="text"
                      value={selectedElement.text}
                      onChange={(e) => updateSelectedElement({ text: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm"
                    />
                  </div>

                  <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs text-cyan-300">
                    Pinch with 2 fingers on the element to resize font
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Tap an element on the canvas to edit its properties</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
