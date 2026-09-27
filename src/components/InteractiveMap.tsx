import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Navigation, MapPin } from 'lucide-react';
import { Device, MapViewMode } from '../types';

interface InteractiveMapProps {
  devices: Device[];
  selectedId: string | null;
  onRelocate: (deviceId: string, lat: number, lng: number) => void;
}

export default function InteractiveMap({ devices, selectedId, onRelocate }: InteractiveMapProps) {
  const [viewMode, setViewMode] = useState<MapViewMode>('tactical');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const MAP_W = 800;
  const MAP_H = 500;

  const latToY = (lat: number) => {
    const minLat = 30, maxLat = 45;
    return MAP_H - ((lat - minLat) / (maxLat - minLat)) * MAP_H;
  };
  const lngToX = (lng: number) => {
    const minLng = -130, maxLng = -60;
    return ((lng - minLng) / (maxLng - minLng)) * MAP_W;
  };
  const yToLat = (y: number) => {
    const minLat = 30, maxLat = 45;
    return minLat + ((MAP_H - y) / MAP_H) * (maxLat - minLat);
  };
  const xToLng = (x: number) => {
    const minLng = -130, maxLng = -60;
    return minLng + (x / MAP_W) * (maxLng - minLng);
  };

  const handleMapClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging.current) return;
    if (!selectedId) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * MAP_W;
    const y = ((e.clientY - rect.top) / rect.height) * MAP_H;
    const lat = yToLat(y);
    const lng = xToLng(x);
    onRelocate(selectedId, lat, lng);
  }, [selectedId, onRelocate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      isDragging.current = true;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => { isDragging.current = false; }, 50);
  };

  const gridLines = [];
  for (let i = 0; i <= 16; i++) {
    const x = (i / 16) * MAP_W;
    gridLines.push(<line key={`v${i}`} x1={x} y1={0} x2={x} y2={MAP_H} stroke={viewMode === 'tactical' ? '#0e4a5c' : '#1e293b'} strokeWidth={0.5} strokeDasharray="4,4" />);
  }
  for (let i = 0; i <= 10; i++) {
    const y = (i / 10) * MAP_H;
    gridLines.push(<line key={`h${i}`} x1={0} y1={y} x2={MAP_W} y2={y} stroke={viewMode === 'tactical' ? '#0e4a5c' : '#1e293b'} strokeWidth={0.5} strokeDasharray="4,4" />);
  }

  const bgColors: Record<MapViewMode, string> = {
    tactical: '#020617',
    satellite: '#0f172a',
    street: '#1e293b',
  };

  return (
    <div className="relative w-full h-full bg-slate-950 border border-cyan-900/30 rounded overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-900/30 bg-slate-950/90">
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono text-cyan-400 tracking-wider">TELEMETRY MAP</span>
        </div>
        <div className="flex items-center gap-1">
          {(['tactical', 'satellite', 'street'] as MapViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                viewMode === mode ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50' : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="w-full h-full cursor-crosshair"
          onClick={handleMapClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)` }}
        >
          <rect width={MAP_W} height={MAP_H} fill={bgColors[viewMode]} />
          {gridLines}

          {/* Radar sweep */}
          {viewMode === 'tactical' && (
            <motion.line
              x1={MAP_W / 2} y1={MAP_H / 2}
              x2={MAP_W / 2} y2={0}
              stroke="#06b6d4" strokeWidth={1} opacity={0.3}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `${MAP_W / 2}px ${MAP_H / 2}px` }}
            />
          )}

          {/* Device markers */}
          {devices.map(device => {
            const x = lngToX(device.lastKnownLocation.lng);
            const y = latToY(device.lastKnownLocation.lat);
            const isSelected = device.id === selectedId;
            const color = device.isAlarming ? '#ef4444' : device.status === 'online' ? '#06b6d4' : '#f59e0b';

            return (
              <g key={device.id}>
                {/* Route history trail */}
                {device.routeHistory.length > 1 && device.routeHistory.map((pt, i) => {
                  if (i === 0) return null;
                  const prev = device.routeHistory[i - 1];
                  return (
                    <line
                      key={`trail-${i}`}
                      x1={lngToX(prev.lng)} y1={latToY(prev.lat)}
                      x2={lngToX(pt.lng)} y2={latToY(pt.lat)}
                      stroke={color} strokeWidth={1} strokeDasharray="3,3" opacity={0.4}
                    />
                  );
                })}

                {/* Mesh neighbor lines */}
                {isSelected && device.meshNeighbors.map((_, i) => (
                  <motion.line
                    key={`mesh-${i}`}
                    x1={x} y1={y}
                    x2={x + Math.cos(i * 2.1) * 60} y2={y + Math.sin(i * 2.1) * 60}
                    stroke="#10b981" strokeWidth={0.5} opacity={0.5}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}

                {/* Pulse ring */}
                <motion.circle
                  cx={x} cy={y} r={8}
                  fill="none" stroke={color} strokeWidth={1}
                  animate={{ r: [8, 24], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {device.isAlarming && (
                  <motion.circle
                    cx={x} cy={y} r={8}
                    fill="none" stroke="#ef4444" strokeWidth={2}
                    animate={{ r: [8, 35], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                {/* Main marker */}
                <circle cx={x} cy={y} r={5} fill={color} opacity={0.9} />
                <circle cx={x} cy={y} r={2} fill="#fff" />

                {/* Label */}
                <text x={x + 10} y={y - 5} fill={color} fontSize="9" fontFamily="monospace">
                  {device.name}
                </text>
                <text x={x + 10} y={y + 6} fill="#64748b" fontSize="7" fontFamily="monospace">
                  {device.chipId}
                </text>

                {isSelected && (
                  <motion.rect
                    x={x - 14} y={y - 14} width={28} height={28}
                    fill="none" stroke="#06b6d4" strokeWidth={1}
                    strokeDasharray="4,2" rx={2}
                    animate={{ rotate: [0, 90] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Zoom controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button onClick={() => setZoom(z => Math.min(z + 0.3, 3))} className="w-6 h-6 bg-slate-800 border border-slate-600 text-slate-300 text-xs rounded flex items-center justify-center hover:bg-slate-700">+</button>
          <button onClick={() => setZoom(z => Math.max(z - 0.3, 0.5))} className="w-6 h-6 bg-slate-800 border border-slate-600 text-slate-300 text-xs rounded flex items-center justify-center hover:bg-slate-700">-</button>
          <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="w-6 h-6 bg-slate-800 border border-slate-600 text-slate-300 rounded flex items-center justify-center hover:bg-slate-700">
            <Crosshair className="w-3 h-3" />
          </button>
        </div>

        {/* Coordinates display */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-slate-900/80 border border-slate-700 rounded text-[10px] font-mono text-slate-400">
          <MapPin className="w-3 h-3 inline mr-1 text-cyan-500" />
          {selectedId ? 'Click map to relocate selected device' : 'Select a device to relocate'}
        </div>
      </div>
    </div>
  );
}
