"use client"

import dynamic from 'next/dynamic'
import { Voyage } from '@/lib/voyage-utils'
import { Loader2 } from 'lucide-react'

const VoyageMapClient = dynamic(() => import('./VoyageMapClient'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] w-full bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
            <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-medium">Loading Map...</span>
            </div>
        </div>
    )
})

interface VoyageMapProps {
    voyages: Voyage[]
    onVoyageSelect: (voyage: Voyage) => void
    selectedVoyageId?: string | null
}

export function VoyageMap(props: VoyageMapProps) {
    return <VoyageMapClient {...props} />
}
