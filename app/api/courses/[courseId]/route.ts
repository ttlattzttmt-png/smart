import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        videos: {
          orderBy: { order: 'asc' },
        },
        quizzes: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'الدورة غير موجودة' },
        { status: 404 }
      )
    }

    // Parse questions from JSON string to array for quizzes
    const parsedCourse = {
      ...course,
      quizzes: course.quizzes.map((quiz: any) => ({
        ...quiz,
        questions: quiz.questions ? JSON.parse(quiz.questions) : [],
      })),
    }

    return NextResponse.json({ success: true, data: parsedCourse })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب الدورة' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const { title, description, grade, thumbnail, price } =
      await request.json()

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(grade && { grade }),
        ...(thumbnail && { thumbnail }),
        ...(price !== undefined && { price }),
      },
    })

    return NextResponse.json({ success: true, data: course })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تحديث الدورة' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params

    await prisma.course.delete({
      where: { id: courseId },
    })

    return NextResponse.json({ success: true, message: 'تم حذف الدورة بنجاح' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حذف الدورة' },
      { status: 500 }
    )
  }
}
