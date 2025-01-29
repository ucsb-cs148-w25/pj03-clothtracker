import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

type ResponseData = {
  error?: string
  course?: {
    id: number
    quarter: number
    course_id: string
    title: string
    description: string
    subject_area: string
    units: number | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    general_ed: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prerequisites: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unlocks: any
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid course ID' })
  }

  try {
    const courseId = parseInt(id)
    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'Course ID must be a number' })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.json({ course })
  } catch (error) {
    console.error('Error fetching course:', error)
    res.status(500).json({ error: 'Failed to fetch course' })
  }
}
