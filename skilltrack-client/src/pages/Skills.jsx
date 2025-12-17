import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: "", level: 50 });
  const [editingId, setEditingId] = useState(null);

  // Fetch skills
  useEffect(() => {
    api.get("/skills")
      .then(res => setSkills(res.data))
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

    try {
      if (editingId) {
        const res = await api.put(`/skills/${editingId}`, form);
        setSkills(skills.map(s => (s.id === editingId ? res.data : s)));
        setEditingId(null);
      } else {
        const res = await api.post("/skills", form);
        setSkills(prev => [...prev, res.data]);
      }

      setForm({ name: "", level: 50 });
    } catch (err) {
      console.error("Save failed", err);
    }
  }

  function handleEdit(skill) {
    setForm({ name: skill.name, level: skill.level });
    setEditingId(skill.id);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/skills/${id}`);
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Skills</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-end max-w-xl"
      >
        <div>
          <label className="block text-sm font-medium">Skill</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-48"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Level (%)</label>
          <input
            type="number"
            name="level"
            value={form.level}
            onChange={handleChange}
            min="0"
            max="100"
            className="border p-2 rounded w-24"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* SKILL LIST */}
      <div className="bg-white p-6 rounded shadow max-w-xl">
        {skills.map(skill => (
          <div key={skill.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-gray-500">
                {skill.level}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className="bg-blue-600 h-3 rounded"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <button
                onClick={() => handleEdit(skill)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(skill.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
