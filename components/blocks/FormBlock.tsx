"use client";

import { useState } from "react";
import type { BlockForm, Form, FormField } from "@/lib/types";

interface FormBlockProps {
  data?: BlockForm | null;
  formData?: Form | null;
}

export default function FormBlock({ data, formData }: FormBlockProps) {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!data || !formData) return null;

  const title = data.title ?? "";
  const description = data.description ?? "";
  const bgStyle = data.background_style ?? "white";
  const fields = formData.fields ?? [];
  const submitText = formData.submit_button_text ?? "ส่งข้อมูล";
  const successMessage = formData.success_message ?? "ส่งข้อมูลสำเร็จแล้ว ขอบคุณครับ/ค่ะ";

  const bgClasses: Record<string, string> = {
    white: "bg-white",
    gray: "bg-slate-50",
    primary: "bg-cyan-50",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "form",
          formId: formData.id,
          data: formState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSuccess(true);
      setFormState({});

      if (formData.redirect_url) {
        window.location.href = formData.redirect_url;
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  if (isSuccess) {
    return (
      <section className={`py-16 px-4 ${bgClasses[bgStyle] || bgClasses.white}`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <svg
              className="w-16 h-16 mx-auto text-green-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-lg text-green-800">{successMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 lg:py-24 px-4 ${bgClasses[bgStyle] || bgClasses.white}`}>
      <div className="max-w-2xl mx-auto">
        {title && (
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center text-slate-900 mb-4">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-center text-slate-600 text-lg mb-10">{description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields
            .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
            .map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field, formState, handleChange)}
              </div>
            ))}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            {isSubmitting ? "กำลังส่ง..." : submitText}
          </button>
        </form>
      </div>
    </section>
  );
}

function renderField(
  field: FormField,
  formState: Record<string, any>,
  onChange: (field: string, value: any) => void
) {
  const value = formState[field.label] ?? "";
  const baseClass =
    "w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors";

  switch (field.field_type) {
    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={`${baseClass} h-32 resize-none`}
        />
      );

    case "select":
      return (
        <select
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={baseClass}
        >
          <option value="">{field.placeholder || "เลือก..."}</option>
          {field.options?.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            required={field.required}
            checked={!!value}
            onChange={(e) => onChange(field.label, e.target.checked)}
            className="w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
          />
          <span className="text-slate-600">{field.placeholder}</span>
        </div>
      );

    case "radio":
      return (
        <div className="space-y-3">
          {field.options?.map((opt, i) => (
            <label key={i} className="flex items-center gap-3">
              <input
                type="radio"
                name={field.label}
                value={opt.value}
                required={field.required}
                checked={value === opt.value}
                onChange={(e) => onChange(field.label, e.target.value)}
                className="w-5 h-5 text-cyan-600 border-slate-300 focus:ring-cyan-500"
              />
              <span className="text-slate-600">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case "email":
      return (
        <input
          type="email"
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={baseClass}
        />
      );

    default:
      return (
        <input
          type="text"
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={baseClass}
        />
      );
  }
}

