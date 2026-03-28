"use client"
import Constants from '@/data/Constants'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import SelectionDetail from '../_components/SelectionDetail'
import CodeEditor from '../_components/CodeEditor'
import Link from 'next/link'
import { toast } from 'sonner'

export interface RECORD {
    id: number,
    description: string,
    code: any,
    imageUrl: string,
    model: string,
    createdBy: string,
    uid: string
}

function ViewCode() {

    const { uid } = useParams();
    const [loading, setLoading] = useState(false);
    const [codeResp, setCodeResp] = useState('');
    const [record, setRecord] = useState<RECORD | null>();
    const [isReady, setIsReady] = useState(false);
    const [hasInitialPersisted, setHasInitialPersisted] = useState(false);
    const getCurrentEditorCodeRef = useRef<(() => string) | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            uid && GetRecordInfo();
        }
    }, [uid])

    const sanitizeGeneratedCode = (raw: string) => {
        const fallback = `export default function App() {\n  return (\n    <main className="min-h-screen bg-black text-white grid place-content-center p-8">\n      <div className="text-center">\n        <h1 className="text-3xl font-bold">Code generated, but formatting was invalid.</h1>\n        <p className="mt-3 text-neutral-300">Click Regenerate Code to try again.</p>\n      </div>\n    </main>\n  );\n}`;

        if (!raw?.trim()) return fallback;

        let cleaned = raw.replace(/^\uFEFF/, '').trim();

        // Prefer fenced code content when available.
        const fenceMatches = Array.from(
            cleaned.matchAll(/```(?:jsx|tsx|javascript|js|react)?\s*([\s\S]*?)```/gi)
        );
        if (fenceMatches.length > 0) {
            cleaned = fenceMatches
                .map((match) => match[1]?.trim() ?? '')
                .sort((a, b) => b.length - a.length)[0];
        }

        // Remove any residual markdown fences.
        cleaned = cleaned.replace(/```[a-zA-Z]*/g, '').replace(/```/g, '').trim();

        // If model returned prose/file labels before code, crop to likely code start.
        const startCandidates = ['import ', 'export default function', 'function App(', 'const App ='];
        const startIndices = startCandidates
            .map((token) => cleaned.indexOf(token))
            .filter((idx) => idx >= 0);

        if (startIndices.length > 0) {
            const firstCodeIndex = Math.min(...startIndices);
            cleaned = cleaned.slice(firstCodeIndex).trim();
        }

        // Ensure Sandpack receives a valid default export for /App.js.
        if (!/export\s+default\s+/m.test(cleaned)) {
            if (/\bfunction\s+App\s*\(/m.test(cleaned) || /\bconst\s+App\s*=\s*/m.test(cleaned)) {
                cleaned += '\n\nexport default App;';
            }
        }

        return cleaned || fallback;
    }

    const GetRecordInfo = async (regen = false) => {
        console.log("RUN...")
        setIsReady(false);
        setCodeResp('');
        setLoading(true)
        setHasInitialPersisted(false)

        try {
            const result = await axios.get('/api/wireframe-to-code?uid=' + uid)

            const resp = result?.data;
            setRecord(resp)

            if (resp?.code == null || regen) {
                await GenerateCode(resp);
            }
            else {
                const hydratedCode =
                    typeof resp?.code === 'string'
                        ? sanitizeGeneratedCode(resp.code)
                        : sanitizeGeneratedCode(resp?.code?.resp ?? '');

                setCodeResp(hydratedCode);
                setLoading(false);
                setIsReady(true);
                setHasInitialPersisted(true);
            }

            if (resp?.error) {
                console.log("No Record Found")
            }
        } catch (error) {
            console.error('Failed to load record:', error)
            toast('Failed to load project. Try again.');
            setLoading(false);
            setIsReady(true);
        }
        // setLoading(false);
    }

    const GenerateCode = async (record: RECORD) => {
        setLoading(true)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 90000);

            const res = await fetch('/api/ai-model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: `${record?.description}:${Constants.PROMPT}\n\nStrict output rules:\n- Return only valid React code for /App.js\n- No markdown fences\n- No explanations\n- Must include a default export`,
                    model: record.model,
                    imageUrl: record?.imageUrl
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.body) {
                throw new Error('No response body from AI model');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullResponse += chunk;
                setCodeResp((prev) => prev + chunk);
            }

            fullResponse += decoder.decode();

            const finalCode = sanitizeGeneratedCode(fullResponse);
            setCodeResp(finalCode);
            setIsReady(true);
        } catch (error) {
            console.error('Code generation failed:', error)
            const fallback = sanitizeGeneratedCode('');
            setCodeResp(fallback);
            setIsReady(true);
            toast('Generation failed once. Click Regenerate Code to retry.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!hasInitialPersisted && codeResp !== '' && record?.uid && isReady && record?.code == null) {
            UpdateCodeToDb(false, codeResp);
            setHasInitialPersisted(true);
        }
    }, [codeResp, record, isReady, hasInitialPersisted])


    const UpdateCodeToDb = async (showToast = false, codeToSave?: string) => {
        const latestCode = codeToSave ?? codeResp;
        if (!record?.uid || !latestCode) return;

        await axios.put('/api/wireframe-to-code', {
            uid: record?.uid,
            codeResp: { resp: latestCode }
        });

        if (showToast) {
            toast('Code saved successfully');
        }
    }



    return (
        <div className='min-h-screen bg-[#09090b] text-[#e2e2e2]'>
            <header className='sticky top-0 z-40 border-b border-[#4d4353]/20 bg-[#0f0f10]/80 backdrop-blur-xl'>
                <div className='flex h-14 items-center justify-between px-4 md:px-6'>
                    <div className='flex items-center gap-3'>
                        <Link href='/designs' className='rounded-md p-1.5 text-[#998d9e] transition-colors hover:bg-[#1f1f1f] hover:text-[#e0b6ff]'>
                            <ArrowLeft className='h-4 w-4' />
                        </Link>
                        <span className='text-sm font-semibold text-[#e2e2e2]'>App.js</span>
                        <span className='hidden text-xs text-[#756980] md:inline'>components/Header.tsx</span>
                    </div>
                </div>
            </header>

            <main className='p-3 md:p-4'>
                <div className='grid grid-cols-1 gap-3 xl:grid-cols-[280px_minmax(0,1fr)]'>
                    <SelectionDetail
                        record={record}
                        regenrateCode={() => { GetRecordInfo(true) }}
                        onSaveCode={() => {
                            const liveCode = getCurrentEditorCodeRef.current?.() ?? codeResp;
                            setCodeResp(liveCode);
                            UpdateCodeToDb(true, liveCode);
                        }}
                        isReady={isReady}
                        loading={loading}
                    />
                    <CodeEditor
                        codeResp={codeResp}
                        isReady={isReady}
                        loading={loading}
                        onProvideCurrentCode={(getter: () => string) => {
                            getCurrentEditorCodeRef.current = getter;
                        }}
                    />
                </div>
            </main>

        </div>
    )
}

export default ViewCode