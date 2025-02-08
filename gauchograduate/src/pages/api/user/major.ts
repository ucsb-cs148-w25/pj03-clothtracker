import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  error?: string
  major?: {
    id: number
    name: string
    college: string
    requirements: number[]
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { major: true }
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!user.majorId) {
      return res.status(404).json({ error: "Major not set for this user" })
    }

    const major = user.major
    if (!major) {
      return res.status(404).json({ error: "Major not found" })
    }

    // Convert the JSON requirements field to number[]
    const requirements = major.requirements as number[];

    res.json({ 
      major: {
        id: major.id,
        name: major.name,
        college: major.college,
        requirements
      }
    })
  } catch (error) {
    console.error('Error fetching user major:', error)
    res.status(500).json({ error: "Failed to fetch user major" })
  }
}
