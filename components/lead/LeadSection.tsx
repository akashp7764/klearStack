// components/lead/LeadSection.tsx — STUB (replaced in Phase 03)
export default function LeadSection() {
  return (
    <section
      id="contact"
      aria-labelledby="lead-section-title"
      style={{
        background: "var(--color-bg-base)",
        padding: "5rem 2rem",
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
        <h2
          id="lead-section-title"
          style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "1rem" }}
        >
          Lead Generation Section
        </h2>
        <p>TODO — Lead Form + Left Panel (Phase 03)</p>
      </div>
    </section>
  );
}
