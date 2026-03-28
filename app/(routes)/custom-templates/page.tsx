import React from "react";
import CustomTemplateForm from "./_components/CustomTemplateForm";

function CustomTemplates() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#9d4edd]/10 blur-[110px]" />
      <div className="relative z-10">
        <h1 className="text-4xl font-black tracking-tight text-[#e2e2e2] md:text-5xl">
          Create Custom Template
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-[#d0c2d5]/75">
          Save your code snippets as reusable templates for future projects. Organize them with names, descriptions, and tags for easy discovery.
        </p>
        <CustomTemplateForm />
      </div>
    </section>
  );
}

export default CustomTemplates;
