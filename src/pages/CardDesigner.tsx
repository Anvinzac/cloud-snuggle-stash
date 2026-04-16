import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface TextField {
  id: string;
  label: string;
  placeholder: string;
}

interface CanvasElement {
  id: number;
  fieldId: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  zIndex: number;
}

interface Frame {
  id: string;
  label: string;
  style: React.CSSProperties;
}

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

export default function CardDesigner() {
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
  
  const canvasRef = useRef<HTMLDivElement>(null);

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
      text: draggedField.placeholder,
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
    // Generate React component code
    const componentCode = generateReactComponent();
    
    // Copy to clipboard
    navigator.clipboard.writeText(componentCode);
    toast.success('Design code copied to clipboard! Create a new file in src/components/businesscard/designs/');
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

  // Element dragging handlers
  const handleElementMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    setSelectedElement(element);
    setIsDraggingElement(true);
    // Store the offset from mouse to element's top-left corner
    setDragStart({ 
      x: e.clientX - rect.left - element.x, 
      y: e.clientY - rect.top - element.y 
    });
  };

  const handleElementMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingElement || !selectedElement || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    // Calculate new position relative to canvas
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="grid grid-cols-[280px_1fr_320px] h-screen">
        {/* LEFT SIDEBAR */}
        <div className="bg-gray-900 border-r border-gray-800 p-5 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/cards">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-sm font-semibold">Text Fields</h2>
          </div>

          <div className="space-y-2">
            {TEXT_FIELDS.map(field => (
              <div
                key={field.id}
                draggable
                onDragStart={() => handleDragStart(field)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-gray-750 hover:border-gray-600 transition-all hover:translate-x-1"
              >
                <div className="text-xs font-medium text-gray-300 mb-1">{field.label}</div>
                <div className="text-[10px] text-gray-500">{field.placeholder}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER - CANVAS */}
        <div className="flex flex-col items-center justify-center p-10 relative">
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 flex gap-2 z-50">
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

          <div className="relative w-[300px] h-[533px] shadow-2xl rounded overflow-hidden">
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
              className="w-full h-full relative cursor-default"
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
                  className={`absolute select-none p-2 min-w-[60px] min-h-[30px] ${
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
                      className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-400 cursor-nwse-resize rounded-sm"
                      style={{ pointerEvents: 'auto' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-gray-900 border-l border-gray-800 p-5 overflow-y-auto">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Background</h3>
          
          <div className="space-y-2 mb-6">
            <Button
              variant={bgType === 'gradient' ? 'default' : 'outline'}
              size="sm"
              className="w-full"
              onClick={() => setBgType('gradient')}
            >
              Gradient
            </Button>
            <Button
              variant={bgType === 'image' ? 'default' : 'outline'}
              size="sm"
              className="w-full"
              onClick={() => setBgType('image')}
            >
              Image
            </Button>
            <Button
              variant={bgType === 'solid' ? 'default' : 'outline'}
              size="sm"
              className="w-full"
              onClick={() => setBgType('solid')}
            >
              Solid Color
            </Button>
          </div>

          {bgType === 'gradient' && (
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[9px] text-gray-500 mb-1 block">Color 1</label>
                  <input
                    type="color"
                    value={gradientColor1}
                    onChange={(e) => setGradientColor1(e.target.value)}
                    className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-gray-500 mb-1 block">Color 2</label>
                  <input
                    type="color"
                    value={gradientColor2}
                    onChange={(e) => setGradientColor2(e.target.value)}
                    className="w-full h-10 rounded border border-gray-700 cursor-pointer"
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
                  className="w-full"
                />
              </div>
            </div>
          )}

          {bgType === 'image' && (
            <div className="mb-6">
              <div
                onClick={() => document.getElementById('bgImageInput')?.click()}
                className="border-2 border-dashed border-gray-700 rounded-lg p-5 text-center cursor-pointer hover:border-gray-600 hover:bg-gray-800/50 transition-all"
              >
                <input
                  id="bgImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-xs text-gray-500">Click to upload image</div>
              </div>
            </div>
          )}

          {bgType === 'solid' && (
            <div className="mb-6">
              <input
                type="color"
                value={solidColor}
                onChange={(e) => setSolidColor(e.target.value)}
                className="w-full h-10 rounded border border-gray-700 cursor-pointer"
              />
            </div>
          )}

          <hr className="border-gray-800 my-6" />

          <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Frames</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {FRAMES.map(frame => (
              <div
                key={frame.id}
                onClick={() => setCurrentFrame(frame.id)}
                className={`aspect-square border-2 rounded cursor-pointer transition-all relative ${
                  currentFrame === frame.id
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
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
                  <select
                    value={selectedElement.fontFamily}
                    onChange={(e) => updateSelectedElement({ fontFamily: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Roboto">Roboto</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Font Size</label>
                  <input
                    type="number"
                    min="8"
                    max="72"
                    value={selectedElement.fontSize}
                    onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Font Weight</label>
                  <select
                    value={selectedElement.fontWeight}
                    onChange={(e) => updateSelectedElement({ fontWeight: Number(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
                  >
                    <option value="300">Light</option>
                    <option value="400">Regular</option>
                    <option value="500">Medium</option>
                    <option value="600">Semi Bold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Text Color</label>
                  <input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) => updateSelectedElement({ color: e.target.value })}
                    className="w-full h-10 rounded border border-gray-700 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Text Content</label>
                  <input
                    type="text"
                    value={selectedElement.text}
                    onChange={(e) => updateSelectedElement({ text: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-sm"
                  />
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-3"
                  onClick={deleteSelected}
                >
                  Delete Element
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
