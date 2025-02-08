import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserCourses } from "@/types/next-auth"

type ResponseData = {
  error?: string
  user?: {
    id: string
    majorId: number | null
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  const { majorId, firstQuarter } = req.body

  if (typeof majorId !== 'number') {
    return res.status(400).json({ error: "Major ID is required and must be a number" })
  }

  if (!firstQuarter || typeof firstQuarter !== 'string' || !/^\d{5}$/.test(firstQuarter)) {
    return res.status(400).json({ error: "First quarter must be a valid quarter code" })
  }

  try {
    // Verify the major exists
    const majorExists = await prisma.major.findUnique({
      where: { id: majorId }
    });

    if (!majorExists) {
      return res.status(400).json({ error: "Invalid major ID" });
    }

    // First get the current user to preserve their courses
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { courses: true }
    });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Parse the existing courses JSON and validate its structure
    const coursesData = currentUser.courses as unknown as UserCourses;
    
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        majorId,
        courses: {
          firstQuarter,
          courses: coursesData.courses
        } as unknown as Prisma.JsonObject
      },
      select: {
        id: true,
        majorId: true
      }
    })
    res.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ error: "Failed to update user profile" })
  }
}
