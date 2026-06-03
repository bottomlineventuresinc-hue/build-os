import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { feedback_id, user_id, reply_text } = await request.json()

    if (!feedback_id || !user_id || !reply_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('feedback_replies')
      .insert([
        {
          feedback_id,
          user_id,
          reply_text,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, reply: data })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const feedback_id = request.nextUrl.searchParams.get('feedback_id')

    if (!feedback_id) {
      return NextResponse.json(
        { error: 'feedback_id parameter required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('feedback_replies')
      .select('*')
      .eq('feedback_id', feedback_id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, replies: data })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
