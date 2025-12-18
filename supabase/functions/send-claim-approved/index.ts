import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ClaimApprovedRequest {
  claimantName: string;
  claimantEmail: string;
  itemName: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-claim-approved function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { claimantName, claimantEmail, itemName }: ClaimApprovedRequest = await req.json();
    
    console.log(`Sending approval email to ${claimantEmail} for item: ${itemName}`);

    const emailResponse = await resend.emails.send({
      from: "Rover Search <easdlostandfound@gmail.com>",
      to: [claimantEmail],
      subject: "Your Lost Item Claim Has Been Approved!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #C70F2E; margin-bottom: 20px;">Great News, ${claimantName}!</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your claim for <strong>"${itemName}"</strong> has been approved!
          </p>
          
          <div style="background-color: #f5f5f5; border-left: 4px solid #C70F2E; padding: 15px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Pick-Up Information:</h3>
            <p style="margin: 5px 0; color: #555;"><strong>Location:</strong> Cafeteria Exit Doors</p>
            <p style="margin: 5px 0; color: #555;"><strong>Important:</strong> Please bring your Student ID when picking up your item.</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            If you have any questions, please contact us at <a href="mailto:lostandfound@eastonsd.org" style="color: #C70F2E;">lostandfound@eastonsd.org</a> or call (610) 730-0274.
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br>
            <strong>Rover Search - Lost & Found</strong><br>
            Easton Area School District
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-claim-approved function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
