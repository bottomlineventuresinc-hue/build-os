import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { design_id, user_id, x, y, comment } = await request.json()

    if (!design_id || !user_id || x === undefined || y === undefined || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          design_id,
          user_id,
          x,
          y,
          comment,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, feedback: data })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const design_id = request.nextUrl.searchParams.get('design_id')

    if (!design_id) {
      return NextResponse.json(
        { error: 'design_id parameter required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('design_id', design_id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, feedback: data })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
