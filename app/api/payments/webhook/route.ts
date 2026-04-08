import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const sig = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message)
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const courseId = session.metadata?.courseId
      const userId = session.metadata?.userId

      if (courseId && userId) {
        // Generate access code
        const accessCode = `COURSE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

        // Create access code in database
        await prisma.accessCode.create({
          data: {
            code: accessCode,
            courseId,
            studentId: userId,
            isUsed: false,
          },
        })

        console.log(`Payment successful! Access code ${accessCode} created for user ${userId} and course ${courseId}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}