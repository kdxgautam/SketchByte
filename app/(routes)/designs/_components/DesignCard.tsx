import { RECORD } from '@/app/view-code/[uid]/page'
import Constants from '@/data/Constants'
import { Code, Ellipsis, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function DesignCard({ item, index = 0, onDelete }: { item: RECORD, index?: number, onDelete?: (uid: string) => void }) {
    const [showMenu, setShowMenu] = React.useState(false)
    const modelObj = item && Constants.AiModelList.find((x => x.name == item?.model))
    const statusList = ['Draft', 'Verified', 'In Review'];
    const updatedList = ['Updated 1h ago', 'Updated 1d ago', 'Updated 3h ago'];

    const handleDelete = () => {
        onDelete?.(item.uid)
        setShowMenu(false)
    }

    return (
        <article className='group overflow-hidden rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] transition-all duration-300 hover:border-[#e0b6ff]/25 hover:shadow-[0_14px_38px_rgba(0,0,0,0.35)]'>
            <div className='relative'>
                <Image
                    src={item?.imageUrl || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                    alt='Wireframe preview'
                    width={500}
                    height={300}
                    priority={index === 0}
                    sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
                    className='h-44 w-full object-cover'
                />
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#101012]/45 to-[#101012]' />

                <div className='absolute left-4 top-4 inline-flex rounded-sm border border-white/15 bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f1f1f1]'>
                    {statusList[index % statusList.length]}
                </div>
            </div>

            <div className='space-y-4 p-5'>
                <div className='flex items-start justify-between gap-3'>
                    <h3 className='line-clamp-2 text-[29px] font-bold leading-[1.08] tracking-tight text-[#e2e2e2] md:text-[31px]'>
                        {item?.description || 'Untitled project'}
                    </h3>
                    <div className='relative'>
                        <button
                            className='rounded-md p-1 text-[#998d9e] transition-colors hover:bg-[#2a2a2a] hover:text-[#d0c2d5]'
                            aria-label='Open actions'
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <Ellipsis className='h-4 w-4' />
                        </button>

                        {showMenu && (
                            <div className='absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-[#4d4353]/25 bg-[#222225] shadow-lg'>
                                <button
                                    onClick={handleDelete}
                                    className='flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-500/10'
                                >
                                    <Trash2 className='h-3.5 w-3.5' />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <p className='line-clamp-2 text-sm leading-relaxed text-[#998d9e]'>
                    {item?.description || 'A generated wireframe design ready for inspection and code export.'}
                </p>

                <div className='flex items-center justify-between'>
                    <div className='inline-flex items-center gap-2 rounded-full border border-[#4d4353]/30 bg-[#2a2a2a] px-3 py-1.5 text-xs text-[#d0c2d5]'>
                        {modelObj && <Image src={modelObj?.icon} alt={modelObj?.modelName ?? ''} width={14} height={14} className='h-3.5 w-3.5 rounded-full' />}
                        <span>{modelObj?.name || 'Luminous AI'}</span>
                    </div>

                    <Link
                        href={'/view-code/' + item?.uid}
                        className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#e0b6ff] transition-colors hover:text-[#f2daff]'
                    >
                        <Code className='h-3.5 w-3.5' />
                        View Code
                    </Link>
                </div>

                <p className='text-[11px] text-[#756980]'>{updatedList[index % updatedList.length]}</p>
            </div>
        </article>
    )
}

export default DesignCard