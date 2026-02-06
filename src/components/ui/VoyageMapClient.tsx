"use client"

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Voyage } from '@/lib/voyage-utils'
import { Button } from '../ui/button'

// Fix for default Leaflet icons in Webpack/Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

interface VoyageMapClientProps {
    voyages: Voyage[]
    onVoyageSelect: (voyage: Voyage) => void
    selectedVoyageId?: string | null
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, 5)
    }, [center, map])
    return null
}

export default function VoyageMapClient({ voyages, onVoyageSelect, selectedVoyageId }: VoyageMapClientProps) {
    // Default center (Atlantic)
    const defaultCenter: [number, number] = [30, -40]

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 z-0 relative">
            <MapContainer
                center={defaultCenter}
                zoom={2}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {voyages.map((voyage) => (
                    <Marker
                        key={voyage.id}
                        position={[voyage.coordinates.lat, voyage.coordinates.lng]}
                        icon={icon}
                        eventHandlers={{
                            click: () => onVoyageSelect(voyage)
                        }}
                    >
                        <Popup>
                            <div className="p-1 min-w-[150px]">
                                <h3 className="font-bold text-sm mb-1">{voyage.title}</h3>
                                <p className="text-xs text-slate-500 mb-2">{voyage.nights} Nights • From ${voyage.price}</p>
                                <Button
                                    size="sm"
                                    className="w-full h-7 text-xs bg-sky-600 hover:bg-sky-500"
                                    onClick={(e) => {
                                        e.stopPropagation() // Prevent marker click from re-firing if needed
                                        onVoyageSelect(voyage)
                                    }}
                                >
                                    View Details
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Helper to re-center if a voyage is selected externally, or we could add logic here */}
            </MapContainer>
        </div>
    )
}
