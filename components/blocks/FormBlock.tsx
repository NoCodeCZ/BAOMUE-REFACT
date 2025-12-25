"use client";

import { useState } from "react";
import type { BlockForm, Form, FormField } from "@/lib/types";

interface FormBlockProps {
  data?: BlockForm | null;
  formData?: Form | null;
  compact?: boolean; // If true, render without section wrapper for embedded use
}

export default function FormBlock({ data, formData, compact = false }: FormBlockProps) {
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
    if (compact) {
      return (
        <div className="text-center">
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
      );
    }
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

  const formContent = (
    <form onSubmit={handleSubmit} className={compact ? "space-y-5" : "space-y-6"}>
      {fields
        .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
        .map((field) => (
          <div key={field.id}>
            <label className={compact 
              ? "block text-xs font-semibold text-slate-500 mb-1.5 ml-1"
              : "block text-sm font-medium text-slate-700 mb-2"
            }>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field, formState, handleChange, compact)}
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
        className={compact
          ? "w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm mt-2"
          : "w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-lg"
        }
      >
        {isSubmitting ? "กำลังส่ง..." : submitText}
      </button>
    </form>
  );

  if (compact) {
    return formContent;
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
        {formContent}
      </div>
    </section>
  );
}

function renderField(
  field: FormField,
  formState: Record<string, any>,
  onChange: (field: string, value: any) => void,
  compact: boolean = false
) {
  const value = formState[field.label] ?? "";
  const baseClass = compact
    ? "w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
    : "w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors";

  switch (field.field_type) {
    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={compact
            ? "w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none placeholder:text-slate-400"
            : `${baseClass} h-32 resize-none`
          }
          rows={compact ? 3 : undefined}
        />
      );

    case "select":
      return (
        <div className="relative">
          <select
            required={field.required}
            value={value}
            onChange={(e) => onChange(field.label, e.target.value)}
            className={`${baseClass} ${compact ? "appearance-none cursor-pointer" : ""}`}
          >
            <option value="">{field.placeholder || "เลือก..."}</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {compact && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div className={compact ? "bg-slate-50 rounded-xl p-4 border border-slate-100/50" : "flex items-center gap-3"}>
          <label className={compact ? "flex items-start gap-3 cursor-pointer group" : "flex items-center gap-3"}>
            <div className={compact ? "relative mt-0.5 shrink-0" : ""}>
              <input
                type="checkbox"
                required={field.required}
                checked={!!value}
                onChange={(e) => onChange(field.label, e.target.checked)}
                className={compact
                  ? "peer sr-only"
                  : "w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                }
              />
              {compact && (
                <>
                  <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </>
              )}
            </div>
            <span className={compact ? "text-xs text-slate-500 leading-relaxed" : "text-slate-600"}>
              {field.placeholder || field.label}
            </span>
          </label>
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
      // For phone fields, check if label contains phone-related keywords
      const isPhoneField = field.label.toLowerCase().includes('phone') || 
                          field.label.toLowerCase().includes('tel') ||
                          field.label.toLowerCase().includes('เบอร์');
      return (
        <input
          type={isPhoneField ? "tel" : "text"}
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={baseClass}
        />
      );
  }
}

