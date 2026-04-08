import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST submit quiz result
export async function POST(request: NextRequest) {
  try {
    const { quizId, studentId, score, answers } = await request.json()

    if (!quizId || !studentId || score === undefined) {
      return NextResponse.json(
        { success: false, error: 'معرف الاختبار والطالب والنتيجة مطلوبة' },
        { status: 400 }
      )
    }

    const result = await prisma.quizResult.create({
      data: {
        quizId,
        studentId,
        score,
        answers: JSON.stringify(answers || []),
      },
    })

    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting quiz result:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حفظ نتيجة الاختبار' },
      { status: 500 }
    )
  }
}

// GET quiz results for student
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')
    const quizId = searchParams.get('quizId')

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'معرف الطالب مطلوب' },
        { status: 400 }
      )
    }

    const where = { studentId }
    if (quizId) {
      Object.assign(where, { quizId })
    }

    const results = await prisma.quizResult.findMany({
      where,
      include: { quiz: true },
    })

    // Parse answers from JSON string to array
    const parsedResults = results.map((result: any) => ({
      ...result,
      answers: result.answers ? JSON.parse(result.answers) : [],
    }))

    return NextResponse.json({ success: true, data: parsedResults })
  } catch (error) {
    console.error('Error fetching quiz results:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب النتائج' },
      { status: 500 }
    )
  }
}
