import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "../../../lib/mongodb"
import Link from "../../../models/Link"
import { auth } from "../../../lib/firebase-admin"

export async function GET(req: NextRequest) {
  await dbConnect()

  try {
    // Fetch total users from Firebase
    const { users } = await auth.listUsers(1000)
    const totalUsers = users.length

    // Fetch total links from MongoDB
    const totalLinks = await Link.countDocuments()

    // Generate growth data for the last 6 months
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const growthData = []

    for (let d = sixMonthsAgo; d <= now; d.setMonth(d.getMonth() + 1)) {
      const month = d.toLocaleString("default", { month: "short" })
      const year = d.getFullYear()
      const userCount = users.filter((user) => new Date(user.metadata.creationTime) <= d).length
      const linkCount = await Link.countDocuments({ createdAt: { $lte: d } })
      growthData.push({ name: `${month} ${year}`, users: userCount, links: linkCount })
    }

    console.log("Total Users:", totalUsers)
    console.log("Total Links:", totalLinks)
    console.log("Growth Data:", growthData)

    return NextResponse.json({ totalUsers, totalLinks, growthData })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

