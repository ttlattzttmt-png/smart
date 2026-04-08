'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Video, Play, Key, Loader2 } from 'lucide-react'
import type { Course } from '@/lib/types'

export default function StudentCoursesPage() {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])

  const fetchEnrolledCourses = async () => {
    try {
      setIsLoading(true)
      // Fetch all courses - in a real app, this would check against enrolled courses
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('فشل جلب الكورسات')
      const data = await response.json()
      
      // For now, show all courses. In production, filter by enrolled codes
      setEnrolledCourses(data.data || [])
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
      setEnrolledCourses([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">كورساتي</h1>
          <p className="text-muted-foreground">جميع الكورسات المتاحة</p>
        </div>
        <Button asChild>
          <Link href="/student/activate">
            <Key className="ml-2 h-4 w-4" />
            تفعيل كود جديد
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="py-3">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : enrolledCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                <BookOpen className="h-16 w-16 text-primary/50" />
              </div>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">التقدم</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      {course.videosCount || 0} فيديو
                    </span>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/checkout?courseId=${course.id}`}>
                    <Play className="ml-2 h-4 w-4" />
                    اشترِ الآن
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Key className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">لا توجد كورسات متاحة</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              للوصول إلى الكورسات، قم بشراء كود تفعيل من المدرس ثم أدخله هنا
            </p>
            <Button size="lg" asChild>
              <Link href="/student/activate">
                <Key className="ml-2 h-5 w-5" />
                تفعيل كود
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
