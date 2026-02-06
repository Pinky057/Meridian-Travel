"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type RoomType = "interior" | "oceanview" | "balcony" | "suite"

interface Room {
    id: string
    type: RoomType
    price: number
    x: number
    y: number
    isBooked?: boolean
}

// Generate a mock deck plan
const generateDeck = (): Room[] => {
    const rooms: Room[] = []
    const startX = 60
    const startY = 40
    const roomWidth = 30
    const roomHeight = 40
    const gap = 4

    // Port side (Left)
    for (let i = 0; i < 20; i++) {
        rooms.push({
            id: `P${100 + i}`,
            type: i % 10 === 0 ? "suite" : i % 3 === 0 ? "balcony" : "oceanview",
            price: i % 10 === 0 ? 2500 : i % 3 === 0 ? 1800 : 1200,
            x: startX + (i * (roomWidth + gap)),
            y: startY,
            isBooked: Math.random() > 0.7
        })
    }

    // Starboard side (Right)
    for (let i = 0; i < 20; i++) {
        rooms.push({
            id: `S${100 + i}`,
            type: i % 10 === 0 ? "suite" : i % 3 === 0 ? "balcony" : "oceanview",
            price: i % 10 === 0 ? 2500 : i % 3 === 0 ? 1800 : 1200,
            x: startX + (i * (roomWidth + gap)),
            y: startY + 120, // Lower deck
            isBooked: Math.random() > 0.7
        })
    }

    // Interior Rooms (Middle)
    for (let i = 0; i < 20; i++) {
        rooms.push({
            id: `I${100 + i}`,
            type: "interior",
            price: 800,
            x: startX + (i * (roomWidth + gap)),
            y: startY + 60,
            isBooked: Math.random() > 0.6
        })
    }

    return rooms
}

const DECK_ROOMS = generateDeck()

export function StateroomSelector({ onSelect }: { onSelect: (room: Room) => void }) {
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
    const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null)

    const handleRoomClick = (room: Room) => {
        if (room.isBooked) return
        setSelectedRoomId(room.id)
        onSelect(room)
    }

    const getRoomColor = (room: Room) => {
        if (room.isBooked) return "fill-slate-200 stroke-slate-300 cursor-not-allowed"
        if (selectedRoomId === room.id) return "fill-sky-600 stroke-sky-700 shadow-lg"

        switch (room.type) {
            case "suite": return "fill-purple-100 stroke-purple-300 hover:fill-purple-200"
            case "balcony": return "fill-blue-100 stroke-blue-300 hover:fill-blue-200"
            case "oceanview": return "fill-teal-100 stroke-teal-300 hover:fill-teal-200"
            default: return "fill-slate-50 stroke-slate-200 hover:fill-slate-100"
        }
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded" />
                        <span>Suite</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded" />
                        <span>Balcony</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-teal-100 border border-teal-300 rounded" />
                        <span>Oceanview</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-slate-50 border border-slate-200 rounded" />
                        <span>Interior</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <div className="w-4 h-4 bg-slate-200 border border-slate-300 rounded" />
                    <span>Occupied</span>
                </div>
            </div>

            <div className="relative w-full aspect-[3/1] bg-blue-50/30 rounded-full border-2 border-slate-200 overflow-hidden shadow-inner">
                {/* Ship Shape Outline */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-white border-r border-slate-200 rounded-l-full z-0" />

                <TooltipProvider>
                    <svg className="w-full h-full p-8" viewBox="0 0 800 250">
                        {/* Deck Floor Plan */}
                        <path d="M 50,20 L 780,20 Q 800,20 800,40 L 800,210 Q 800,230 780,230 L 50,230 Q 10,230 10,125 Q 10,20 50,20 Z"
                            className="fill-white stroke-slate-200 stroke-2" />

                        {/* Rooms */}
                        {DECK_ROOMS.map((room) => (
                            <Tooltip key={room.id}>
                                <TooltipTrigger asChild>
                                    <rect
                                        x={room.x}
                                        y={room.y}
                                        width={30}
                                        height={40}
                                        rx={2}
                                        className={cn(
                                            "transition-all duration-200 cursor-pointer stroke-[1.5px]",
                                            getRoomColor(room),
                                            selectedRoomId === room.id && "scale-110 z-10"
                                        )}
                                        onClick={() => handleRoomClick(room)}
                                        onMouseEnter={() => setHoveredRoomId(room.id)}
                                        onMouseLeave={() => setHoveredRoomId(null)}
                                        role="button"
                                        aria-label={`${room.type} cabin ${room.id}, price $${room.price}`}
                                        aria-disabled={room.isBooked}
                                        tabIndex={room.isBooked ? -1 : 0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                handleRoomClick(room)
                                            }
                                        }}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-slate-900 text-white border-none">
                                    <div className="text-xs">
                                        <p className="font-bold mb-1">Cabin {room.id}</p>
                                        <p className="capitalize text-slate-300">{room.type}</p>
                                        {room.isBooked ? (
                                            <p className="text-red-400 font-bold mt-1">Occupied</p>
                                        ) : (
                                            <p className="text-green-400 font-bold mt-1">${room.price}</p>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </svg>
                </TooltipProvider>

                {/* Selected Room Overlay */}
                {selectedRoomId && (
                    <div className="absolute top-6 right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 w-64 animate-in fade-in slide-in-from-right-4">
                        <h4 className="font-bold text-slate-900 mb-1">Cabin {selectedRoomId} Selected</h4>
                        <p className="text-sm text-slate-500 mb-3">Great choice! This {DECK_ROOMS.find(r => r.id === selectedRoomId)?.type} includes a private balcony.</p>
                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg mb-0 text-sm font-medium">
                            <span>Total</span>
                            <span>${DECK_ROOMS.find(r => r.id === selectedRoomId)?.price}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
