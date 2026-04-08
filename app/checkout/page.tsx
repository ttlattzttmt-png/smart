'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import type { Course } from '@/lib/types'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      if (!response.ok) throw new Error('فشل جلب بيانات الكورس')
      const data = await response.json()
      setCourse(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!course) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          userId: 'current-user-id', // TODO: Get from auth context
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'فشل إنشاء جلسة الدفع')
      }

      const data = await response.json()
      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h3 className="text-xl font-semibold mb-2">الكورس غير موجود</h3>
            <p className="text-muted-foreground">لم نتمكن من العثور على الكورس المطلوب</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">إتمام الشراء</h1>
        <p className="text-muted-foreground">أكمل عملية الدفع للحصول على الكورس</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            تفاصيل الكورس
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-muted-foreground">{course.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{course.grade}</Badge>
                <span className="text-sm text-muted-foreground">
                  {course.videosCount} فيديو • {course.quizzesCount} اختبار
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{course.price} ج.م</div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <CreditCard className="ml-2 h-4 w-4" />
                ادفع الآن - {course.price} ج.م
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            الدفع آمن ومشفر بواسطة Stripe
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ما ستحصل عليه</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              الوصول الكامل لجميع الفيديوهات
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              حل جميع الاختبارات والتمارين
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              شهادة إتمام الكورس
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              دعم فني على مدار 24 ساعة
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}