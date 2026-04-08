import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// POST create access code
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params

    // Generate random access code
    const code = `COURSE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

    const accessCode = await prisma.accessCode.create({
      data: {
        code,
        courseId,
        isUsed: false,
      },
    })

    return NextResponse.json(
      { success: true, data: accessCode },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating access code:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إنشاء رمز الوصول' },
      { status: 500 }
    )
  }
}

// GET access codes for course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params

    const accessCodes = await prisma.accessCode.findMany({
      where: { courseId },
    })

    return NextResponse.json({ success: true, data: accessCodes })
  } catch (error) {
    console.error('Error fetching access codes:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب رموز الوصول' },
      { status: 500 }
    )
  }
}

// PUT use access code
export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { code, studentId } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'رمز الوصول مطلوب' },
        { status: 400 }
      )
    }

    const accessCode = await prisma.accessCode.findUnique({
      where: { code },
    })

    if (!accessCode) {
      return NextResponse.json(
        { success: false, error: 'رمز الوصول غير صحيح' },
        { status: 404 }
      )
    }

    if (accessCode.isUsed) {
      return NextResponse.json(
        { success: false, error: 'رمز الوصول مستخدم بالفعل' },
        { status: 400 }
      )
    }

    const updatedCode = await prisma.accessCode.update({
      where: { code },
      data: {
        isUsed: true,
        studentId: studentId || null,
        usedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, data: updatedCode })
  } catch (error) {
    console.error('Error using access code:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء استخدام الرمز' },
      { status: 500 }
    )
  }
}
