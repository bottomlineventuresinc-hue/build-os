import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { title, description, image_url, file_url, user_id } = await request.json()

    const { data, error } = await supabase
      .from('designs')
      .insert([
        { 
          title, 
          description, 
          image_url, 
          file_url, 
          user_id,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      designId: data.id, 
      design: data 
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
