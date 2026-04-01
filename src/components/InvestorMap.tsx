import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { INVESTORS, CITIES } from '../constants';
import { cn } from '../lib/utils';

interface InvestorMapProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  onBookMeeting: (investorId: number) => void;
}

export const InvestorMapSection: React.FC<InvestorMapProps> = ({ selectedCity, onCityChange, onBookMeeting }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('investorMap', {
        zoomControl: true,
        scrollWheelZoom: false
      }).setView([28.6139, 77.2090], 11);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB © OpenStreetMap',
        maxZoom: 18
      }).addTo(mapRef.current);
    }

    updateMarkers(selectedCity);

    return () => {
      // Cleanup markers on unmount if needed
    };
  }, []);

  useEffect(() => {
    updateMarkers(selectedCity);
    
    const centers: Record<string, [number, number]> = {
      "Delhi NCR":  [28.6139, 77.2090],
      "Mumbai":     [19.0760, 72.8777],
      "Bangalore":  [12.9716, 77.5946],
      "Hyderabad":  [17.3850, 78.4867],
      "Pune":       [18.5204, 73.8567],
      "Chennai":    [13.0827, 80.2707]
    };

    if (mapRef.current && centers[selectedCity]) {
      mapRef.current.flyTo(centers[selectedCity], 11, { duration: 1.5 });
    }
  }, [selectedCity]);

  const updateMarkers = (city: string) => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => mapRef.current?.removeLayer(m));
    markersRef.current = [];

    const cityInvestors = INVESTORS.filter(inv => inv.city === city);

    cityInvestors.forEach(inv => {
      const marker = L.circleMarker([inv.lat, inv.lng], {
        radius: 12,
        fillColor: inv.color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      });

      const popupContent = `
        <div class="custom-popup-content" style="background:#111827;color:white;padding:14px;border-radius:12px;min-width:200px;border:1px solid #1F2937;font-family:Inter,sans-serif">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <div style="width:36px;height:36px;border-radius:50%;background:${inv.color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:white">
              ${inv.initials}
            </div>
            <div>
              <div style="font-weight:600;font-size:14px">${inv.name}</div>
              <div style="color:#9CA3AF;font-size:12px">${inv.fund}</div>
            </div>
          </div>
          <div style="color:#6EE7B7;font-size:12px;margin-bottom:10px">
            📍 ${inv.area} • ${inv.distance}
          </div>
          <button id="book-btn-${inv.id}" style="width:100%;background:#3B82F6;color:white;border:none;border-radius:8px;padding:8px;font-size:12px;cursor:pointer;font-weight:600">
            📅 Book Meeting
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { className: 'custom-popup' });
      
      marker.on('popupopen', () => {
        const btn = document.getElementById(`book-btn-${inv.id}`);
        if (btn) {
          btn.onclick = () => onBookMeeting(inv.id);
        }
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  };

  const cityInvestors = INVESTORS.filter(inv => inv.city === selectedCity);

  return (
    <div className="animate-fade-in-up">
      <header className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Investors Near You</h2>
        <div className="flex flex-wrap gap-2.5">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => onCityChange(city)}
              className={cn(
                "px-5 py-2 rounded-full text-xs transition-all duration-200 border",
                selectedCity === city
                  ? "bg-accent text-white border-accent"
                  : "bg-bg-input text-text-muted border-border-hover hover:border-accent/50"
              )}
            >
              {city}
            </button>
          ))}
        </div>
      </header>

      <div id="investorMap" className="w-full h-[340px] rounded-2xl border border-border overflow-hidden mb-8" />

      <div className="space-y-4">
        {cityInvestors.map((inv) => (
          <div 
            key={inv.id} 
            className="card flex items-center gap-4 hover:border-accent group cursor-pointer"
            onClick={() => onBookMeeting(inv.id)}
          >
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
              style={{ backgroundColor: inv.color }}
            >
              {inv.initials}
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-white">{inv.name}</h4>
              <p className="text-text-muted text-sm">{inv.fund}</p>
              <div className="flex gap-2 mt-2">
                {inv.focus.map(f => (
                  <span key={f} className="bg-bg-input text-gray-300 text-[10px] px-2.5 py-0.5 rounded-full border border-border-hover">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="bg-success/10 text-success text-xs px-3 py-1 rounded-full font-medium">
                {inv.distance}
              </span>
              <button className="bg-accent text-white px-4 py-1.5 rounded-lg text-xs font-bold">
                Book Meeting
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
