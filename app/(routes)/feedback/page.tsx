"use client"

import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MessageSquareText, Send } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

const FEEDBACK_EMAIL = 'kdxgautam@gmail.com'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function FeedbackPage() {
  const { user } = useAuthContext()
  const [name, setName] = useState(user?.displayName || '')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('SketchByte Website Feedback')
  const [message, setMessage] = useState('')

  const isFormComplete = useMemo(
    () =>
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      EMAIL_REGEX.test(email.trim()) &&
      subject.trim().length > 0 &&
      message.trim().length > 0,
    [name, email, subject, message]
  )

  const mailtoHref = useMemo(() => {
    const feedbackBody = [
      `Name: ${name || 'N/A'}`,
      `Email: ${email || 'N/A'}`,
      '',
      'Feedback:',
      message || '(No message provided)',
    ].join('\n')

    return `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject || 'SketchByte Feedback')}&body=${encodeURIComponent(feedbackBody)}`
  }, [name, email, subject, message])

  const handleSendFeedback = () => {
    if (!name.trim()) {
      toast.error('Please enter your name')
      return
    }

    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!subject.trim()) {
      toast.error('Please enter a subject')
      return
    }

    if (!message.trim()) {
      toast.error('Please enter your feedback message')
      return
    }

    window.location.href = mailtoHref
  }

  return (
    <section className='relative min-h-[calc(100vh-140px)]'>
      <div className='pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#9d4edd]/10 blur-[120px]' />
      <div className='pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-[#e0b6ff]/6 blur-[95px]' />

      <div className='relative z-10 max-w-4xl space-y-8'>
        <header>
          <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-[#998d9e]'>Support</p>
          <h1 className='mt-2 text-4xl font-black tracking-tight text-[#e2e2e2] md:text-5xl'>Feedback</h1>
          <p className='mt-3 max-w-2xl text-sm text-[#d0c2d5]/75'>
            Share your thoughts about SketchByte. Your email client will open and send your feedback directly to {FEEDBACK_EMAIL}.
          </p>
        </header>

        <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-6 md:p-7'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>Your Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your name'
                className='mt-3 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
                required
              />
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>Your Email</label>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='mt-3 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
                required
              />
            </div>
          </div>

          <div className='mt-4'>
            <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder='Feedback subject'
              className='mt-3 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
              required
            />
          </div>

          <div className='mt-4'>
            <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Tell us what you like, what can improve, or any bug you found...'
              className='mt-3 min-h-[220px] border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
              required
            />
          </div>

          <div className='mt-6 flex flex-wrap items-center gap-3'>
            <Button
              onClick={handleSendFeedback}
              disabled={!isFormComplete}
              className='gap-2 rounded-lg bg-[#e0b6ff] text-[#171717] font-bold hover:bg-[#f2daff]'
            >
              <Send className='h-4 w-4' />
              Send via Email
            </Button>

            <Button
              type='button'
              variant='outline'
              onClick={handleSendFeedback}
              disabled={!isFormComplete}
              className='gap-2 border-[#4d4353]/25 bg-[#222225] text-xs font-semibold uppercase tracking-wide text-[#d0c2d5] hover:bg-[#2a2a2a]'
            >
              <Mail className='h-4 w-4' />
              Open Email App
            </Button>
          </div>
        </div>

        <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
          <div className='flex items-center gap-2 text-[#e0b6ff]'>
            <MessageSquareText className='h-4 w-4' />
            <span className='text-xs font-semibold uppercase tracking-[0.15em]'>Direct Feedback Email</span>
          </div>
          <p className='mt-2 text-sm text-[#d0c2d5]/80'>{FEEDBACK_EMAIL}</p>
        </div>
      </div>
    </section>
  )
}

export default FeedbackPage
