import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("1. EDGE FUNCTION HIT! Waking up...");
    
    // Receive the dynamic data from your dashboard
    const payload = await req.json();
    console.log("2. Payload received from website:", payload);
    const { email, name, planName } = payload;

    // The Billing Logic
    let planPrice = "0.00";
    if (planName === "GOLD") planPrice = "25.00";
    if (planName === "PLATINUM") planPrice = "50.00";
    if (planName === "DIAMOND") planPrice = "99.00";

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const emailJsPayload = {
      service_id: Deno.env.get('EMAILJS_SERVICE_ID'),
      template_id: Deno.env.get('EMAILJS_TEMPLATE_ID'),
      user_id: Deno.env.get('EMAILJS_PUBLIC_KEY'),
      accessToken: Deno.env.get('EMAILJS_PRIVATE_KEY'),
      template_params: {
        email: email,
        user_name: name,
        new_plan_name: `${planName} PROTOCOL`,
        billing_cycle: "Monthly",
        effective_date: formattedDate,
        plan_price: planPrice,
        "cost_subtotal": planPrice,
        "cost_tax": "0.00",
        "cost_total": planPrice
      }
    };

    console.log("3. Sending to EmailJS API...");

    // Trigger EmailJS
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailJsPayload)
    });

    const responseText = await res.text();
    console.log("4. EmailJS Response:", responseText);

    if (!res.ok) {
        throw new Error(`EmailJS Rejected: ${responseText}`);
    }

    return new Response(JSON.stringify({ success: true, message: responseText }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    
  } catch (error) {
    console.error("5. CATCH ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders })
  }
})