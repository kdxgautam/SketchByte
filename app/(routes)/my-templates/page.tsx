"use client"
import { useAuthContext } from '@/app/provider'
import axios from 'axios'
import { Plus, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import TemplateCard from './_components/TemplateCard'

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

function MyTemplates() {
    const { user } = useAuthContext()
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        user && fetchTemplates()
    }, [user])

    const fetchTemplates = async () => {
        if (!user?.email) return

        setLoading(true)
        try {
            const normalizedEmail = user.email.trim().toLowerCase()
            const params = new URLSearchParams({ email: normalizedEmail })
            const result = await axios.get(`/api/custom-templates?${params.toString()}`, {
                headers: {
                    'x-user-email': normalizedEmail,
                },
            })

            if (result.data?.success) {
                setTemplates(result.data.data)
            } else {
                toast.error(result.data?.error || 'Failed to load templates')
            }
        } catch (error) {
            console.error('Error fetching templates:', error)
            toast.error('Failed to load templates')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (uid: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return
        if (!user?.email) {
            toast.error('User not authenticated')
            return
        }

        try {
            const normalizedEmail = user.email.trim().toLowerCase()
            const response = await axios.delete('/api/custom-templates', {
                data: {
                    uid,
                    email: normalizedEmail,
                },
                headers: {
                    'x-user-email': normalizedEmail,
                },
            })

            if (!response.data?.success) {
                throw new Error(response.data?.error || 'Failed to delete template')
            }

            setTemplates((prevTemplates) => prevTemplates.filter((t) => t.uid !== uid))
            toast.success('Template deleted successfully!')
        } catch (error) {
            console.error('Error deleting template:', error)
            toast.error('Failed to delete template')
        }
    }

    return (
        <section className='relative min-h-[calc(100vh-140px)]'>
            <div className='pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#9d4edd]/10 blur-[120px]' />
            <div className='pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-[#e0b6ff]/6 blur-[95px]' />

            <div className='relative z-10 space-y-8'>
                {/* Header */}
                <header className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
                    <div>
                        <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-[#998d9e]'>
                            Dashboard Overview
                        </p>
                        <h1 className='mt-2 text-4xl font-black tracking-tight text-[#e2e2e2] md:text-5xl'>
                            My Templates
                        </h1>
                        <p className='mt-3 max-w-2xl text-sm text-[#d0c2d5]/75'>
                            Manage and organize your custom code templates. Reuse, copy, and manage your saved code snippets with ease.
                        </p>
                    </div>

                    <div className='flex items-center gap-3'>
                        <button
                            onClick={fetchTemplates}
                            disabled={loading}
                            className='inline-flex h-11 items-center gap-2 rounded-md border border-[#4d4353]/30 bg-[#1b1b1b] px-4 text-xs font-semibold uppercase tracking-wide text-[#d0c2d5] transition-colors hover:border-[#e0b6ff]/30 hover:text-[#e2e2e2] disabled:opacity-50'
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <Link
                            href='/custom-templates'
                            className='inline-flex h-11 items-center gap-2 rounded-md bg-gradient-to-r from-[#a85ef0] to-[#9d4edd] px-5 text-xs font-bold uppercase tracking-wide text-[#251a00] shadow-[0_10px_28px_rgba(157,78,221,0.3)] transition-all hover:shadow-[0_14px_35px_rgba(157,78,221,0.45)]'
                        >
                            <Plus className='h-4 w-4' />
                            New Template
                        </Link>
                    </div>
                </header>

                {/* Templates Grid */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
                    {templates.map((template, index) => (
                        <TemplateCard
                            key={template.uid}
                            template={template}
                            index={index}
                            onDelete={handleDelete}
                        />
                    ))}

                    {templates.length === 0 && !loading && (
                        <div className='col-span-full rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-10 text-center'>
                            <h3 className='text-xl font-bold text-[#e2e2e2]'>No templates created yet</h3>
                            <p className='mt-2 text-sm text-[#998d9e]'>
                                Create your first template to get started.
                            </p>
                            <Link
                                href='/custom-templates'
                                className='mt-5 inline-flex items-center gap-2 rounded-md bg-[#e0b6ff] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#171717] transition-colors hover:bg-[#f2daff]'
                            >
                                <Plus className='h-4 w-4' />
                                Create First Template
                            </Link>
                        </div>
                    )}
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-1 gap-6 xl:grid-cols-4'>
                    <article className='xl:col-span-3 rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-6 md:p-7'>
                        <div className='flex flex-col gap-5 md:flex-row md:items-start md:justify-between'>
                            <div>
                                <h3 className='text-2xl font-bold text-[#e2e2e2]'>Template Library</h3>
                                <p className='mt-1 text-sm text-[#998d9e]'>
                                    You have {templates.length} template{templates.length !== 1 ? 's' : ''} saved.
                                </p>
                            </div>
                        </div>

                        <div className='mt-6 space-y-3'>
                            <div className='flex items-center justify-between rounded-lg bg-[#2a2a2a] p-4'>
                                <span className='text-sm text-[#d0c2d5]'>Total Templates</span>
                                <span className='text-2xl font-bold text-[#e0b6ff]'>{templates.length}</span>
                            </div>
                            <div className='flex items-center justify-between rounded-lg bg-[#2a2a2a] p-4'>
                                <span className='text-sm text-[#d0c2d5]'>With Commands</span>
                                <span className='text-2xl font-bold text-[#e0b6ff]'>
                                    {templates.filter(t => t.commands).length}
                                </span>
                            </div>
                            <div className='flex items-center justify-between rounded-lg bg-[#2a2a2a] p-4'>
                                <span className='text-sm text-[#d0c2d5]'>With Tags</span>
                                <span className='text-2xl font-bold text-[#e0b6ff]'>
                                    {templates.filter(t => t.tags && t.tags.length > 0).length}
                                </span>
                            </div>
                        </div>
                    </article>

                    <aside className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-6'>
                        <div className='inline-flex rounded-xl border border-[#4d4353]/25 bg-[#2b2b31] p-3'>
                            <span className='text-[11px] font-black uppercase tracking-[0.2em] text-[#e0b6ff]'>Tip</span>
                        </div>
                        <h3 className='mt-5 text-lg font-bold tracking-tight text-[#e2e2e2]'>
                            Organize with Tags
                        </h3>
                        <p className='mt-3 text-xs leading-relaxed text-[#998d9e]'>
                            Use tags when creating templates to easily find and organize your code snippets later.
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default MyTemplates
