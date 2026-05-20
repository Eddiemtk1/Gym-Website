import Stripe from 'npm:stripe@^14.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { planId } = await req.json();

    const prices: Record<string, number> = {
      gold: 2500,
      platinum: 5000,
      diamond: 9900
    };
    
    const amount = prices[planId?.toLowerCase()] || 9900; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: corsHeaders });
  }
});