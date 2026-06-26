import { promises as fs } from 'fs';
import path from 'path';
import { logger } from './logger';

const EMAILS_PATH = path.join(process.cwd(), 'data', 'sent-emails.json');

export type SentEmail = {
  id: string;
  to: string;
  subject: string;
  html: string;
  createdAt: string;
};

async function readSentEmails(): Promise<SentEmail[]> {
  try {
    const raw = await fs.readFile(EMAILS_PATH, 'utf-8');
    return JSON.parse(raw) as SentEmail[];
  } catch {
    try {
      await fs.mkdir(path.dirname(EMAILS_PATH), { recursive: true });
      await fs.writeFile(EMAILS_PATH, '[]', 'utf-8');
    } catch (e) {
      console.error('Failed to initialize sent-emails database:', e);
    }
    return [];
  }
}

async function writeSentEmails(emails: SentEmail[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(EMAILS_PATH), { recursive: true });
    await fs.writeFile(EMAILS_PATH, JSON.stringify(emails, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save sent-emails database:', e);
  }
}

export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<SentEmail> {
  const emailRecord: SentEmail = {
    id: `email_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    to: params.to,
    subject: params.subject,
    html: params.html,
    createdAt: new Date().toISOString(),
  };

  logger.info(`[Email Service] Sending email to ${params.to} with subject: "${params.subject}"`);

  // Persist to local JSON outbox
  const emails = await readSentEmails();
  emails.unshift(emailRecord);
  await writeSentEmails(emails);

  return emailRecord;
}

export async function getAllSentEmails(): Promise<SentEmail[]> {
  return readSentEmails();
}

export async function clearSentEmails(): Promise<void> {
  await writeSentEmails([]);
}
