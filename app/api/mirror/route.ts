// app/api/fetch-data/route.ts
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Replace with your endpoint
        const res = await fetch("http://192.168.29.229:5000/api/mirror", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // cache: "no-store" // if you always want fresh data
        })

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch data" }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: "Server error", details: String(error) }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
    //    save mirror
    } catch (error) {
        return NextResponse.json({ error: "Server error", details: String(error) }, { status: 500 })
    }
}