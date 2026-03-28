"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuthContext } from '@/app/provider'
import axios from 'axios'
import { Loader2Icon, Plus, Save, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
//@ts-ignore
import uuid4 from "uuid4"

interface CustomTemplateFormProps {
  onSuccess?: () => void
}

interface CodeField {
  id: string
  title: string
  code: string
}

const getInitialCodeFields = (): CodeField[] => [
  {
    id: `code-field-${Date.now()}`,
    title: 'Code Field 1',
    code: '',
  },
]

export default function CustomTemplateForm({ onSuccess }: CustomTemplateFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [codeFields, setCodeFields] = useState<CodeField[]>(getInitialCodeFields())
  const [commands, setCommands] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuthContext()

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
    // Validate required fields
    const normalizedCodeFields = codeFields
      .map((field, index) => ({
        id: field.id,
        title: field.title.trim() || `Code Field ${index + 1}`,
        code: field.code,
      }))
      .filter((field) => field.code.trim().length > 0)

    if (!name.trim() || normalizedCodeFields.length === 0) {
      toast.error('Name and at least one code field are required!')
      return
    }

    if (!user?.email) {
      toast.error('User not authenticated!')
      return
    }

    setLoading(true)

    try {
      const uid = uuid4()
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const normalizedEmail = user.email.trim().toLowerCase()
      const response = await axios.post(
        '/api/custom-templates',
        {
          uid,
          name: name.trim(),
          description: description.trim() || null,
          tags: tagsArray,
          templateData: {
            codeBlocks: normalizedCodeFields,
          },
          commands: commands.trim() || null,
          email: normalizedEmail,
        },
        {
          headers: {
            'x-user-email': normalizedEmail,
          },
        }
      )

      if (response.data?.success) {
        toast.success('Template saved successfully!')
        // Reset form
        setName('')
        setCodeFields(getInitialCodeFields())
        setDescription('')
        setTags('')
        setCommands('')
        onSuccess?.()
      } else {
        toast.error(response.data?.error || 'Failed to save template')
      }
    } catch (error: any) {
      console.error('Error saving template:', error)
      toast.error(error.response?.data?.error || 'Error saving template')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setName('')
    setCodeFields(getInitialCodeFields())
    setDescription('')
    setTags('')
    setCommands('')
  }

  return (
    <section className='mt-8'>
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        {/* Code Editor Section */}
        <div className='xl:col-span-2'>
          <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-6'>
            <div className='pointer-events-none absolute left-8 top-6 h-40 w-40 rounded-full bg-[#9d4edd]/8 blur-[85px]' />

            <div className='flex items-center justify-between'>
              <label className='block text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Template Code Fields *
              </label>
              <Button
                type='button'
                variant='outline'
                onClick={addCodeField}
                className='h-8 gap-1 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] hover:bg-[#2a2a2a]'
                disabled={loading}
              >
                <Plus className='h-3.5 w-3.5' />
                Add More Code Field
              </Button>
            </div>

            <div className='relative z-10 mt-4 space-y-4'>
              {codeFields.map((field, index) => (
                <div key={field.id} className='rounded-xl border border-[#4d4353]/25 bg-[#222225] p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <Input
                      value={field.title}
                      onChange={(e) => updateCodeField(field.id, 'title', e.target.value)}
                      placeholder={`Code Field ${index + 1} title`}
                      className='border-[#4d4353]/25 bg-[#1d1d20] text-[#e2e2e2] placeholder-[#998d9e]/50'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => removeCodeField(field.id)}
                      className='h-9 border-[#4d4353]/25 bg-[#1d1d20] text-red-400 hover:bg-red-500/10'
                      disabled={loading || codeFields.length <= 1}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>

                  <Textarea
                    value={field.code}
                    onChange={(e) => updateCodeField(field.id, 'code', e.target.value)}
                    placeholder='Paste code for this field...'
                    className='min-h-[220px] border-[#4d4353]/25 bg-[#1d1d20] font-mono text-sm text-[#e2e2e2] placeholder-[#998d9e]/50'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Configuration */}
        <div className='xl:col-span-1'>
          <div className='space-y-4'>
            {/* Name Field */}
            <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Template Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g., Dark Card Component'
                className='mt-3 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50 focus:ring-[#e0b6ff]/20'
              />
            </div>

            {/* Description Field */}
            <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Add a description (optional)'
                className='mt-3 min-h-[100px] border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50'
              />
            </div>

            {/* Tags Field */}
            <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Tags
              </label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder='react, component, card (comma-separated)'
                className='mt-3 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] placeholder-[#998d9e]/50 focus:ring-[#e0b6ff]/20'
              />
              <p className='mt-2 text-xs text-[#998d9e]'>Separate tags with commas</p>
            </div>

            {/* Commands Field */}
            <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
              <label className='text-xs font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>
                Terminal Commands
              </label>
              <Textarea
                value={commands}
                onChange={(e) => setCommands(e.target.value)}
                placeholder='npm install react&#10;npm run dev (optional)'
                className='mt-3 min-h-[80px] border-[#4d4353]/25 bg-[#222225] font-mono text-xs text-[#e2e2e2] placeholder-[#998d9e]/50'
              />
              <p className='mt-2 text-xs text-[#998d9e]'>Add terminal commands needed (optional)</p>
            </div>

            {/* Action Buttons */}
            <div className='space-y-2'>
              <Button
                onClick={handleSave}
                disabled={loading}
                className='w-full gap-2 rounded-lg bg-[#e0b6ff] text-[#171717] font-bold hover:bg-[#f2daff]'
              >
                {loading ? (
                  <>
                    <Loader2Icon className='h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className='h-4 w-4' />
                    Save Template
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant='outline'
                className='w-full gap-2 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] hover:bg-[#2a2a2a]'
                disabled={loading}
              >
                <X className='h-4 w-4' />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
