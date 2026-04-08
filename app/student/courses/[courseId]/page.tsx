'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Play, CheckCircle, Circle, FileQuestion, Clock, ChevronRight, Lock } from 'lucide-react'
import type { Course, Video, Quiz } from '@/lib/types'

export default function CourseViewPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params)
  const { user } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [resolvedParams.courseId])

  const fetchCourseData = async () => {
    try {
      setIsLoading(true)

      // Fetch course details
      const courseResponse = await fetch(`/api/courses/${resolvedParams.courseId}`)
      if (!courseResponse.ok) throw new Error('فشل جلب بيانات الكورس')
      const courseData = await courseResponse.json()
      setCourse(courseData.data)
      setVideos(courseData.data.videos || [])
      setQuizzes(courseData.data.quizzes || [])

      // Check access - for now, allow all courses (in production, check access codes)
      setHasAccess(true)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  const currentVideo = selectedVideo
    ? videos.find(v => v.id === selectedVideo)
    : videos[0]

  const videoQuiz = quizzes.find(q => q.videoId === currentVideo?.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold mb-2">الكورس غير موجود</h2>
            <p className="text-muted-foreground mb-4">{error || 'لم يتم العثور على هذا الكورس'}</p>
            <Button asChild>
              <Link href="/student/courses">العودة للكورسات</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">هذا الكورس غير مفعل</h2>
            <p className="text-muted-foreground mb-4">تحتاج إلى كود تفعيل للوصول لهذا الكورس</p>
            <Button asChild>
              <Link href="/student/activate">تفعيل كود</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/student/courses" className="hover:text-foreground">كورساتي</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{course.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          {currentVideo && (
            <>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={currentVideo.url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{currentVideo.title}</CardTitle>
                      <CardDescription className="mt-2">{currentVideo.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {currentVideo.duration}
                    </Badge>
                  </div>
                </CardHeader>
                {videoQuiz && (
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-3">
                        <FileQuestion className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{videoQuiz.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {videoQuiz.questions.length} سؤال - {videoQuiz.duration} دقيقة
                          </p>
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/student/quiz/${videoQuiz.id}`}>
                          ابدأ الاختبار
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </>
          )}
        </div>

        {/* Video List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>محتوى الكورس</CardTitle>
              <CardDescription>
                {videos.length} فيديو متاح
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {videos.map((video, index) => {
                  const isCurrent = video.id === currentVideo?.id

                  return (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video.id)}
                      className={`w-full flex items-center gap-3 p-4 text-right transition-colors hover:bg-muted ${
                        isCurrent ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCurrent ? (
                          <Play className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isCurrent ? 'text-primary' : ''}`}>
                          {index + 1}. {video.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{video.duration}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Course Quizzes */}
          {quizzes.filter(q => q.type !== 'video').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>الاختبارات</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {quizzes.filter(q => q.type !== 'video').map((quiz) => {
                    const quizResult = progress?.quizScores.find(s => s.quizId === quiz.id)

                    return (
                      <div key={quiz.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <FileQuestion className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{quiz.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {quiz.questions.length} سؤال
                            </p>
                          </div>
                        </div>
                        {quizResult ? (
                          <Badge variant={quizResult.score >= 60 ? 'default' : 'destructive'}>
                            {quizResult.score}%
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/student/quiz/${quiz.id}`}>ابدأ</Link>
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
