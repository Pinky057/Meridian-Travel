"use client"

import { useState, useEffect } from "react"
import { Activity, X } from "lucide-react"

export interface AnalyticsEvent {
    id: string
    name: string
    timestamp: string
    payload: any
}

export function DebugOverlay() {
    const [events, setEvents] = useState<AnalyticsEvent[]>([])
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        // Listen for custom events
        const handleAnalytics = (e: CustomEvent<AnalyticsEvent>) => {
            setEvents(prev => [e.detail, ...prev].slice(0, 10)) // Keep last 10
        }

        window.addEventListener('meridian-analytics' as any, handleAnalytics)
        return () => window.removeEventListener('meridian-analytics' as any, handleAnalytics)
    }, [])

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-all z-[100]"
            >
                <Activity className="w-5 h-5" />
            </button>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-slate-900/95 backdrop-blur text-slate-200 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-[100] font-mono text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2 font-bold text-sky-400">
                    <Activity className="w-4 h-4" />
                    <span>MarTech Debugger</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="h-48 overflow-y-auto p-2 space-y-2">
                {events.length === 0 ? (
                    <div className="text-slate-500 text-center py-8 italic">
                        Waiting for events...
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="bg-slate-800/50 p-2 rounded border border-slate-700/50 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-green-400 font-bold">{event.name}</span>
                                <span className="text-slate-500 text-[10px]">{event.timestamp.split('T')[1].split('.')[0]}</span>
                            </div>
                            <pre className="text-slate-400 overflow-x-auto">
                                {JSON.stringify(event.payload, null, 1).replace(/[{}"]/g, '')}
                            </pre>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

// Helper to trigger events
export const trackEvent = (name: string, payload: any) => {
    if (typeof window === 'undefined') return
    // Save to LocalStorage for Admin Dashboard
    try {
        const events = JSON.parse(localStorage.getItem('meridian_analytics_events') || '[]')
        const newEvent = {
            id: Math.random().toString(36),
            name,
            timestamp: new Date().toISOString(),
            payload
        }
        localStorage.setItem('meridian_analytics_events', JSON.stringify([newEvent, ...events].slice(0, 100))) // Keep last 100

        const event = new CustomEvent('meridian-analytics', { detail: newEvent })
        window.dispatchEvent(event)
    } catch (e) {
        console.error("Analytics Error", e)
    }
}
