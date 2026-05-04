import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@12.1.1?target=deno'

// 1. Initialize Stripe securely using the secret key in your Supabase vault
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  // 2. Setup CORS so your HTML frontend is allowed to talk to this backend
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 3. Find out which plan the user clicked from the frontend request
    const { planId } = await req.json()

    // 4. Map the plans to their prices (Stripe requires prices in pennies/cents!)
    const prices: Record<string, number> = {
      gold: 2500,     // £25.00
      platinum: 5000, // £50.00
      diamond: 9900   // £99.00
    }
    const amount = prices[planId.toLowerCase()] || 9900 

    // 5. Ask Stripe to create a Payment Intent for this amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true }, 
    })

    // 6. Send the secret "unlock code" back to the frontend!
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: corsHeaders })
  }
})