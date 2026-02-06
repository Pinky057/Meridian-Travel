"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([])

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("meridian_favorites")
        if (saved) {
            setFavorites(JSON.parse(saved))
        }
    }, [])

    const toggleFavorite = (id: string) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter(fav => fav !== id)
            : [...favorites, id]

        setFavorites(newFavorites)
        localStorage.setItem("meridian_favorites", JSON.stringify(newFavorites))
    }

    return { favorites, toggleFavorite }
}
