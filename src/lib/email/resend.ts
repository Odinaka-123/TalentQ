import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "TalentQ <talentqinvites@kakkatech.com>";

export async function sendTeamInviteEmail(params: {
  to: string;
  companyName: string;
  role: string;
  acceptUrl: string;
}): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.to,
      subject: `You've been invited to join ${params.companyName} on TalentQ`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1F2A22;">You're invited to TalentQ</h2>
          <p style="color: #1F2A22;">
            You've been invited to join <strong>${params.companyName}</strong>
            on TalentQ as a <strong>${params.role}</strong>.
          </p>
          <a href="${params.acceptUrl}"
             style="display: inline-block; background: #A8531E; color: white;
                    padding: 12px 24px; border-radius: 999px; text-decoration: none;
                    font-weight: 500; margin-top: 16px;">
            Accept Invite
          </a>
          <p style="color: #8A8A7E; font-size: 13px; margin-top: 24px;">
            This invite expires in 7 days. If you weren't expecting this, you can ignore this email.
          </p>
        </div>
      `,
    });

    return !error;
  } catch (err) {
    console.error("Failed to send invite email:", err);
    return false;
  }
}
