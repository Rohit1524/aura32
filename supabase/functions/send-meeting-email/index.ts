import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingEmailRequest {
  title: string;
  date: string;
  time: string;
  duration: string;
  description: string;
  attendees: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, date, time, duration, description, attendees }: MeetingEmailRequest = await req.json();

    console.log("Sending meeting invite for:", title);
    console.log("Attendees:", attendees);

    const emailPromises = attendees.map(async (email) => {
      return resend.emails.send({
        from: "AURA <onboarding@resend.dev>",
        to: [email.trim()],
        subject: `Meeting Invitation: ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
              Meeting Invitation
            </h1>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #333;">${title}</h2>
              
              <div style="margin: 15px 0;">
                <strong style="color: #1e40af;">📅 Date:</strong> ${new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <div style="margin: 15px 0;">
                <strong style="color: #1e40af;">⏰ Time:</strong> ${time}
              </div>
              
              <div style="margin: 15px 0;">
                <strong style="color: #1e40af;">⏱️ Duration:</strong> ${duration} minutes
              </div>
              
              ${description ? `
                <div style="margin: 15px 0;">
                  <strong style="color: #1e40af;">📝 Description:</strong>
                  <p style="margin: 5px 0 0 0;">${description}</p>
                </div>
              ` : ''}
            </div>
            
            <div style="background: #eff6ff; padding: 15px; border-left: 4px solid #1e40af; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;">
                <strong>📧 Reminders:</strong> You will receive automatic reminders 24 hours and 1 hour before the meeting.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              This invitation was sent by AURA Business Management Platform
            </p>
          </div>
        `,
      });
    });

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Email results - Successful: ${successful}, Failed: ${failed}`);

    if (failed > 0) {
      console.error("Some emails failed to send:", 
        results.filter(r => r.status === 'rejected').map(r => (r as PromiseRejectedResult).reason)
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful,
        failed: failed,
        message: `Meeting invitation sent to ${successful} attendee(s)` 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-meeting-email function:", error);
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
