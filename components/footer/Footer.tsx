// components/footer/Footer.tsx — STUB (replaced in Phase 05)
export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: "var(--color-footer-bg)",
        padding: "4rem 2rem 2rem",
        minHeight: "200px",
      }}
    >
      <nav aria-label="Footer" style={{ color: "var(--color-text-muted)", textAlign: "center" }}>
        <p style={{ fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.5rem" }}>
          KlearStack
        </p>
        <p style={{ fontSize: "0.875rem" }}>TODO — Footer (Phase 05)</p>
        <p style={{ fontSize: "0.75rem", marginTop: "2rem", color: "var(--color-text-subtle)" }}>
          © KlearStack {new Date().getFullYear()}
        </p>
      </nav>
    </footer>
  );
}
