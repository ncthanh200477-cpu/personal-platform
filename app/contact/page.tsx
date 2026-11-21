'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');

    const { error } = await supabase.from('contact_messages').insert({
      sender_name: name,
      sender_email: email,
      subject,
      message,
    });

    if (error) {
      setStatus('error');
      return;
    }

    setStatus('sent');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  }

  return (
    <main className="min-h-screen bg-[#0A192F] text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-400">Direct Channel</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Liên hệ &amp; Trao đổi Chuyên môn</h1>
        <p className="mt-3 text-slate-300">
          Gửi lời nhắn trực tiếp về nghiên cứu, đào tạo hoặc hợp tác kỹ thuật. Tin nhắn sẽ được chuyển thẳng vào hộp thư quản trị.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-xl border border-slate-800 bg-[#112240] p-8">
          <div>
            <label className="block text-sm font-medium text-slate-300">Họ và tên</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0A192F] px-4 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Email phản hồi</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0A192F] px-4 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Chủ đề</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0A192F] px-4 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Nội dung chi tiết</label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#0A192F] px-4 py-2.5 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {status === 'sent' && (
            <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400">
              Đã gửi tin nhắn thành công. Cảm ơn bạn đã kết nối!
            </p>
          )}
          {status === 'error' && (
            <p className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400">
              Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-lg bg-amber-400 px-6 py-3 font-semibold text-[#0A192F] transition hover:bg-amber-300 disabled:opacity-50"
          >
            {status === 'sending' ? 'Đang gửi...' : 'Gửi tin nhắn'}
          </button>
        </form>
      </div>
    </main>
  );
}