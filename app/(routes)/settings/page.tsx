"use client"

import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { AlertTriangle, Save, ShieldAlert } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

function SettingsPage() {
  const { user } = useAuthContext()
  const normalizedEmail = useMemo(() => user?.email?.trim().toLowerCase() ?? '', [user?.email])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [credits, setCredits] = useState<number>(0)

  useEffect(() => {
    if (normalizedEmail) {
      loadUser()
    }
  }, [normalizedEmail])

  const loadUser = async () => {
    if (!normalizedEmail) return

    setLoading(true)
    try {
      const response = await axios.get(`/api/user?email=${encodeURIComponent(normalizedEmail)}`)
      setName(response.data?.name || '')
      setNickname(response.data?.nickname || '')
      setEmail(response.data?.email || normalizedEmail)
      setCredits(typeof response.data?.credits === 'number' ? response.data.credits : 0)
    } catch (error: any) {
      if (error?.response?.status === 404) {
        try {
          const created = await axios.post('/api/user', {
            userName: user?.displayName,
            userEmail: normalizedEmail,
          })

          setName(created.data?.name || '')
          setNickname(created.data?.nickname || '')
          setEmail(created.data?.email || normalizedEmail)
          setCredits(typeof created.data?.credits === 'number' ? created.data.credits : 0)
          return
        } catch (createError: any) {
          console.error('Error creating user from settings:', createError)
          toast.error(createError?.response?.data?.error || 'Failed to initialize account settings')
          return
        }
      }

      console.error('Error loading user settings:', error)
      toast.error(error?.response?.data?.error || 'Failed to load account settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!normalizedEmail) {
      toast.error('User not authenticated')
      return
    }

    if (!name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    if (!nickname.trim()) {
      toast.error('Nickname cannot be empty')
      return
    }

    if (name.trim().toLowerCase() === nickname.trim().toLowerCase()) {
      toast.error('Name and nickname must be different')
      return
    }

    setSaving(true)
    try {
      const response = await axios.put(
        '/api/user',
        {
          email: normalizedEmail,
          name: name.trim(),
          nickname: nickname.trim(),
        },
        {
          headers: {
            'x-user-email': normalizedEmail,
          },
        }
      )

      if (!response.data?.success) {
        toast.error(response.data?.error || 'Failed to update account')
        return
      }

      toast.success('Account settings updated')
      setName(response.data?.data?.name || name.trim())
      setNickname(response.data?.data?.nickname || nickname.trim())
    } catch (error: any) {
      console.error('Error updating account settings:', error)
      toast.error(error?.response?.data?.error || 'Failed to update account settings')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!normalizedEmail) {
      toast.error('User not authenticated')
      return
    }

    const isConfirmed = confirm('Are you sure you want to delete your account? This will remove your templates and designs permanently.')
    if (!isConfirmed) return

    setDeleting(true)
    try {
      const response = await axios.delete('/api/user', {
        data: { email: normalizedEmail },
        headers: {
          'x-user-email': normalizedEmail,
        },
      })

      if (!response.data?.success) {
        toast.error(response.data?.error || 'Failed to delete account')
        return
      }

      toast.success('Account deleted successfully')
      window.location.href = '/'
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast.error(error?.response?.data?.error || 'Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className='relative min-h-[calc(100vh-140px)]'>
      <div className='pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#9d4edd]/10 blur-[120px]' />
      <div className='pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-[#e0b6ff]/6 blur-[95px]' />

      <div className='relative z-10 max-w-4xl space-y-8'>
        <header>
          <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-[#998d9e]'>Account</p>
          <h1 className='mt-2 text-4xl font-black tracking-tight text-[#e2e2e2] md:text-5xl'>Settings</h1>
          <p className='mt-3 max-w-2xl text-sm text-[#d0c2d5]/75'>
            Manage your account details and control your data.
          </p>
        </header>

        <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-6 md:p-7'>
          <h2 className='text-lg font-bold text-[#e2e2e2]'>Profile</h2>

          <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your name'
                className='mt-3 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
                disabled={loading || saving}
              />
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>Nickname</label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder='Your nickname'
                className='mt-3 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
                disabled={loading || saving}
              />
            </div>

            <div>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>Email</label>
              <Input
                value={email}
                readOnly
                className='mt-3 border-[#4d4353]/25 bg-[#1a1a1a] text-[#998d9e]'
              />
            </div>
          </div>

          <div className='mt-4'>
            <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>Available Credits</label>
            <Input
              value={String(credits)}
              readOnly
              className='mt-3 max-w-[200px] border-[#4d4353]/25 bg-[#1a1a1a] text-[#998d9e]'
            />
          </div>

          <div className='mt-6'>
            <Button
              onClick={handleSave}
              disabled={loading || saving}
              className='gap-2 rounded-lg bg-[#e0b6ff] text-[#171717] font-bold hover:bg-[#f2daff]'
            >
              <Save className='h-4 w-4' />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>

        <div className='rounded-2xl border border-red-500/20 bg-[#1b1b1b] p-6 md:p-7'>
          <div className='flex items-start gap-3'>
            <ShieldAlert className='mt-0.5 h-5 w-5 text-red-400' />
            <div>
              <h2 className='text-lg font-bold text-[#e2e2e2]'>Danger Zone</h2>
              <p className='mt-2 text-sm text-[#d0c2d5]/75'>
                Deleting your account permanently removes your user profile, generated designs, and custom templates.
              </p>
            </div>
          </div>

          <div className='mt-6'>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleting}
              variant='outline'
              className='gap-2 border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
            >
              <AlertTriangle className='h-4 w-4' />
              {deleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingsPage
