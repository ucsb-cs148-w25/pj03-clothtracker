import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

type ResponseData = {
  error?: string
  majors?: {
    id: number
    name: string
    college: string
  }[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const majors = await prisma.major.findMany({
      select: {
        id: true,
        name: true,
        college: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    res.json({ majors })
  } catch (error) {
    console.error('Error fetching majors:', error)
    res.status(500).json({ error: 'Failed to fetch majors' })
  }
}
