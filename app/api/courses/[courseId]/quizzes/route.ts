import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST add quiz to course
export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId
    const { title, description, type, questions, duration, videoId } =
      await request.json()

    if (!title || !type || !questions) {
      return NextResponse.json(
        { success: false, error: 'العنوان والنوع والأسئلة مطلوبة' },
        { status: 400 }
      )
    }

    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        videoId: videoId || null,
        title,
        type,
        questions: JSON.stringify(questions),
        duration: duration || 30,
      },
    })

    // Update course quizzesCount
    await prisma.course.update({
      where: { id: courseId },
      data: {
        quizzesCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(
      { success: true, data: quiz },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إضافة الاختبار' },
      { status: 500 }
    )
  }
}

// PUT update quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string; quizId: string } }
) {
  try {
    const { title, description, type, questions, duration } =
      await request.json()
    const quizId = params.quizId

    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(questions && { questions: JSON.stringify(questions) }),
        ...(duration && { duration }),
      },
    })

    return NextResponse.json({ success: true, data: quiz })
  } catch (error) {
    console.error('Error updating quiz:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تحديث الاختبار' },
      { status: 500 }
    )
  }
}

// DELETE quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string; quizId: string } }
) {
  try {
    const quizId = params.quizId
    const courseId = params.courseId

    await prisma.quiz.delete({
      where: { id: quizId },
    })

    // Decrement course quizzesCount
    await prisma.course.update({
      where: { id: courseId },
      data: {
        quizzesCount: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json({ success: true, message: 'تم حذف الاختبار بنجاح' })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حذف الاختبار' },
      { status: 500 }
    )
  }
}
