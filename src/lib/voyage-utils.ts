import voyagesData from "@/data/voyages.json"

export interface Voyage {
    id: string
    title: string
    location: string
    price: number
    nights: number
    rating: number
    image: string
    ship: string
    itinerary: string[]
    coordinates: {
        lat: number
        lng: number
    }
}

// Map regions to the robust local assets we successfully established
// Map regions to the robust local assets we successfully established
const COMPONENT_IMAGE_MAP: Record<string, string> = {
    "Alaska": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
    "Europe": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=3303&auto=format&fit=crop", // Venice/Rome
    "Norway": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2070&auto=format&fit=crop",
    "Scandinavia": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2070&auto=format&fit=crop",  // Reuse Norway
    "Caribbean": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2070&auto=format&fit=crop",
    "South Pacific": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2070&auto=format&fit=crop", // Reuse Caribbean (tropical)
    "Hawaii": "https://images.unsplash.com/photo-1542259695-18a27daeeafa?q=80&w=2070&auto=format&fit=crop",
    "Mexico": "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?q=80&w=2074&auto=format&fit=crop",
    "Asia": "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2070&auto=format&fit=crop", // Japan
    "Australia": "https://images.unsplash.com/photo-1523482580638-016775bc43dd?q=80&w=2070&auto=format&fit=crop",
    "Antarctica": "https://images.unsplash.com/photo-1516977621718-472e382d6d02?q=80&w=2938&auto=format&fit=crop",
    "Arctic": "https://images.unsplash.com/photo-1516977621718-472e382d6d02?q=80&w=2938&auto=format&fit=crop"    // Reuse Antarctica (Polar)
}

export function getVoyages(): Voyage[] {
    return voyagesData.map((v) => {
        // Determine the best image match
        let imagePath = COMPONENT_IMAGE_MAP[v.region] || "/images/europe.jpg"

        // granular override for Norway if available
        if (v.title.includes("Fjords") || (v.itinerary && v.itinerary.includes("Bergen"))) {
            imagePath = COMPONENT_IMAGE_MAP["Norway"]
        }

        return {
            id: v.voyage_id,
            title: v.title,
            location: v.region,
            price: v.base_price_usd,
            nights: v.duration_nights,
            rating: v.rating,
            image: imagePath,
            ship: v.ship_name,
            itinerary: v.itinerary || [],
            coordinates: v.coordinates
        }
    })
}
