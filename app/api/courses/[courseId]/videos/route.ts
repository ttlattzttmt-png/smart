import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST add video to course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const { title, description, url, duration, order } = await request.json()

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: 'العنوان و URL مطلوبان' },
        { status: 400 }
      )
    }

    const video = await prisma.video.create({
      data: {
        courseId,
        title,
        description: description || '',
        url,
        duration: duration || '00:00',
        order: order || 1,
      },
    })

    // Update course videosCount
    await prisma.course.update({
      where: { id: courseId },
      data: {
        videosCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(
      { success: true, data: video },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إضافة الفيديو' },
      { status: 500 }
    )
  }
}

// PUT update video
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; videoId: string }> }
) {
  try {
    const { title, description, url, duration, order } = await request.json()
    const { videoId } = await params

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(url && { url }),
        ...(duration && { duration }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json({ success: true, data: video })
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تحديث الفيديو' },
      { status: 500 }
    )
  }
}

// DELETE video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; videoId: string }> }
) {
  try {
    const { videoId, courseId } = await params

    await prisma.video.delete({
      where: { id: videoId },
    })

    // Decrement course videosCount
    await prisma.course.update({
      where: { id: courseId },
      data: {
        videosCount: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json({ success: true, message: 'تم حذف الفيديو بنجاح' })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حذف الفيديو' },
      { status: 500 }
    )
  }
}
