'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminLogin from '../../../components/admin/AdminLogin';
import AdminShell from '../../../components/admin/AdminShell';
import { useAdminAuth } from '../../../hooks/useAdminAuth';
import type { SentEmail } from '../../../lib/email-service';

export default function AdminEmailsPage() {
  const { password, setPassword, authenticated, loading, error, login, getPassword, logout } = useAdminAuth();
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [emailsLoading, setEmailsLoading] = useState(false);
  const [emailsError, setEmailsError] = useState('');
  const [storageMode, setStorageMode] = useState<'supabase' | 'file'>('file');
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);

  const fetchStatus = useCallback(async (pwd: string) => {
    try {
      const res = await fetch('/api/admin/status', { headers: { 'x-admin-password': pwd } });
      if (res.ok) {
        const data = await res.json();
        setStorageMode(data.storageMode);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchEmails = useCallback(async () => {
    setEmailsLoading(true);
    setEmailsError('');
    try {
      const res = await fetch('/api/admin/emails', {
        headers: { 'x-admin-password': getPassword() },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch email logs.');
      }
      setEmails(data.emails || []);
    } catch (err: any) {
      setEmailsError(err.message || 'Network error fetching email logs.');
    } finally {
      setEmailsLoading(false);
    }
  }, [getPassword]);

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear the simulated email outbox?')) return;
    try {
      const res = await fetch('/api/admin/emails', {
        method: 'DELETE',
        headers: { 'x-admin-password': getPassword() },
      });
      if (res.ok) {
        setEmails([]);
        setSelectedEmail(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchEmails();
      fetchStatus(getPassword());
    }
  }, [authenticated, fetchEmails, fetchStatus, getPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(password);
    if (ok) fetchStatus(password);
  };

  if (!authenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        title="Email Outbox Admin"
      />
    );
  }

  return (
    <AdminShell
      title="Email Outbox"
      subtitle="Verify simulated emails sent to customers"
      storageMode={storageMode}
      onLogout={logout}
      actions={
        emails.length > 0 ? (
          <button
            onClick={clearLogs}
            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Clear Log
          </button>
        ) : null
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Email Logs List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-midnightNavy/50 border-b border-borderGray pb-2 mb-4">
            Sent Messages ({emails.length})
          </h2>

          {emailsLoading ? (
            <div className="py-12 text-center bg-storeWhite rounded-2xl border border-borderGray">
              <div className="w-6 h-6 border-2 border-summitGold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs uppercase font-bold tracking-widest text-midnightNavy/50">Loading logs...</p>
            </div>
          ) : emailsError ? (
            <div className="p-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {emailsError}
            </div>
          ) : emails.length === 0 ? (
            <div className="bg-storeWhite rounded-2xl border border-borderGray p-12 text-center">
              <p className="text-midnightNavy/50 font-bold uppercase tracking-widest text-xs">
                Outbox is empty. Trigger subscriptions or orders to send emails.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {emails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                return (
                  <button
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex flex-col gap-1.5 shadow-sm ${
                      isSelected
                        ? 'bg-midnightNavy text-storeWhite border-midnightNavy'
                        : 'bg-storeWhite text-midnightNavy border-borderGray hover:border-summitGold'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`font-bold ${isSelected ? 'text-summitGold' : 'text-summitGoldDark'}`}>
                        To: {email.to}
                      </span>
                      <span className={`text-[9px] ${isSelected ? 'text-storeWhite/50' : 'text-midnightNavy/40'}`}>
                        {new Date(email.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-bold truncate text-[13px] w-full">{email.subject}</p>
                    <span className={`text-[9px] font-medium tracking-wide ${isSelected ? 'text-storeWhite/40' : 'text-midnightNavy/40'}`}>
                      {new Date(email.createdAt).toLocaleDateString()} · {email.id}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Email Preview Area */}
        <div className="lg:col-span-7">
          <h2 className="text-xs font-bold uppercase tracking-widest text-midnightNavy/50 border-b border-borderGray pb-2 mb-4">
            HTML Preview
          </h2>

          {selectedEmail ? (
            <div className="bg-storeWhite border border-borderGray rounded-2xl overflow-hidden shadow-sm flex flex-col">
              {/* Preview Headers */}
              <div className="p-4 bg-cardGray border-b border-borderGray space-y-1.5 text-xs text-midnightNavy/80">
                <p><strong>Recipient:</strong> {selectedEmail.to}</p>
                <p><strong>Subject:</strong> {selectedEmail.subject}</p>
                <p><strong>Timestamp:</strong> {new Date(selectedEmail.createdAt).toLocaleString('en-IN')}</p>
              </div>

              {/* Preview Frame */}
              <div className="p-4 bg-cardGray aspect-[4/3] md:aspect-[16/10] w-full border-b border-borderGray">
                <iframe
                  title="Simulated Email HTML View"
                  srcDoc={selectedEmail.html}
                  className="w-full h-full border border-borderGray bg-white rounded-lg"
                />
              </div>

              {/* Preview Raw HTML text */}
              <details className="p-4 text-xs bg-storeWhite">
                <summary className="font-bold uppercase tracking-wider text-midnightNavy/60 cursor-pointer select-none">
                  View Raw HTML Markup
                </summary>
                <pre className="mt-3 p-3 bg-cardGray border border-borderGray text-[10px] overflow-x-auto max-h-[150px] font-mono whitespace-pre-wrap select-all">
                  {selectedEmail.html}
                </pre>
              </details>
            </div>
          ) : (
            <div className="bg-storeWhite rounded-2xl border border-borderGray p-24 text-center">
              <p className="text-midnightNavy/40 font-bold uppercase tracking-widest text-xs">
                Select an email from the outbox to preview its styling.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
