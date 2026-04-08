import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@theengineer.com' },
    update: {},
    create: {
      email: 'admin@theengineer.com',
      name: 'المهندس أحمد',
      phone: '01000000000',
      governorate: 'القاهرة',
      grade: '',
      password: adminPassword,
      role: 'admin',
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create sample students
  const studentPassword = await bcrypt.hash('student123', 10)
  
  const student1 = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      name: 'محمد أحمد',
      phone: '01111111111',
      parentPhone: '01222222222',
      governorate: 'الإسكندرية',
      grade: 'first',
      password: studentPassword,
      role: 'student',
    },
  })

  const student2 = await prisma.user.upsert({
    where: { email: 'sara@test.com' },
    update: {},
    create: {
      email: 'sara@test.com',
      name: 'سارة محمود',
      phone: '01333333333',
      parentPhone: '01444444444',
      governorate: 'الجيزة',
      grade: 'second',
      password: studentPassword,
      role: 'student',
    },
  })

  console.log('✅ Created sample students')

  // Create sample courses
  const course1 = await prisma.course.create({
    data: {
      title: 'الرياضيات - الصف الأول الثانوي',
      description: 'شرح شامل لمنهج الرياضيات للصف الأول الثانوي',
      grade: 'first',
      price: 500,
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'الرياضيات - الصف الثاني الثانوي',
      description: 'شرح شامل لمنهج الرياضيات للصف الثاني الثانوي',
      grade: 'second',
      price: 600,
    },
  })

  console.log('✅ Created sample courses')

  // Create sample videos
  const video1 = await prisma.video.create({
    data: {
      courseId: course1.id,
      title: 'مقدمة في الجبر',
      description: 'شرح أساسيات الجبر والمعادلات الخطية',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '45:00',
      order: 1,
    },
  })

  console.log('✅ Created sample videos')

  // Create sample quiz
  const questions = [
    {
      id: 'q1',
      text: 'ما هو حل المعادلة: 2x + 3 = 7',
      options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
      correctAnswer: 1,
    },
    {
      id: 'q2',
      text: 'إذا كان 3x - 5 = 10، فما قيمة x؟',
      options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
      correctAnswer: 2,
    },
  ]

  await prisma.quiz.create({
    data: {
      courseId: course1.id,
      videoId: video1.id,
      title: 'اختبار الجبر الأساسي',
      type: 'video',
      duration: 15,
      questions: JSON.stringify(questions),
    },
  })

  console.log('✅ Created sample quiz')

  // Create access code
  await prisma.accessCode.create({
    data: {
      code: 'COURSE-001',
      courseId: course1.id,
      studentId: student1.id,
      isUsed: true,
      usedAt: new Date(),
    },
  })

  console.log('✅ Created sample access code')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
