"use client"

import { useState } from "react"
import { Search, Calendar, Users, MapPin, ArrowRight, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
// New imports for Stateroom Logic & Analytics
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { StateroomSelector } from "@/components/booking/StateroomSelector"
import { DebugOverlay, trackEvent } from "@/components/DebugOverlay"
// Import Checkout Flow
import { CheckoutFlow } from "@/components/booking/CheckoutFlow"

// Import Data Utilities
import { getVoyages } from "@/lib/voyage-utils"
import { useFavorites } from "@/hooks/useFavorites"
import { Heart } from "lucide-react"
import { VoyageMap } from "@/components/ui/VoyageMap"

// Load Real Data
const VOYAGES = getVoyages()

export default function Home() {
  const [location, setLocation] = useState("")
  const [date, setDate] = useState<Date>()
  const [guests, setGuests] = useState("2 Guests")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const { favorites, toggleFavorite } = useFavorites()

  // Checkout State
  const [selectedVoyage, setSelectedVoyage] = useState<any>(null)
  const [bookingStep, setBookingStep] = useState<'room' | 'checkout'>('room')
  const [selectedStateroom, setSelectedStateroom] = useState<any>(null)

  // Get unique locations for dropdown
  const uniqueLocations = Array.from(new Set(VOYAGES.map(v => v.location)))

  // Filter voyages based on  // Filter Logic
  const filteredVoyages = VOYAGES.filter(v => {
    const matchesLoc = location ? v.location === location : true
    const matchesFav = showFavoritesOnly ? favorites.includes(v.id) : true
    return matchesLoc && matchesFav
  })

  const handleSearch = () => {
    // This function is no longer directly used by the new search bar,
    // but kept for potential future use or if other parts of the app rely on it.
    trackEvent("search_executed", { query: location, guests: guests })
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <DebugOverlay />
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Meridian</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-slate-600"
              onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Destinations
            </Button>
            <Button
              variant="ghost"
              className="text-slate-600"
              onClick={() => document.getElementById('staterooms')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Staterooms
            </Button>
            <Button
              className="bg-slate-900 hover:bg-slate-800"
              onClick={() => {
                if (window.confirm("Simulate Sign In as Demo User?")) {
                  // This is a mock action for the demo
                  alert("Welcome back, Explorer!");
                }
              }}
            >
              Sign In
            </Button>

            {/* Admin Link (Hidden Gem) */}
            <Link href="/admin">
              <Button variant="outline" className="gap-2 border-slate-200">
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        {/* Abstract Background - clipped exclusively */}
        <div className="absolute inset-0 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1548191265-cc70d3d4bca3?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 z-10 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight max-w-4xl">
            Voyages designed for <span className="text-sky-400">every explorer.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl text-balance">
            Experience the world's most breathtaking destinations with accessible, premium comfort. Your journey begins here.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-full shadow-lg flex items-center gap-2 max-w-4xl mx-auto border border-slate-100">
            <div className="flex-1 flex items-center gap-2 px-4 border-r border-slate-200">
              <MapPin className="w-5 h-5 text-slate-400" />
              <select
                className="w-full bg-transparent outline-none text-slate-700 font-medium cursor-pointer"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Select Destination"
              >
                <option value="">All Destinations</option>
                <option value="Alaska">Alaska</option>
                <option value="Europe">Europe</option>
                <option value="Caribbean">Caribbean</option>
                <option value="Asia">Asia</option>
                <option value="Antarctica">Antarctica</option>
                <option value="Australia">Australia</option>
                <option value="South Pacific">South Pacific</option>
              </select>
            </div>

            <div className="mx-2">
              <Button
                variant={showFavoritesOnly ? "secondary" : "ghost"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={showFavoritesOnly ? "bg-red-50 text-red-600 hover:bg-red-100" : "text-slate-500"}
                aria-pressed={showFavoritesOnly}
              >
                <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
                Favorites ({favorites.length})
              </Button>
            </div>

            <Button className="rounded-full px-8 py-6 bg-sky-600 hover:bg-sky-500 text-lg shadow-sky-200 shadow-xl transition-all hover:scale-105">
              Search Voyages
            </Button>
          </div>
        </div>
      </section>



      {/* Featured Destinations */}
      <section className="py-24 bg-slate-50" id="destinations">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Curated Voyages</h2>
              <p className="text-slate-500">
                {filteredVoyages.length} {filteredVoyages.length === 1 ? 'voyage' : 'voyages'} found for your journey.
              </p>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="mb-12">
            <VoyageMap
              voyages={filteredVoyages}
              onVoyageSelect={(voyage) => {
                // Scroll to the specific card
                // We'll need to add IDs to the cards
                const element = document.getElementById(`voyage-card-${voyage.id}`)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  // Optional highlight effect
                  element.classList.add('ring-4', 'ring-sky-400')
                  setTimeout(() => element.classList.remove('ring-4', 'ring-sky-400'), 2000)
                }
              }}
            />
          </div>

          {filteredVoyages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredVoyages.map((voyage) => (
                <div
                  key={voyage.id}
                  id={`voyage-card-${voyage.id}`}
                  className="group cursor-pointer transition-all duration-300 rounded-2xl"
                  onClick={() => {
                    setSelectedVoyage(voyage)
                    trackEvent("view_content", { type: 'voyage', title: voyage.title, price: voyage.price })
                  }}
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative shadow-lg bg-slate-200">
                    <img
                      src={voyage.image}
                      alt={voyage.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/800x600/1e293b/ffffff?text=${encodeURIComponent(voyage.title)}`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />

                    {/* Heart Button */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm z-10 transition-transform active:scale-90">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(voyage.id)
                        }}
                        className="transition-transform active:scale-90"
                        aria-label={favorites.includes(voyage.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(voyage.id) ? "fill-red-500 text-red-500" : "text-slate-400"}`} />
                      </button>
                    </div>

                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-xs font-bold tracking-wider uppercase mb-1 opacity-80">{voyage.nights} Nights</p>
                      <h3 className="text-2xl font-bold">{voyage.title}</h3>
                    </div>

                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur text-slate-900 px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                        Select Dates
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm flex items-center">
                      <span className="text-yellow-400 mr-1">★</span> {voyage.rating}/5
                    </span>
                    <p className="font-bold text-slate-900">From ${voyage.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No voyages found</h3>
              <p className="text-slate-500">Try adjusting your search terms.</p>
            </div>
          )}
        </div>
      </section>

      {/* Staterooms Showcase */}
      <section className="py-24 bg-white" id="staterooms">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Sanctuaries at Sea</h2>
            <p className="text-slate-500 text-lg">
              Every stateroom is designed as a private retreat. From cozy interior cabins to expansive suites, find your perfect home away from home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "The Sanctuary",
                price: "From $3,400",
                desc: "Our most exclusive suites with private butler service.",
                img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2340&auto=format&fit=crop"
              },
              {
                title: "Veranda Suite",
                price: "From $2,100",
                desc: "Expansive private balconies with unbroken ocean views.",
                img: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?q=80&w=2340&auto=format&fit=crop"
              },
              {
                title: "Oceanview",
                price: "From $1,450",
                desc: "Large picture windows framing the passing scenery.",
                img: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2340&auto=format&fit=crop"
              },
              {
                title: "Interior Stateroom",
                price: "From $899",
                desc: "Quiet, comfortable retreats designed for deep rest.",
                img: "https://images.unsplash.com/photo-1555854743-e3c2f6f50921?q=80&w=2070&auto=format&fit=crop"
              }
            ].map((room, i) => (
              <div
                key={i}
                className="group cursor-pointer"
                onClick={() => {
                  document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })
                  // Optional: We could also set a state here to filter for this room type, 
                  // but for now, we'll just guide them to the booking grid.
                  setTimeout(() => alert(`To book the ${room.title}, please select a voyage below.`), 600)
                }}
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative shadow-md">
                  <img
                    src={room.img}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{room.title}</h3>
                    <p className="text-sm text-slate-200">{room.price}</p>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold border border-white px-4 py-2 rounded-full backdrop-blur-sm">View Voyages</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm">{room.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={!!selectedVoyage} onOpenChange={(open) => {
        if (!open) {
          setSelectedVoyage(null)
          setBookingStep('room')
          setSelectedStateroom(null)
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
          <DialogHeader className="px-6 py-4 border-b bg-white z-10">
            <DialogTitle className="text-2xl flex items-center gap-2">
              {bookingStep === 'room' ? (
                <><span>Select Stateroom</span><span className="text-slate-400 font-normal text-lg">for {selectedVoyage?.title}</span></>
              ) : (
                <span>{selectedStateroom ? 'Complete Booking' : 'Checkout'}</span>
              )}
            </DialogTitle>
            <DialogDescription>
              {bookingStep === 'room' ? "Choose your cabin from the deck plan below. Hover for details." : "Securely complete your reservation."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {bookingStep === 'room' ? (
              <StateroomSelector onSelect={(room) => {
                setSelectedStateroom(room)
              }} />
            ) : (
              <CheckoutFlow
                voyage={selectedVoyage}
                stateroom={selectedStateroom}
                onCancel={() => setBookingStep('room')}
                onComplete={() => {
                  setSelectedVoyage(null)
                  setBookingStep('room')
                }}
              />
            )}
          </div>

          {/* Footer for Room Selection Only */}
          {bookingStep === 'room' && (
            <div className="flex justify-end gap-3 p-6 border-t bg-white z-10 sticky bottom-0">
              <Button variant="outline" onClick={() => setSelectedVoyage(null)}>Cancel</Button>
              <Button
                className="bg-sky-600 hover:bg-sky-500"
                disabled={!selectedStateroom}
                onClick={() => {
                  if (selectedStateroom) {
                    trackEvent("add_to_cart", {
                      cabin: selectedStateroom.id,
                      type: selectedStateroom.type,
                      price: selectedStateroom.price
                    })
                    setBookingStep('checkout')
                  }
                }}
              >
                Continue to Checkout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
