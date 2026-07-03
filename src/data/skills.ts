export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "AI & LLM",
    items: [
      "LLM application development",
      "agentic & multi-agent orchestration",
      "Model Context Protocol (MCP) & tool calling",
      "Claude Code & agentic coding",
      "RAG",
      "prompt engineering & context management",
      "local inference (Ollama, quantized models)",
      "Gemini API",
      "Anthropic / Claude API",
    ],
  },
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C#", "SQL", "Bash"],
  },
  {
    label: "Frontend",
    items: [
      "React",
      "Angular",
      "Vite",
      "Tailwind CSS",
      "Streamlit",
      "Gradio",
      "Chrome extensions",
    ],
  },
  {
    label: "Backend & Data",
    items: [
      "Node.js",
      "Express",
      "REST APIs",
      "Firebase / Firestore",
      "Stripe",
      "MongoDB",
      "Supabase / PostgreSQL",
      "pandas / NumPy",
    ],
  },
  {
    label: "Cloud & Infra",
    items: [
      "Docker & Compose",
      "GCP (Firebase)",
      "Linux server hardening",
      "Tailscale",
      "Caddy",
      "systemd",
      "NVIDIA / CUDA",
      "Git",
    ],
  },
];
