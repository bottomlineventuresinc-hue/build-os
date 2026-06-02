import { sendMagicLinkEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const testLink = `https://buildos.app/auth/callback?code=test123&type=recovery`
    
    const result = await sendMagicLinkEmail(email, testLink)
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent!',
      result
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}
