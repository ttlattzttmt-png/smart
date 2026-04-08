import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبين' },
        { status: 400 }
      )
    }

    console.log('Attempting to find user with email:', email)
    const user = await prisma.user.findUnique({
      where: { email },
    })

    console.log('User found:', !!user)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني غير مسجل' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    )
  }
}
