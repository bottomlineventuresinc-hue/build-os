import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Sanitize filename: remove spaces, special chars, keep only alphanumeric, dots, hyphens
    const sanitized = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase()
    
    const timestamp = Date.now()
    const fileName = `${userId}/${timestamp}-${sanitized}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('designs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('designs')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      fileUrl: publicUrl.publicUrl,
      fileName: fileName
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
