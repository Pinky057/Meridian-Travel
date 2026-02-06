export interface Excursion {
    id: string
    title: string
    description: string
    price: number
    image: string
    port: string
    duration: string
}

export const EXCURSIONS: Record<string, Excursion[]> = {
    // Alaska
    "Juneau": [
        {
            id: "jun-01",
            title: "Mendenhall Glacier Helicopter Tour",
            description: "Fly over the massive ice field and land on the glacier for a guided walk.",
            price: 349,
            image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop",
            port: "Juneau",
            duration: "3 Hours"
        },
        {
            id: "jun-02",
            title: "Whale Watching & Wildlife Quest",
            description: "Guaranteed whale sightings on a luxury catamaran.",
            price: 189,
            image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1000&auto=format&fit=crop",
            port: "Juneau",
            duration: "4 Hours"
        }
    ],
    "Skagway": [
        {
            id: "skg-01",
            title: "White Pass & Yukon Route Railroad",
            description: "A scenic vintage train ride through the mountains.",
            price: 149,
            image: "https://images.unsplash.com/photo-1596568269784-5f532a74c433?q=80&w=1000&auto=format&fit=crop",
            port: "Skagway",
            duration: "3.5 Hours"
        }
    ],
    "Ketchikan": [
        {
            id: "ket-01",
            title: "Misty Fjords Seaplane Exploration",
            description: "Soar over vertical granite cliffs and waterfalls.",
            price: 299,
            image: "https://images.unsplash.com/photo-1518182170546-07fa6ee049cb?q=80&w=1000&auto=format&fit=crop",
            port: "Ketchikan",
            duration: "2 Hours"
        }
    ],

    // Europe / Med
    "Rome": [
        {
            id: "rom-01",
            title: "Colosseum & Roman Forum VIP",
            description: "Skip-the-line access to ancient Rome's greatest monuments.",
            price: 129,
            image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop",
            port: "Rome",
            duration: "5 Hours"
        },
        {
            id: "rom-02",
            title: "Vatican Museums & Sistine Chapel",
            description: "Private guided tour of the Vatican's treasures.",
            price: 159,
            image: "https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=1000&auto=format&fit=crop",
            port: "Rome",
            duration: "4 Hours"
        }
    ],
    "Barcelona": [
        {
            id: "bcn-01",
            title: "Sagrada Familia & Gaudí Tour",
            description: "Explore the architectural masterpieces of Antoni Gaudí.",
            price: 99,
            image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop",
            port: "Barcelona",
            duration: "4 Hours"
        }
    ],
    "Athens": [
        {
            id: "ath-01",
            title: "Acropolis & Parthenon Ascent",
            description: "Climb to the ancient citadel overlooking the city.",
            price: 89,
            image: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=1000&auto=format&fit=crop",
            port: "Athens",
            duration: "3 Hours"
        }
    ],
    "Santorini": [
        {
            id: "san-01",
            title: "Oia Sunset & Wine Tasting",
            description: "Visit a local winery and watch the famous sunset.",
            price: 149,
            image: "https://images.unsplash.com/photo-1613395877344-13d4c2ce5d4d?q=80&w=1000&auto=format&fit=crop",
            port: "Santorini",
            duration: "4 Hours"
        }
    ],

    // Caribbean
    "Nassau": [
        {
            id: "nas-01",
            title: "Blue Lagoon Island Beach Day",
            description: "Relax on a secluded private island paradise.",
            price: 89,
            image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=1000&auto=format&fit=crop",
            port: "Nassau",
            duration: "5 Hours"
        }
    ],
    "St. Thomas": [
        {
            id: "stt-01",
            title: "Catamaran Snorkel & Sail",
            description: "Sail to Turtle Cove for an underwater adventure.",
            price: 119,
            image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=1000&auto=format&fit=crop",
            port: "St. Thomas",
            duration: "3.5 Hours"
        }
    ]
}
