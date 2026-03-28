import Constants from "@/data/Constants";
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { Maximize2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";


const luminousNoirTheme = {
  colors: {
    surface1: "#111114",
    surface2: "#0f0f10",
    surface3: "#1b1b1f",
    clickable: "#998d9e",
    base: "#e2e2e2",
    disabled: "#5d5464",
    hover: "#2a2a2f",
    accent: "#e0b6ff",
    error: "#ff6363",
    errorSurface: "#2a1114",
  },
  syntax: {
    plain: "#e2e2e2",
    comment: "#756980",
    keyword: "#e0b6ff",
    tag: "#f7d18c",
    punctuation: "#d0c2d5",
    definition: "#9ecbff",
    property: "#8dd3ff",
    static: "#f0a3b8",
    string: "#ffd580",
  },
  font: {
    body: "JetBrains Mono, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
    mono: "JetBrains Mono, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
    size: "13px",
    lineHeight: "1.6",
  },
};

function EditorPane({ loading, isReady, onProvideCurrentCode }: any) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    onProvideCurrentCode?.(() => sandpack.files[sandpack.activeFile]?.code ?? "");
  }, [sandpack, onProvideCurrentCode]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#4d4353]/20 bg-[#111114]">
      <div className="flex h-10 items-center justify-between border-b border-[#4d4353]/20 px-4">
        <div className="flex items-center gap-3 text-xs text-[#998d9e]">
          <span className="text-[#e0b6ff]">&lt;&gt;</span>
          <span className="font-semibold text-[#e2e2e2]">App.tsx</span>
          <span className="hidden text-[#756980] md:inline">components/Header.tsx</span>
        </div>
        {loading && <span className="text-[11px] text-[#c8a8e3]">Generating...</span>}
        {!loading && !isReady && <span className="text-[11px] text-[#998d9e]">Streaming response...</span>}
      </div>

      <SandpackCodeEditor
        showTabs={false}
        showRunButton={false}
        style={{ height: "78vh", backgroundColor: "#0f0f10" }}
        wrapContent
      />
    </div>
  );
}

function PreviewPane() {
  const { sandpack } = useSandpack();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerClass = isFullscreen
    ? "fixed inset-4 z-[90] overflow-hidden rounded-xl border border-[#4d4353]/30 bg-[#111114] shadow-2xl"
    : "overflow-hidden rounded-xl border border-[#4d4353]/20 bg-[#111114]";

  return (
    <div className={containerClass}>
      <div className="flex h-10 items-center justify-between border-b border-[#4d4353]/20 px-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#998d9e]">Live Preview</span>
        <div className="flex items-center gap-2 text-[#998d9e]">
          <button
            className="rounded p-1 hover:bg-[#1f1f1f] hover:text-[#d0c2d5]"
            aria-label="Refresh preview"
            onClick={() => sandpack.runSandpack()}
            type="button"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
          </button>
          <button
            className="rounded p-1 hover:bg-[#1f1f1f] hover:text-[#d0c2d5]"
            aria-label={isFullscreen ? "Exit expanded preview" : "Expand preview"}
            onClick={() => setIsFullscreen((prev: boolean) => !prev)}
            type="button"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={isFullscreen ? "h-[calc(100vh-6rem)] bg-[#09090b]" : "h-[78vh] bg-[#09090b]"}>
        <SandpackPreview
          showOpenInCodeSandbox={false}
          showRefreshButton={false}
          style={{ height: "100%", border: "0px" }}
        />
      </div>
    </div>
  );
}

function StreamingEditorPane({ codeResp, loading }: any) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#4d4353]/20 bg-[#111114]">
      <div className="flex h-10 items-center justify-between border-b border-[#4d4353]/20 px-4">
        <div className="flex items-center gap-3 text-xs text-[#998d9e]">
          <span className="text-[#e0b6ff]">&lt;&gt;</span>
          <span className="font-semibold text-[#e2e2e2]">App.tsx</span>
          <span className="hidden text-[#756980] md:inline">components/Header.tsx</span>
        </div>
        <span className="text-[11px] text-[#c8a8e3]">{loading ? "Generating..." : "Finalizing..."}</span>
      </div>
      <pre className="h-[78vh] overflow-auto whitespace-pre-wrap bg-[#0f0f10] p-4 text-[13px] leading-6 text-[#e2e2e2]">
        {codeResp || "// Generating code..."}
      </pre>
    </div>
  );
}

function CodeEditor({ codeResp, isReady, loading, onProvideCurrentCode }: any) {
  const ensureTailwindImport = (rawCode: string) => {
    const fallbackCode = rawCode?.length ? rawCode : "// Generating code...";
    const hasStyleImport = /import\s+['\"]\.\/(App|styles)\.css['\"];?/m.test(fallbackCode);

    if (hasStyleImport) {
      return fallbackCode;
    }

    return `import './App.css';\n${fallbackCode}`;
  };

  const finalCode = ensureTailwindImport(codeResp ?? "");
  const shouldMountSandpack = !loading && isReady && Boolean(codeResp?.trim());

  useEffect(() => {
    if (!shouldMountSandpack) {
      onProvideCurrentCode?.(() => codeResp ?? "");
    }
  }, [shouldMountSandpack, codeResp, onProvideCurrentCode]);

  if (!shouldMountSandpack) {
    return (
      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_0.65fr]">
        <StreamingEditorPane codeResp={codeResp} loading={loading} />
        <div className="overflow-hidden rounded-xl border border-[#4d4353]/20 bg-[#111114]">
          <div className="flex h-10 items-center border-b border-[#4d4353]/20 px-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#998d9e]">Live Preview</span>
          </div>
          <div className="grid h-[78vh] place-content-center bg-[#09090b] p-6 text-center">
            <p className="text-sm text-[#998d9e]">Waiting for full generation...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <SandpackProvider
      template="react"
      theme={luminousNoirTheme as any}
      options={{
        externalResources: [
          "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
        ],
      }}
      files={{
        "/App.js": {
          code: finalCode,
          active: true,
        },
        "/App.css": {
          code: "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
        },
        "/tailwind.config.js": {
          code: "module.exports = {\n  content: ['./**/*.{js,jsx,ts,tsx}'],\n  theme: { extend: {} },\n  plugins: [],\n};\n",
        },
        "/postcss.config.js": {
          code: "module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n",
        },
      }}
      customSetup={{
        dependencies: {
          ...Constants.DEPENDANCY,
        },
      }}
    >
      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_0.65fr]">
        <EditorPane loading={loading} isReady={isReady} onProvideCurrentCode={onProvideCurrentCode} />
        <PreviewPane />
      </section>
    </SandpackProvider>
  );
}
export default CodeEditor;
