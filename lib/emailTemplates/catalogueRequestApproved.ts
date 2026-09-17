interface CatalogueApprovedEmailParams {
  name: string;
  catalogueFileName: string;
}

interface EmailContent {
  subject: string;
  html: string;
  plainText: string;
}

const PRIMARY = "#0A0A0A";
const CREAM_BACKGROUND = "#F5F5F5";
const DESCRIPTION_COLOR = "#6B6B70";
const SECONDARY = "#BFBFBF";

// Referenced via `cid:` in the HTML below — the sender attaches the actual
// logo bytes as an inline attachment with this same contentId, so the image
// always renders even though email clients can't reach localhost (or any
// server that isn't yet publicly deployed).
export const CATALOGUE_EMAIL_LOGO_CID = "brighton-logo";

export function buildCatalogueApprovedEmail({
  name,
  catalogueFileName,
}: CatalogueApprovedEmailParams): EmailContent {
  const firstName = name.trim().split(" ")[0] || name;
  const subject = "Your Brighton Catalogue Is Here";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0; padding:0; background-color:${CREAM_BACKGROUND}; font-family:Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM_BACKGROUND}; padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border-radius:10px; overflow:hidden;">
            <tr>
              <td style="background-color:#ffffff; padding:28px 40px; border-bottom:1px solid ${SECONDARY}33;">
                <img src="cid:${CATALOGUE_EMAIL_LOGO_CID}" alt="Brighton" height="28" style="display:block; height:28px; width:auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <p style="margin:0 0 16px; font-size:20px; line-height:1.4; color:${PRIMARY}; font-weight:600;">
                  Hi ${firstName},
                </p>
                <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:${DESCRIPTION_COLOR};">
                  Thank you for your interest in Brighton. Your request has been approved,
                  and our latest product catalogue is attached to this email as
                  <strong style="color:${PRIMARY};">${catalogueFileName}</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px; border-top:1px solid ${SECONDARY}33;">
                <p style="margin:0; font-size:12.5px; line-height:1.6; color:${DESCRIPTION_COLOR};">
                  Brighton &mdash; Architectural Lighting, Engineered.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const plainText = `Hi ${firstName},

Thank you for your interest in Brighton. Your request has been approved, and our latest product catalogue is attached to this email as ${catalogueFileName}.

If you have any questions or need further assistance, simply reply to this email — we're happy to help.

Brighton — Architectural Lighting, Engineered.`;

  return { subject, html, plainText };
}
