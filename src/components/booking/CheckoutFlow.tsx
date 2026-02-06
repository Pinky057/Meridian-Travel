"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, CreditCard, User, ShieldCheck, Loader2, Wine, Wifi, Star, Sparkles, MapPin, Ticket } from "lucide-react"
import { trackEvent } from "@/components/DebugOverlay"
import { cn } from "@/lib/utils"
import { EXCURSIONS, Excursion } from "@/data/excursions"

interface CheckoutFlowProps {
    voyage: any
    stateroom: any
    onComplete: () => void
    onCancel: () => void
}

type Step = 'review' | 'guest' | 'upsell' | 'excursion' | 'payment' | 'success' // Added 'excursion'
type PackageTier = 'standard' | 'plus' | 'premier'

export function CheckoutFlow({ voyage, stateroom, onComplete, onCancel }: CheckoutFlowProps) {
    const [step, setStep] = useState<Step>('review')
    const [isLoading, setIsLoading] = useState(false)
    const [guestInfo, setGuestInfo] = useState({ firstName: '', lastName: '', email: '' })
    const [receiptId, setReceiptId] = useState<string>('')
    const [selectedPackage, setSelectedPackage] = useState<PackageTier>('standard')
    const [selectedExcursions, setSelectedExcursions] = useState<string[]>([])

    // Pricing Constants
    const PRICES = {
        standard: 0,
        plus: 50 * voyage.nights,
        premier: 80 * voyage.nights
    }

    // Get available excursions for this voyage
    const availableExcursions = voyage.itinerary
        ? voyage.itinerary.flatMap((port: string) => EXCURSIONS[port] || [])
        : []

    const excursionCost = selectedExcursions.reduce((total, id) => {
        const excursion = availableExcursions.find((e: Excursion) => e.id === id)
        return total + (excursion ? excursion.price : 0)
    }, 0)

    const totalCost = stateroom.price + PRICES[selectedPackage] + excursionCost

    // Handlers
    const handleNext = () => {
        if (step === 'review') {
            trackEvent('checkout_start', { step: 1 })
            setStep('guest')
        } else if (step === 'guest') {
            if (!guestInfo.firstName || !guestInfo.email) return
            trackEvent('checkout_progress', { step: 2 })
            setStep('upsell')
        } else if (step === 'upsell') {
            trackEvent('checkout_progress', { step: 3, package: selectedPackage })
            // Only go to excursions if there are any available
            if (availableExcursions.length > 0) {
                setStep('excursion')
            } else {
                setStep('payment')
            }
        } else if (step === 'excursion') {
            trackEvent('checkout_progress', { step: 4, excursions_count: selectedExcursions.length })
            setStep('payment')
        }
    }

    const handleBack = () => {
        if (step === 'guest') setStep('review')
        if (step === 'upsell') setStep('guest')
        if (step === 'excursion') setStep('upsell')
        if (step === 'payment') {
            setStep(availableExcursions.length > 0 ? 'excursion' : 'upsell')
        }
    }

    const handlePayment = () => {
        setIsLoading(true)
        trackEvent('checkout_progress', { step: 5 })
        const newReceiptId = Math.floor(Math.random() * 1000000).toString()

        // Save to LocalStorage for Admin Dashboard
        const bookingData = {
            id: newReceiptId,
            date: new Date().toISOString(),
            guest: guestInfo,
            voyage: {
                title: voyage.title,
                id: voyage.id,
                region: voyage.location
            },
            package: selectedPackage,
            excursions: selectedExcursions.length,
            totalPaid: totalCost,
            status: 'confirmed'
        }

        const existingBookings = JSON.parse(localStorage.getItem('meridian_bookings') || '[]')
        localStorage.setItem('meridian_bookings', JSON.stringify([bookingData, ...existingBookings]))

        setTimeout(() => {
            setIsLoading(false)
            setStep('success')
            trackEvent('purchase', {
                value: totalCost,
                currency: 'USD',
                voyage_id: voyage.id,
                package: selectedPackage
            })
            setReceiptId(newReceiptId)
        }, 2000)
    }

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Progress Stepper */}
            <div className="flex justify-between mb-4 px-4 flex-shrink-0">
                {['Review', 'Guest', 'Packages', 'Excursions', 'Payment', 'Done'].map((label, i) => {
                    // Filter out Excursions from stepper if none available, but simpler to just leave it 
                    // or purely use logic. For simplicity in demo, we keep it but it might be skipped logic-wise.
                    // A cleaner way for the stepper:
                    const steps: Step[] = ['review', 'guest', 'upsell', 'excursion', 'payment', 'success']
                    const currentIdx = steps.indexOf(step)
                    const thisStepIdx = i

                    const active = thisStepIdx <= currentIdx
                    return (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <div className={cn(
                                "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-colors duration-500",
                                active ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-400"
                            )}>
                                {thisStepIdx < currentIdx ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : i + 1}
                            </div>
                            <span className={cn("text-[10px] md:text-xs font-medium hidden md:block", active ? "text-sky-900" : "text-slate-400")}>{label}</span>
                        </div>
                    )
                })}
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* STEP 1: REVIEW */}
                {step === 'review' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-xl font-bold text-slate-900">Trip Summary</h3>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Voyage</span>
                                <span className="font-medium text-slate-900">{voyage.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Cabin</span>
                                <span className="font-medium text-slate-900">{stateroom.type} ({stateroom.id})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Duration</span>
                                <span className="font-medium text-slate-900">{voyage.nights} Nights</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-lg font-bold px-2">
                            <span className="text-slate-900">Base Fare</span>
                            <span className="text-slate-900">${stateroom.price}</span>
                        </div>
                    </div>
                )}

                {/* STEP 2: GUEST */}
                {step === 'guest' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-xl font-bold text-slate-900">Guest Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input value={guestInfo.firstName} onChange={e => setGuestInfo({ ...guestInfo, firstName: e.target.value })} placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input value={guestInfo.lastName} onChange={e => setGuestInfo({ ...guestInfo, lastName: e.target.value })} placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={guestInfo.email} onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })} placeholder="jane@example.com" />
                        </div>
                    </div>
                )}

                {/* STEP 3: UPSELL (NEW) */}
                {step === 'upsell' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-xl font-bold text-slate-900">Customize Your Experience</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Standard */}
                            <div
                                onClick={() => setSelectedPackage('standard')}
                                className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105", selectedPackage === 'standard' ? "border-sky-600 bg-sky-50" : "border-slate-100")}
                            >
                                <div className="text-center mb-2"><span className="text-sm font-bold uppercase tracking-wider text-slate-500">Standard</span></div>
                                <div className="text-center text-2xl font-bold mb-4">Included</div>
                                <ul className="text-xs text-slate-600 space-y-2">
                                    <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Cruise Fare</li>
                                    <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Dining</li>
                                </ul>
                            </div>

                            {/* Plus */}
                            <div
                                onClick={() => setSelectedPackage('plus')}
                                className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 relative overflow-hidden", selectedPackage === 'plus' ? "border-sky-600 bg-sky-50" : "border-slate-100")}
                            >
                                <div className="absolute top-0 right-0 bg-sky-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>
                                <div className="text-center mb-2"><span className="text-sm font-bold uppercase tracking-wider text-sky-600">Plus</span></div>
                                <div className="text-center text-2xl font-bold mb-4">+${PRICES.plus}</div>
                                <ul className="text-xs text-slate-600 space-y-2">
                                    <li className="flex items-center gap-2"><Wifi className="w-3 h-3 text-sky-500" /> Wi-Fi Included</li>
                                    <li className="flex items-center gap-2"><Wine className="w-3 h-3 text-pink-500" /> Drinks Package</li>
                                </ul>
                            </div>

                            {/* Premier */}
                            <div
                                onClick={() => setSelectedPackage('premier')}
                                className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105", selectedPackage === 'premier' ? "border-purple-600 bg-purple-50" : "border-slate-100")}
                            >
                                <div className="text-center mb-2"><span className="text-sm font-bold uppercase tracking-wider text-purple-600">Premier</span></div>
                                <div className="text-center text-2xl font-bold mb-4">+${PRICES.premier}</div>
                                <ul className="text-xs text-slate-600 space-y-2">
                                    <li className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-purple-500" /> Everything in Plus</li>
                                    <li className="flex items-center gap-2"><Star className="w-3 h-3 text-yellow-500" /> Specialty Dining</li>
                                    <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> Photos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                {/* STEP 4: EXCURSIONS (NEW) */}
                {step === 'excursion' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-xl font-bold text-slate-900">Shore Excursions</h3>
                        <p className="text-slate-500 text-sm">Enhance your port visits with these curated experiences.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableExcursions.map((excursion: Excursion) => {
                                const isSelected = selectedExcursions.includes(excursion.id)
                                return (
                                    <div
                                        key={excursion.id}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedExcursions(prev => prev.filter(id => id !== excursion.id))
                                            } else {
                                                setSelectedExcursions(prev => [...prev, excursion.id])
                                            }
                                        }}
                                        className={cn(
                                            "flex flex-col rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:shadow-md",
                                            isSelected ? "border-sky-600 bg-sky-50" : "border-slate-100 bg-white"
                                        )}
                                    >
                                        <div className="h-32 bg-slate-200 w-full relative">
                                            <img src={excursion.image} alt={excursion.title} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                                                {excursion.port}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{excursion.title}</h4>
                                                <span className="font-bold text-sky-700 text-sm">${excursion.price}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                                <Ticket className="w-3 h-3" />
                                                <span>{excursion.duration}</span>
                                            </div>
                                            <div className={cn(
                                                "text-center py-1.5 rounded text-xs font-bold transition-colors",
                                                isSelected ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {isSelected ? "ADDED" : "ADD TO BOOKING"}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}


                {/* STEP 4: PAYMENT */}
                {step === 'payment' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-xl font-bold text-slate-900">Payment</h3>

                        {/* Summary of charges */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Cabin Fare</span>
                                <span>${stateroom.price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Package ({selectedPackage.toUpperCase()})</span>
                                <span>+${PRICES[selectedPackage]}</span>
                            </div>
                            {selectedExcursions.length > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Excursions ({selectedExcursions.length})</span>
                                    <span>+${excursionCost}</span>
                                </div>
                            )}
                            <div className="h-px bg-slate-200 my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Due</span>
                                <span className="text-sky-600">${totalCost}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Card Number</Label>
                            <Input placeholder="0000 0000 0000 0000" className="font-mono" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="MM/YY" />
                                <Input placeholder="CVC" />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 5: SUCCESS */}
                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in-95 duration-500 py-10">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h2>
                        <p className="text-slate-500 max-w-sm">
                            You're all set for the {voyage.title}. Receipt #{receiptId} sent to {guestInfo.email}.
                        </p>
                        <div className="flex gap-2 text-xs font-mono bg-slate-100 p-2 rounded">
                            <span className="uppercase font-bold text-slate-500">{selectedPackage} PACKAGE</span>
                            {selectedExcursions.length > 0 && (
                                <>
                                    <span className="text-slate-300">|</span>
                                    <span className="uppercase font-bold text-slate-500">{selectedExcursions.length} EXCURSIONS</span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer - Sticky Bottom */}
            <div className="p-4 border-t bg-white sticky bottom-0 z-10 flex justify-between">
                {step === 'success' ? (
                    <Button onClick={onComplete} className="w-full bg-slate-900 hover:bg-slate-800">Return to Home</Button>
                ) : (
                    <>
                        <Button variant="ghost" onClick={step === 'review' ? onCancel : handleBack} disabled={isLoading}>
                            Back
                        </Button>

                        <Button
                            onClick={step === 'payment' ? handlePayment : handleNext}
                            className={cn("min-w-[140px]", step === 'payment' ? "bg-sky-600 hover:bg-sky-500" : "bg-slate-900 hover:bg-slate-800")}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : step === 'payment' ? `Pay $${totalCost}` : "Continue"}
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
