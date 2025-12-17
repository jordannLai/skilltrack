import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [aiFeedback, setAiFeedback] = useState({});
  const [loadingAI, setLoadingAI] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    tech: "",
    github: "",
  });

  //Get ai feedback
  async function handleAIFeedback(project) {
    setLoadingAI(project.id);

    try {
      const res = await api.post("/ai/project-feedback", {
        title: project.title,
        description: project.description,
        tech: project.tech || [],
      });

      setAiFeedback(prev => ({
        ...prev,
        [project.id]: res.data,
      }));
    } catch (err) {
      console.error("AI feedback failed", err);
    } finally {
      setLoadingAI(null);
    }
  }

  // Fetch projects
  useEffect(() => {
    api.get("/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      tech: form.tech.split(",").map(t => t.trim()),
    };

    try {
      if (editingId) {
        const res = await api.put(`/projects/${editingId}`, payload);
        setProjects(projects.map(p => p.id === editingId ? res.data : p));
        setEditingId(null);
      } else {
        const res = await api.post("/projects", payload);
        setProjects(prev => [res.data, ...prev]);
      }

      setForm({ title: "", description: "", tech: "", github: "" });
    } catch (err) {
      console.error("Save failed", err);
    }
  }

  function handleEdit(project) {
    setForm({
      title: project.title,
      description: project.description,
      tech: project.tech?.join(", ") || "",
      github: project.github || "",
    });
    setEditingId(project.id);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Projects</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 max-w-2xl"
      >
        <div className="mb-3">
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            rows={3}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">
            Tech Stack (comma separated)
          </label>
          <input
            name="tech"
            value={form.tech}
            onChange={handleChange}
            placeholder="React, Node, PostgreSQL"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">GitHub URL</label>
          <input
            name="github"
            value={form.github}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Project" : "Add Project"}
        </button>
      </form>

      {/* PROJECT LIST */}
      <div className="grid grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-5 rounded shadow">
            <h3 className="text-lg font-semibold mb-1">
              {project.title}
            </h3>

            <p className="text-gray-600 mb-3">
              {project.description}
            </p>

            <div className="flex gap-2 flex-wrap mb-3">
              {project.tech?.map(t => (
                <span
                  key={t}
                  className="bg-gray-200 text-sm px-2 py-1 rounded"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-4 text-sm">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub
                </a>
              )}
              <button
                onClick={() => handleAIFeedback(project)}
                className="text-purple-600 hover:underline"
              >
                {loadingAI === project.id ? "Analyzing..." : "Get AI Feedback"}
              </button>

              <button
                onClick={() => handleEdit(project)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
            {aiFeedback[project.id] && (
              <div className="mt-4 bg-purple-50 p-4 rounded text-sm">
                <p className="font-semibold mb-1">AI Feedback</p>

                <p className="mb-2">
                  <strong>Summary:</strong>{" "}
                  {aiFeedback[project.id].summary}
                </p>

                <p className="font-medium">Strengths:</p>
                <ul className="list-disc ml-5 mb-2">
                  {aiFeedback[project.id].strengths.map(s => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>

                <p className="font-medium">Improvements:</p>
                <ul className="list-disc ml-5 mb-2">
                  {aiFeedback[project.id].improvements.map(i => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>

                <p className="italic">
                  <strong>Resume line:</strong>{" "}
                  {aiFeedback[project.id].resumeSuggestion}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
