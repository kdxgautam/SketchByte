"use client"

import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { ArrowLeft, Copy, Loader2Icon, Plus, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

interface Template {
  id: number
  uid: string
  name: string
  description: string | null
  tags: string[] | null
  templateData: any
  commands: string | null
  createdBy: string
}

interface CodeField {
  id: string
  title: string
  code: string
}

function extractCodeFields(templateData: unknown): CodeField[] {
  if (typeof templateData === 'string') {
    return [{ id: 'code-field-1', title: 'Code Field 1', code: templateData }]
  }

  if (
    templateData &&
    typeof templateData === 'object' &&
    typeof (templateData as { code?: unknown }).code === 'string'
  ) {
    return [{ id: 'code-field-1', title: 'Code Field 1', code: (templateData as { code: string }).code }]
  }

  if (
    templateData &&
    typeof templateData === 'object' &&
    Array.isArray((templateData as { codeBlocks?: unknown[] }).codeBlocks)
  ) {
    const rawCodeBlocks = (templateData as { codeBlocks: Array<{ id?: unknown; title?: unknown; code?: unknown }> }).codeBlocks

    const normalizedCodeBlocks = rawCodeBlocks.map((block, index) => ({
      id: typeof block.id === 'string' && block.id.trim().length > 0 ? block.id : `code-field-${index + 1}`,
      title:
        typeof block.title === 'string' && block.title.trim().length > 0
          ? block.title
          : `Code Field ${index + 1}`,
      code: typeof block.code === 'string' ? block.code : '',
    }))

    if (normalizedCodeBlocks.length > 0) {
      return normalizedCodeBlocks
    }
  }

  try {
    return [
      {
        id: 'code-field-1',
        title: 'Code Field 1',
        code: JSON.stringify(templateData, null, 2),
      },
    ]
  } catch {
    return [{ id: 'code-field-1', title: 'Code Field 1', code: '' }]
  }
}

function TemplateEditorPage() {
  const { uid } = useParams<{ uid: string }>()
  const { user } = useAuthContext()

  const [template, setTemplate] = useState<Template | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [commands, setCommands] = useState('')
  const [codeFields, setCodeFields] = useState<CodeField[]>([{ id: 'code-field-1', title: 'Code Field 1', code: '' }])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const normalizedEmail = useMemo(() => user?.email?.trim().toLowerCase() ?? '', [user?.email])

  useEffect(() => {
    if (uid && normalizedEmail) {
      fetchTemplate()
    }
  }, [uid, normalizedEmail])

  const fetchTemplate = async () => {
    if (!normalizedEmail || !uid) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        email: normalizedEmail,
        uid,
      })

      const response = await axios.get(`/api/custom-templates?${params.toString()}`, {
        headers: {
          'x-user-email': normalizedEmail,
        },
      })

      if (!response.data?.success) {
        toast.error(response.data?.error || 'Failed to load template')
        return
      }

      const loadedTemplate = response.data.data as Template
      setTemplate(loadedTemplate)
      setName(loadedTemplate.name || '')
      setDescription(loadedTemplate.description || '')
      setTags(Array.isArray(loadedTemplate.tags) ? loadedTemplate.tags.join(', ') : '')
      setCommands(loadedTemplate.commands || '')
      setCodeFields(extractCodeFields(loadedTemplate.templateData))
    } catch (error: any) {
      console.error('Error loading template:', error)
      toast.error(error.response?.data?.error || 'Failed to load template')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      const combinedCode = codeFields
        .map((field) => `${field.title}\n${field.code}`)
        .join('\n\n/* ==================== */\n\n')

      await navigator.clipboard.writeText(combinedCode)
      toast.success('Code copied to clipboard!')
    } catch {
      toast.error('Failed to copy code')
    }
  }

  const updateCodeField = (id: string, key: 'title' | 'code', value: string) => {
    setCodeFields((prev) =>
      prev.map((field) =>
        field.id === id
          ? {
              ...field,
              [key]: value,
            }
          : field
      )
    )
  }

  const addCodeField = () => {
    setCodeFields((prev) => [
      ...prev,
      {
        id: `code-field-${Date.now()}-${prev.length + 1}`,
        title: `Code Field ${prev.length + 1}`,
        code: '',
      },
    ])
  }

  const removeCodeField = (id: string) => {
    setCodeFields((prev) => {
      if (prev.length <= 1) {
        toast.error('At least one code field is required')
        return prev
      }

      return prev.filter((field) => field.id !== id)
    })
  }

  const handleSave = async () => {
    if (!normalizedEmail || !uid) {
      toast.error('User not authenticated')
      return
    }

    const normalizedCodeFields = codeFields
      .map((field, index) => ({
        id: field.id,
        title: field.title.trim() || `Code Field ${index + 1}`,
        code: field.code,
      }))
      .filter((field) => field.code.trim().length > 0)

    if (normalizedCodeFields.length === 0) {
      toast.error('At least one code field with code is required')
      return
    }

    if (!name.trim()) {
      toast.error('Template title cannot be empty')
      return
    }

    const normalizedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    setSaving(true)
    try {
      const response = await axios.put(
        '/api/custom-templates',
        {
          uid,
          email: normalizedEmail,
          name: name.trim(),
          description: description.trim() || null,
          tags: normalizedTags,
          commands: commands.trim() || null,
          templateData: {
            codeBlocks: normalizedCodeFields,
          },
        },
        {
          headers: {
            'x-user-email': normalizedEmail,
          },
        }
      )

      if (!response.data?.success) {
        toast.error(response.data?.error || 'Failed to save template')
        return
      }

      toast.success('Template updated successfully!')
      setTemplate((prev) =>
        prev
          ? {
              ...prev,
                name: name.trim(),
                description: description.trim() || null,
                tags: normalizedTags,
                commands: commands.trim() || null,
                templateData: {
                  codeBlocks: normalizedCodeFields,
                },
            }
          : prev
      )
    } catch (error: any) {
      console.error('Error saving template:', error)
      toast.error(error.response?.data?.error || 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className='relative min-h-[calc(100vh-120px)]'>
      <div className='pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#9d4edd]/10 blur-[120px]' />
      <div className='pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-[#e0b6ff]/6 blur-[95px]' />

      <div className='relative z-10 space-y-6'>
        <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <Link
              href='/my-templates'
              className='mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#998d9e] hover:text-[#e2e2e2]'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to My Templates
            </Link>
            <h1 className='text-3xl font-black tracking-tight text-[#e2e2e2] md:text-4xl'>Template Editor</h1>
            <p className='mt-2 max-w-3xl text-sm text-[#d0c2d5]/75'>
              View, edit, copy, and save your template including title, description, tags, commands, and code.
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <Button
              onClick={handleCopy}
              disabled={loading || codeFields.every((field) => field.code.trim().length === 0)}
              variant='outline'
              className='gap-2 border-[#4d4353]/30 bg-[#1b1b1b] text-[#d0c2d5] hover:border-[#e0b6ff]/30 hover:text-[#e2e2e2]'
            >
              <Copy className='h-4 w-4' />
              Copy Code
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || saving}
              className='gap-2 rounded-lg bg-[#e0b6ff] text-[#171717] font-bold hover:bg-[#f2daff]'
            >
              {saving ? (
                <>
                  <Loader2Icon className='h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='h-4 w-4' />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </header>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
          <div className='space-y-4 xl:col-span-1'>
            <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Template Title
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Template name'
                className='mt-3 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
                disabled={loading}
              />
            </div>

            <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Template description'
                className='mt-3 min-h-[110px] border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
                disabled={loading}
              />
            </div>

            <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Tags
              </label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder='react, ui, card'
                className='mt-3 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
                disabled={loading}
              />
            </div>

            <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Commands
              </label>
              <Textarea
                value={commands}
                onChange={(e) => setCommands(e.target.value)}
                placeholder='npm install ...'
                className='mt-3 min-h-[90px] border-[#4d4353]/25 bg-[#222225] font-mono text-xs text-[#e2e2e2] placeholder-[#998d9e]/50'
                disabled={loading}
              />
            </div>
          </div>

          <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5 md:p-6 xl:col-span-2'>
            <div className='flex items-center justify-between'>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Template Code Fields
              </label>
              <Button
                type='button'
                onClick={addCodeField}
                variant='outline'
                className='h-8 gap-1 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] hover:bg-[#2a2a2a]'
                disabled={loading}
              >
                <Plus className='h-3.5 w-3.5' />
                Add More Code Field
              </Button>
            </div>

            <div className='mt-4 space-y-4'>
              {codeFields.map((field, index) => (
                <div key={field.id} className='rounded-xl border border-[#4d4353]/25 bg-[#222225] p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <Input
                      value={field.title}
                      onChange={(e) => updateCodeField(field.id, 'title', e.target.value)}
                      placeholder={`Code Field ${index + 1} title`}
                      className='border-[#4d4353]/25 bg-[#1d1d20] text-[#e2e2e2] placeholder-[#998d9e]/50'
                      disabled={loading}
                    />
                    <Button
                      type='button'
                      onClick={() => removeCodeField(field.id)}
                      variant='outline'
                      className='h-9 border-[#4d4353]/25 bg-[#1d1d20] text-red-400 hover:bg-red-500/10'
                      disabled={loading || codeFields.length <= 1}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>

                  <Textarea
                    value={field.code}
                    onChange={(e) => updateCodeField(field.id, 'code', e.target.value)}
                    placeholder='Template code will appear here...'
                    className='min-h-[260px] border-[#4d4353]/25 bg-[#1d1d20] font-mono text-sm text-[#e2e2e2] placeholder-[#998d9e]/50'
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TemplateEditorPage
