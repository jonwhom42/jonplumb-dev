import { Fragment } from "react";
import { labStatus } from "../data/site";
import { DOT_COLOR } from "../lib/statusColors";

/**
 * Hero "lab status" readout — shown ≥1024px only. A stylized systemctl-style
 * listing of static, true labels. No telemetry, counts, or timestamps.
 */
export default function LabStatus() {
  return (
    <aside
      aria-label="Lab status"
      className="hidden lg:mt-2 lg:block"
    >
      <div className="rounded-lg border border-border bg-surface p-4 font-mono text-[11px] leading-none">
        <p className="mb-4 text-muted">{labStatus.title}</p>
        <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-3 gap-y-3">
          {labStatus.services.map((s) => (
            <Fragment key={s.name}>
              <span className="text-text">{s.name}</span>
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: DOT_COLOR[s.dot] }}
                />
                <span className="text-muted">{s.status}</span>
              </span>
              <span className="truncate text-muted/70" title={s.desc}>
                {s.desc}
              </span>
            </Fragment>
          ))}
        </div>
      </div>
    </aside>
  );
}
