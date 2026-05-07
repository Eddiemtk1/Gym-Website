import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Receive the basic data from your dashboard
    const { email, name, planName } = await req.json()

    // 2. The Billing Logic (Match the plan to the price)
    let planPrice = "0.00";
    if (planName === "GOLD") planPrice = "25.00";
    if (planName === "PLATINUM") planPrice = "50.00";
    if (planName === "DIAMOND") planPrice = "99.00";

    // 3. Generate the Effective Date (Today)
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    }); // e.g., "14 Oct 2026"

    // 4. Build the payload matching your exact HTML {{variables}}
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
        cost: {
          subtotal: planPrice,
          tax: "0.00", 
          total: planPrice
        }
      }
    };

    // 5. Trigger the EmailJS API
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailJsPayload)
    })

    const responseText = await res.text();
    return new Response(JSON.stringify({ success: true, message: responseText }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, headers: corsHeaders 
    })
  }
})