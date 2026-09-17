import {
  EmailClient,
  KnownEmailSendStatus,
  type EmailAttachment,
} from "@azure/communication-email";

let client: EmailClient | null = null;

function getEmailClient() {
  if (client) return client;

  const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error(
      "Please add AZURE_COMMUNICATION_CONNECTION_STRING to your .env",
    );
  }

  client = new EmailClient(connectionString);
  return client;
}

interface SendEmailParams {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  plainText: string;
  attachments?: EmailAttachment[];
}

export async function sendEmail({
  to,
  toName,
  subject,
  html,
  plainText,
  attachments,
}: SendEmailParams) {
  // Azure Communication Service email requires an Azure-managed sender
  // address (e.g. DoNotReply@xxxx.azurecomm.net) until a custom domain is
  // verified in the Azure portal.
  const senderAddress = process.env.AZURE_COMMUNICATION_SENDER_EMAIL;
  if (!senderAddress) {
    throw new Error("Please add AZURE_COMMUNICATION_SENDER_EMAIL to your .env");
  }

  const emailClient = getEmailClient();

  const poller = await emailClient.beginSend({
    senderAddress,
    content: { subject, html, plainText },
    recipients: { to: [{ address: to, displayName: toName }] },
    attachments,
  });

  const result = await poller.pollUntilDone();

  if (result.status !== KnownEmailSendStatus.Succeeded) {
    throw new Error(`Email send failed with status: ${result.status}`);
  }

  return result;
}
