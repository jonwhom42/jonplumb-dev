import { ArrowUpRight, Linkedin, Mail, MessageSquareText } from "lucide-react";
import Section from "./Section";
import { site, content } from "../data/site";
import CopyEmailButton from "./CopyEmailButton";

interface ContactProps {
  onOpenConcierge: () => void;
}

export default function Contact({ onOpenConcierge }: ContactProps) {
  return (
    <Section id="contact" index="06" title="Contact">
      <p className="max-w-2xl text-lg leading-relaxed text-text">
        {content.contact.line}
      </p>
      <p className="mt-3 max-w-2xl font-mono text-sm text-muted">
        Or skip the wait — paste your job description into{" "}
        <button
          type="button"
          onClick={onOpenConcierge}
          className="text-amber underline underline-offset-2 hover:opacity-80"
        >
          my assistant
        </button>{" "}
        and it'll map my experience against it right now.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center gap-2 rounded-md bg-amber px-5 py-2.5 font-medium text-bg transition-opacity hover:opacity-90"
        >
          <Mail size={17} aria-hidden="true" /> Email me
        </a>
        <CopyEmailButton className="py-2.5" />
        <button
          type="button"
          onClick={onOpenConcierge}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-text transition-colors hover:border-amberDim hover:bg-surface2"
        >
          <MessageSquareText size={16} aria-hidden="true" /> Ask my assistant
        </button>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-text transition-colors hover:border-amberDim hover:bg-surface2"
        >
          <Linkedin size={16} aria-hidden="true" /> LinkedIn
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <a
          href={site.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-text transition-colors hover:border-amberDim hover:bg-surface2"
        >
          Resume <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </Section>
  );
}
