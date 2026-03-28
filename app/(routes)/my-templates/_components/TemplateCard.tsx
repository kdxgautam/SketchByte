"use client"
import { Code2, Ellipsis, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
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

function TemplateCard({ template, index = 0, onDelete }: { template: Template; index?: number; onDelete?: (uid: string) => void }) {
    const [showMenu, setShowMenu] = useState(false)
    const tagsArray = Array.isArray(template.tags) ? template.tags : []
    const extractedCode = (() => {
        if (typeof template.templateData === 'string') {
            return template.templateData
        }

        if (
            template.templateData &&
            typeof template.templateData === 'object' &&
            typeof template.templateData.code === 'string'
        ) {
            return template.templateData.code
        }

        if (
            template.templateData &&
            typeof template.templateData === 'object' &&
            Array.isArray(template.templateData.codeBlocks)
        ) {
            const codeBlocks = template.templateData.codeBlocks
            const firstNonEmptyCodeBlock = codeBlocks.find(
                (block: { code?: unknown }) => typeof block?.code === 'string' && block.code.trim().length > 0
            )

            if (firstNonEmptyCodeBlock && typeof firstNonEmptyCodeBlock.code === 'string') {
                return firstNonEmptyCodeBlock.code
            }
        }

        return JSON.stringify(template.templateData, null, 2)
    })()

    const handleCopyCode = () => {
        navigator.clipboard.writeText(extractedCode)
        toast.success('Code copied to clipboard!')
    }

    const handleCopyCommands = () => {
        if (template.commands) {
            navigator.clipboard.writeText(template.commands)
            toast.success('Commands copied to clipboard!')
        }
    }

    const handleDelete = () => {
        onDelete?.(template.uid)
        setShowMenu(false)
    }

    return (
        <article className='group overflow-hidden rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] transition-all duration-300 hover:border-[#e0b6ff]/25 hover:shadow-[0_14px_38px_rgba(0,0,0,0.35)]'>
            {/* Header with Icon and Status */}
            <div className='relative bg-gradient-to-r from-[#9d4edd]/20 to-[#6f5a7d]/10 p-5'>
                <div className='flex items-start justify-between'>
                    <div className='inline-flex rounded-lg border border-[#4d4353]/25 bg-[#2a2a2a] p-3'>
                        <Code2 className='h-5 w-5 text-[#e0b6ff]' />
                    </div>
                    <div className='relative'>
                        <button
                            className='rounded-md p-1 text-[#998d9e] transition-colors hover:bg-[#2a2a2a] hover:text-[#d0c2d5]'
                            onClick={() => setShowMenu(!showMenu)}
                            aria-label='Open actions'
                        >
                            <Ellipsis className='h-4 w-4' />
                        </button>
                        {showMenu && (
                            <div className='absolute right-0 top-full mt-1 z-50 rounded-lg border border-[#4d4353]/25 bg-[#222225] shadow-lg'>
                                <button
                                    onClick={handleCopyCode}
                                    className='block w-full px-4 py-2 text-left text-xs font-semibold text-[#d0c2d5] hover:bg-[#2a2a2a] hover:text-[#e0b6ff] rounded-t-lg'
                                >
                                    Copy Code
                                </button>
                                <Link
                                    href={`/my-templates/${template.uid}`}
                                    className='block w-full px-4 py-2 text-left text-xs font-semibold text-[#d0c2d5] hover:bg-[#2a2a2a] hover:text-[#e0b6ff] border-t border-[#4d4353]/20'
                                >
                                    View Code
                                </Link>
                                {template.commands && (
                                    <button
                                        onClick={handleCopyCommands}
                                        className='block w-full px-4 py-2 text-left text-xs font-semibold text-[#d0c2d5] hover:bg-[#2a2a2a] hover:text-[#e0b6ff] border-t border-[#4d4353]/20'
                                    >
                                        Copy Commands
                                    </button>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className='block w-full px-4 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-b-lg border-t border-[#4d4353]/20'
                                >
                                    <Trash2 className='h-3 w-3 inline mr-2' />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className='space-y-4 p-5'>
                <div>
                    <h3 className='line-clamp-2 text-2xl font-bold leading-tight tracking-tight text-[#e2e2e2]'>
                        {template.name}
                    </h3>
                    {template.description && (
                        <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-[#998d9e]'>
                            {template.description}
                        </p>
                    )}
                </div>

                {/* Tags */}
                {tagsArray.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                        {tagsArray.map((tag, idx) => (
                            <span
                                key={idx}
                                className='inline-flex rounded-full border border-[#4d4353]/30 bg-[#2a2a2a] px-3 py-1 text-xs font-medium text-[#d0c2d5]'
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Code Preview */}
                <div className='rounded-lg border border-[#4d4353]/20 bg-[#222225] p-3'>
                    <p className='mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#998d9e]'>Code Preview</p>
                    <code className='block overflow-hidden text-ellipsis truncate font-mono text-xs text-[#a0a0a0]'>
                        {extractedCode.substring(0, 80) + (extractedCode.length > 80 ? '...' : '')}
                    </code>
                </div>

                {/* Commands Display */}
                {template.commands && (
                    <div className='rounded-lg border border-[#4d4353]/20 bg-[#222225] p-3'>
                        <p className='mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#998d9e]'>Commands</p>
                        <code className='block overflow-hidden text-ellipsis whitespace-pre-wrap break-words font-mono text-xs text-[#a0a0a0]'>
                            {template.commands.split('\n')[0].substring(0, 60)}
                            {template.commands.split('\n').length > 1 && '...'}
                        </code>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    href={`/my-templates/${template.uid}`}
                    className='w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#e0b6ff] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#171717] transition-colors hover:bg-[#f2daff]'
                >
                    <Eye className='h-3.5 w-3.5' />
                    View Code
                </Link>
            </div>
        </article>
    )
}

export default TemplateCard
