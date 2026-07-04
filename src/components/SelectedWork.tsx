import Section from "./Section";
import ProjectCard from "./ProjectCard";
import { projects } from "../data/projects";

export default function SelectedWork() {
  return (
    <Section
      id="work"
      index="01"
      title="Selected Work"
      lede="Systems I own end to end — two live SaaS products, and the lab that powers everything else."
    >
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}
