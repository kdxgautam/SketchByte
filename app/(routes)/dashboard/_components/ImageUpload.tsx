"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CloudUpload, FileImage, Loader2Icon, Sparkles, WandSparkles, X } from 'lucide-react'
import Image from 'next/image'
//@ts-ignore
import uuid4 from "uuid4";
import React, { ChangeEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/configs/firebaseConfig'
import axios from 'axios'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import Constants from '@/data/Constants'
import { toast } from 'sonner'
function ImageUpload() {

    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile] = useState<any>();
    const [model, setModel] = useState<string>();
    const [description, setDescription] = useState<string>();
    const { user } = useAuthContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const OnImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            console.log(files[0])
            const imageUrl = URL.createObjectURL(files[0]);
            setFile(files[0]);
            setPreviewUrl(imageUrl);
        }
    }

    const OnConverToCodeButtonClick = async () => {
        if (!file || !model || !description) {
            console.log("Select All Field");
            return;
        }
        setLoading(true);
        //Save Image to Firebase
        const fileName = Date.now() + '.png';
        const imageRef = ref(storage, "Wireframe_To_Code/" + fileName);
        await uploadBytes(imageRef, file).then(resp => {
            console.log("Image Uploaded...")
        });

        const imageUrl = await getDownloadURL(imageRef);
        console.log(imageUrl);

        const uid = uuid4();
        console.log(uid);
        // Save Info To Database
        const result = await axios.post('/api/wireframe-to-code', {
            uid: uid,
            description: description,
            imageUrl: imageUrl,
            model: model,
            email: user?.email
        });
        if (result.data?.error) {
            console.log("Not Enough credits");
            toast('Not Enough Credits!');
            setLoading(false);
            return;
        }
        setLoading(false);
        router.push('/view-code/' + uid);
    }

    return (
        <section className='mt-8'>
            <div className='grid grid-cols-1 gap-6 xl:grid-cols-5'>
                <div className='xl:col-span-3'>
                    <div className='relative min-h-[450px] rounded-2xl border border-dashed border-[#4d4353]/30 bg-[#1b1b1b] p-6'>
                        <div className='pointer-events-none absolute left-8 top-6 h-40 w-40 rounded-full bg-[#9d4edd]/8 blur-[85px]' />

                        {!previewUrl ? (
                            <div className='flex h-full min-h-[390px] flex-col items-center justify-center text-center'>
                                <div className='mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-[#4d4353]/30 bg-[#2a2a2a]'>
                                    <CloudUpload className='h-6 w-6 text-[#e0b6ff]' />
                                </div>
                                <h3 className='text-3xl font-black tracking-tight text-[#e2e2e2]'>Drop your wireframe here</h3>
                                <p className='mt-2 text-xs uppercase tracking-[0.14em] text-[#998d9e]'>PNG, JPG or PDF up to 20MB</p>

                                <label
                                    htmlFor='imageSelect'
                                    className='mt-6 inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#f4f4f4] px-4 py-2.5 text-sm font-bold text-[#171717] transition-colors hover:bg-white'
                                >
                                    <FileImage className='h-4 w-4' />
                                    Select Image
                                </label>
                            </div>
                        ) : (
                            <div className='h-full'>
                                <div className='relative overflow-hidden rounded-xl border border-[#4d4353]/25 bg-[#0f0f10]'>
                                    <Image
                                        src={previewUrl}
                                        alt='Wireframe preview'
                                        width={900}
                                        height={640}
                                        className='h-[390px] w-full object-contain'
                                    />
                                </div>

                                <button
                                    className='mt-4 inline-flex items-center gap-2 rounded-md border border-[#4d4353]/25 bg-[#1f1f1f] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#d0c2d5] hover:border-[#e0b6ff]/25 hover:text-[#f2daff]'
                                    onClick={() => {
                                        setPreviewUrl(null);
                                        setFile(null);
                                    }}
                                >
                                    <X className='h-3.5 w-3.5' />
                                    Remove image
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            id='imageSelect'
                            className='hidden'
                            multiple={false}
                            onChange={OnImageSelect}
                        />
                    </div>
                </div>

                <div className='xl:col-span-2'>
                    <div className='space-y-4'>
                        <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
                            <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-[#998d9e]'>Configuration</p>

                            <div className='mt-4'>
                                <label className='text-[10px] font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>AI Model</label>
                                <Select onValueChange={(value) => setModel(value)}>
                                    <SelectTrigger className="mt-2 h-11 border-[#4d4353]/25 bg-[#222225] text-[#e2e2e2] focus:ring-[#e0b6ff]/20">
                                        <SelectValue placeholder="Select Model" />
                                    </SelectTrigger>
                                    <SelectContent className='border-[#4d4353]/30 bg-[#222225] text-[#e2e2e2]'>
                                        {Constants?.AiModelList.map((model, index) => (
                                            <SelectItem
                                                value={model.name}
                                                key={index}
                                                className='focus:bg-[#2a2a2a] focus:text-[#e2e2e2]'
                                            >
                                                <div className='flex items-center gap-2'>
                                                    <Image src={model.icon} alt={model.name} width={16} height={16} className='h-4 w-4 rounded-full' />
                                                    <span>{model.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='mt-5'>
                                <label className='text-[10px] font-semibold uppercase tracking-[0.15em] text-[#998d9e]'>Webpage Description</label>
                                <Textarea
                                    onChange={(event) => setDescription(event?.target.value)}
                                    className='mt-2 h-[110px] resize-none border-[#4d4353]/20 bg-[#222225] text-[#d0c2d5] placeholder:text-[#756980] focus-visible:ring-[#e0b6ff]/20'
                                    placeholder='Describe the functionality, animations and sections...'
                                />
                            </div>

                            <Button
                                onClick={OnConverToCodeButtonClick}
                                disabled={loading}
                                className='mt-7 h-12 w-full rounded-md bg-gradient-to-r from-[#deb2ff] to-[#9d4edd] text-xs font-black uppercase tracking-[0.14em] text-[#2e004e] shadow-[0_10px_30px_rgba(157,78,221,0.3)] transition-all hover:shadow-[0_15px_40px_rgba(157,78,221,0.5)]'
                            >
                                {loading ? <Loader2Icon className='animate-spin' /> : <WandSparkles className='h-4 w-4' />}
                                Generate Code
                            </Button>
                        </div>

                        <div className='rounded-2xl border border-[#4d4353]/20 bg-[#1b1b1b] p-5'>
                            <p className='text-[11px] font-semibold uppercase tracking-[0.2em] text-[#998d9e]'>Best Results Checklist</p>
                            <ul className='mt-4 space-y-2.5 text-xs text-[#b9a5c9]'>
                                <li className='flex items-center gap-2'>
                                    <Sparkles className='h-3.5 w-3.5 text-[#e0b6ff]' />
                                    Use high-contrast lines.
                                </li>
                                <li className='flex items-center gap-2'>
                                    <Sparkles className='h-3.5 w-3.5 text-[#e0b6ff]' />
                                    Label major sections.
                                </li>
                                <li className='flex items-center gap-2'>
                                    <Sparkles className='h-3.5 w-3.5 text-[#e0b6ff]' />
                                    Avoid heavy overlapping.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ImageUpload