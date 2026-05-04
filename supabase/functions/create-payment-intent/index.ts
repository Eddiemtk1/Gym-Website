import Stripe from 'npm:stripe@^14.0.0';

// 1. Initialize Stripe natively
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  // This line tells Stripe to use standard web requests instead of Node.js requests
  httpClient: Stripe.createFetchHttpClient(),
});

// 2. Use the modern, built-in Deno server
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { planId } = await req.json();

    const prices: Record<string, number> = {
      gold: 2500,     // £25.00
      platinum: 5000, // £50.00
      diamond: 9900   // £99.00
    };
    
    // Default to diamond (9900) if something goes wrong
    const amount = prices[planId?.toLowerCase()] || 9900; 

    // Create the Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true },
    });

    // Send the secret back to the frontend
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: corsHeaders });
  }
});