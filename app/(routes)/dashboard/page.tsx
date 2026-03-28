import React from "react";
import ImageUpload from "./_components/ImageUpload";

function Dashboard() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#9d4edd]/10 blur-[110px]" />
      <div className="relative z-10">
        <h1 className="text-4xl font-black tracking-tight text-[#e2e2e2] md:text-5xl">Convert wireframe to code</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#d0c2d5]/75">
          Transform your visual concepts into production-ready frontend components using AI. Simply upload
          your wireframe and let our engine handle the heavy lifting.
        </p>
        <ImageUpload />
      </div>
    </section>
  );
}

export default Dashboard;
