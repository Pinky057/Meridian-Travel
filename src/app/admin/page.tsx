"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, Calendar, ArrowLeft, Activity, MousePointer } from "lucide-react"
import Link from "next/link"

interface Booking {
    id: string
    date: string
    guest: {
        firstName: string
        lastName: string
        email: string
    }
    voyage: {
        title: string
        id: string
        region: string
    }
    package: string
    excursions: number
    totalPaid: number
    status: string
}

export default function AdminDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [events, setEvents] = useState<any[]>([])

    useEffect(() => {
        const storedBookings = localStorage.getItem('meridian_bookings')
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings))
        }

        const storedEvents = localStorage.getItem('meridian_analytics_events')
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents))
        }
    }, [])

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPaid, 0)

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500">Real-time booking overview</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Site
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
                            <DollarSign className="w-4 h-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Bookings</CardTitle>
                            <Calendar className="w-4 h-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{bookings.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Passengers</CardTitle>
                            <Users className="w-4 h-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{bookings.length * 2}</div> {/* Mock logic: avg 2 pax */}
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Tabs for Content */}
            <Tabs defaultValue="bookings" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="analytics">MarTech Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="bookings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm text-left">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50">
                                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Booking ID</th>
                                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Guest</th>
                                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Voyage</th>
                                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Package</th>
                                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Excursions</th>
                                                <th className="h-12 px-4 align-middle font-medium text-slate-500 text-right">Total</th>
                                                <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {bookings.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="p-4 text-center text-slate-500">
                                                        No bookings found. Go make some money!
                                                    </td>
                                                </tr>
                                            ) : (
                                                bookings.map((booking) => (
                                                    <tr key={booking.id} className="border-b transition-colors hover:bg-slate-50/50">
                                                        <td className="p-4 align-middle font-mono text-xs">{booking.id}</td>
                                                        <td className="p-4 align-middle">
                                                            <div className="font-medium">{booking.guest.firstName} {booking.guest.lastName}</div>
                                                            <div className="text-xs text-slate-500">{booking.guest.email}</div>
                                                        </td>
                                                        <td className="p-4 align-middle max-w-[200px] truncate" title={booking.voyage.title}>
                                                            {booking.voyage.title}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <Badge variant="outline" className="uppercase text-[10px]">
                                                                {booking.package}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            {booking.excursions > 0 ? (
                                                                <Badge variant="secondary" className="bg-sky-100 text-sky-700 hover:bg-sky-100">
                                                                    {booking.excursions} Added
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-slate-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4 align-middle text-right font-bold text-slate-700">
                                                            ${booking.totalPaid.toLocaleString()}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                                                Confirmed
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-sky-500" />
                                Event Stream
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full caption-bottom text-sm text-left">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-slate-50/50">
                                            <th className="h-12 px-4 align-middle font-medium text-slate-500">Time</th>
                                            <th className="h-12 px-4 align-middle font-medium text-slate-500">Event Name</th>
                                            <th className="h-12 px-4 align-middle font-medium text-slate-500">Payload Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="p-4 text-center text-slate-500">
                                                    No events tracked yet. Interact with the app!
                                                </td>
                                            </tr>
                                        ) : (
                                            events.map((event) => (
                                                <tr key={event.id} className="border-b transition-colors hover:bg-slate-50/50">
                                                    <td className="p-4 align-middle font-mono text-xs text-slate-500">
                                                        {new Date(event.timestamp).toLocaleTimeString()}
                                                    </td>
                                                    <td className="p-4 align-middle font-medium text-sky-700">
                                                        {event.name}
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <pre className="text-[10px] bg-slate-100 p-2 rounded overflow-x-auto max-w-lg">
                                                            {JSON.stringify(event.payload, null, 2)}
                                                        </pre>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
