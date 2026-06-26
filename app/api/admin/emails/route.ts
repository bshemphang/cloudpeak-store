import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, adminAuthErrorMessage } from '../../../../lib/admin-auth';
import { getAllSentEmails, clearSentEmails } from '../../../../lib/email-service';

export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  try {
    const emails = await getAllSentEmails();
    return NextResponse.json({ emails }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to retrieve simulated emails.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  try {
    await clearSentEmails();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to clear simulated emails.' }, { status: 500 });
  }
}
