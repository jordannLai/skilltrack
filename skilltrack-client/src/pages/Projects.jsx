import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import api from "../api/api";


export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.error("Failed to load projects", err));
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Projects</h2>

      <div className="grid grid-cols-2 gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            className="bg-white p-5 rounded shadow"
          >
            <h3 className="text-lg font-semibold mb-2">
              {project.title}
            </h3>

            <p className="text-gray-600 mb-3">
              {project.description}
            </p>

            <div className="flex gap-2 mb-3 flex-wrap">
              {project.tech?.map(t => (
                <span
                  key={t}
                  className="bg-gray-200 text-sm px-2 py-1 rounded"
                >
                  {t}
                </span>
              ))}
            </div>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View on GitHub →
              </a>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
