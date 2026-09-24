"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validation/lead";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { FieldError } from "@/components/ui/FieldError";
import { PhoneInput } from "@/components/ui/PhoneInput";

export function LeadForm() {
  const [startedAt, setStartedAt] = useState<number>(0);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      email: "",
      contactNo: "",
      solutionRequired: "",
      noOfDocuments: "",
      painPoint: "",
      company_website: "", // honeypot
      startedAt: 0,
    },
  });

  const onSubmit = async (data: LeadInput) => {
    setSubmitStatus("submitting");
    setErrorMessage("");

    try {
      data.startedAt = startedAt;
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        setSubmitStatus("error");
        setErrorMessage(result.message || "Submission failed. Please check your inputs.");
        return;
      }

      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again later.");
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="bg-white p-8 rounded-[var(--radius-card)] shadow-lg text-center">
        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">Thank you!</h3>
        <p className="text-[var(--color-text-body)]">We've received your request and will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] space-y-6">
      <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4">Request a Demo</h3>

      {submitStatus === "error" && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {errorMessage}
        </div>
      )}

      {/* Honeypot */}
      <input type="text" {...register("company_website")} className="hidden" aria-hidden="true" tabIndex={-1} />

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-text-body)] mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="firstName"
          {...register("firstName")}
          className="w-full px-3 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-input)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)]"
          placeholder="Jane Doe"
          aria-invalid={!!errors.firstName}
        />
        <FieldError id="err-firstName" message={errors.firstName?.message} />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-body)] mb-1">
          Work Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full px-3 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-input)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)]"
          placeholder="jane@company.com"
          aria-invalid={!!errors.email}
        />
        <FieldError id="err-email" message={errors.email?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-body)] mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <Controller
          name="contactNo"
          control={control}
          render={({ field }) => (
            <PhoneInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={!!errors.contactNo}
            />
          )}
        />
        <FieldError id="err-phone" message={errors.contactNo?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-body)] mb-1">
          Solutions Required <span className="text-red-500">*</span>
        </label>
        <Controller
          name="solutionRequired"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              options={[
                { label: "Data Extraction", value: "extraction" },
                { label: "Data Interpretation", value: "interpretation" },
                { label: "Straight Through Processing (STP)", value: "stp" },
                { label: "Other", value: "other" },
              ]}
              invalid={!!errors.solutionRequired}
            />
          )}
        />
        <FieldError id="err-solution" message={errors.solutionRequired?.message} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text-body)] mb-1">
          Number of Documents/Month <span className="text-red-500">*</span>
        </label>
        <Controller
          name="noOfDocuments"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              options={[
                { label: "0 - 10,000", value: "0-10k" },
                { label: "10,001 - 50,000", value: "10k-50k" },
                { label: "50,001 - 100,000", value: "50k-100k" },
                { label: "100,000+", value: "100k+" },
              ]}
              invalid={!!errors.noOfDocuments}
            />
          )}
        />
        <FieldError id="err-docs" message={errors.noOfDocuments?.message} />
      </div>

      <div>
        <label htmlFor="painPoint" className="block text-sm font-medium text-[var(--color-text-body)] mb-1">
          Biggest Challenge (Optional)
        </label>
        <textarea
          id="painPoint"
          {...register("painPoint")}
          rows={3}
          className="w-full px-3 py-2.5 text-sm border border-[var(--color-border)] rounded-[var(--radius-input)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-link)] resize-y"
          placeholder="What are you trying to solve?"
        />
        <FieldError id="err-pain" message={errors.painPoint?.message} />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full justify-center"
        disabled={isSubmitting || submitStatus === "submitting"}
      >
        {isSubmitting || submitStatus === "submitting" ? "Submitting..." : "Get Free Demo"}
      </Button>
    </form>
  );
}
