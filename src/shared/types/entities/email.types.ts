export type EmailMessageStatus =
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "BOUNCED"
  | "COMPLAINED"
  | "FAILED"
  | "SKIPPED";

export type EmailMessageTrigger = "ORDER_CREATED" | "MANUAL_RESEND";

export interface EmailMessage {
  id: string;
  customerId: string | null;
  orderId: number | null;
  trigger: EmailMessageTrigger;
  status: EmailMessageStatus;
  recipient: string | null;
  subject: string;
  providerMessageId: string | null;
  failureReason: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

export interface CustomerEmailPreferences {
  customerId: string;
  email: string | null;
  receivesOrderEmails: boolean;
  orderEmailsUnsubscribedAt: string | null;
}

export interface EmailSettings {
  id: string;
  orderCreatedEmailEnabled: boolean;
  fromName: string | null;
  fromEmail: string | null;
  replyToEmail: string | null;
  publicApiUrl: string | null;
  updatedAt: string;
}

export interface OrderEmailDefaults {
  orderCreatedEmailEnabled: boolean;
}
