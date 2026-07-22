import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { password, action, payload } = await req.json()
    const devPassword = Deno.env.get('DEV_PASSWORD')

    if (!devPassword || password !== devPassword) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'verify_dev') {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    if (action === 'create_listing') {
      const { name, price, image_url, available } = payload ?? {}
      const { data, error } = await supabase
        .from('listings')
        .insert({ name, price, image_url, available: available ?? true })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify({ listing: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update_listing') {
      const { id, ...updates } = payload ?? {}
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify({ listing: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'toggle_availability') {
      const { id, available } = payload ?? {}
      const { data, error } = await supabase
        .from('listings')
        .update({ available })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify({ listing: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete_listing') {
      const { id } = payload ?? {}
      const { error } = await supabase.from('listings').delete().eq('id', id)
      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'upload_image') {
      const { fileName, contentType, base64 } = payload ?? {}
      const binary = Uint8Array.from(atob(base64 as string), (c) => c.charCodeAt(0))
      const filePath = `listings/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, binary, { contentType, upsert: false })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath)
      return new Response(JSON.stringify({ url: data.publicUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
