// components/header/Header.tsx — STUB (replaced in Phase 02)
export default function Header() {
  return (
    <header
      id="site-header"
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border-light)",
        minHeight: "68px",
        display: "flex",
        alignItems: "center",
        padding: "0 2rem",
      }}
    >
      <nav aria-label="Main" style={{ display: "flex", alignItems: "center", gap: "2rem", width: "100%" }}>
        <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--color-primary)" }}>
          KlearStack
        </span>
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          TODO — Header (Phase 02)
        </span>
      </nav>
    </header>
  );
}
