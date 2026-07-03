export interface UsesRow {
  label: string;
  value: string;
}

export const usesIntro =
  "The dev-tools-and-hardware rundown, /uses-style. The lab is real and it's load-bearing.";

export const usesRows: UsesRow[] = [
  {
    label: "Daily driver",
    value: "Windows 11 laptop · RTX 4050 · 64GB DDR5 · WSL2",
  },
  {
    label: "Model host",
    value: "dedicated RTX 4070 box running Ollama for local inference",
  },
  {
    label: "The garage lab",
    value:
      "Ubuntu Server 24.04 on an RTX 2080 Super: Docker stack (Postgres, Redis, MinIO, MongoDB, ChromaDB, n8n), Tailscale mesh, Caddy, Kopia 3-2-1 backups",
  },
  {
    label: "Tools",
    value: "VS Code · Claude Code · Wispr Flow (voice-to-text) · GitHub",
  },
];
