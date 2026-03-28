import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw, Save } from 'lucide-react'

function SelectionDetail({ record, regenrateCode, onSaveCode, isReady, loading }: any) {
    return record && (
        <aside className='space-y-3'>
            <div className='rounded-xl border border-[#4d4353]/20 bg-[#111114] p-3'>
                <div className='mb-3 flex items-center justify-between border-b border-[#4d4353]/20 pb-2'>
                    <h2 className='text-[10px] font-semibold uppercase tracking-[0.22em] text-[#998d9e]'>Wireframe</h2>
                    <span className='text-xs text-[#4b4252]'>•••</span>
                </div>

                <div className='rounded-lg border border-dashed border-[#4d4353]/30 bg-[#0b0b0d] p-2'>
                    <Image
                        src={record?.imageUrl}
                        alt='Wireframe'
                        width={300}
                        height={400}
                        className='h-[540px] w-full rounded-md object-cover'
                    />
                </div>

                <div className='mt-3 rounded-lg border border-[#4d4353]/20 bg-[#17171b] p-3'>
                    <p className='text-xs font-semibold text-[#d0c2d5]'>Layout: Dashboard v2.1</p>
                    <p className='mt-1 text-[11px] text-[#756980]'>Last modified: 2 mins ago</p>
                </div>
            </div>

            <div className='rounded-xl border border-[#4d4353]/20 bg-[#111114] p-3 space-y-2'>
                <Button
                    className='h-11 w-full rounded-md bg-gradient-to-r from-[#c69ceb] to-[#9d4edd] text-xs font-bold uppercase tracking-[0.14em] text-[#2e004e] hover:opacity-95'
                    disabled={!isReady || loading}
                    onClick={() => onSaveCode()}
                >
                    <Save className='h-4 w-4' />
                    Save Code
                </Button>

                <Button
                    variant='outline'
                    className='h-11 w-full rounded-md border-[#4d4353]/30 bg-[#17171b] text-xs font-bold uppercase tracking-[0.12em] text-[#d0c2d5] hover:bg-[#1f1f22] hover:text-[#f2daff]'
                    disabled={!isReady || loading}
                    onClick={() => regenrateCode()}
                >
                    {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <RefreshCcw className='h-4 w-4' />}
                    Regenerate Code
                </Button>
            </div>
        </aside>
    )
}

export default SelectionDetail