import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import api from "../api/api";

export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get("/skills")
      .then(res => setSkills(res.data))
      .catch(err => console.error("Failed to load skills", err));
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Skills</h2>

      <div className="bg-white p-6 rounded shadow max-w-xl">
        {skills.map(skill => (
          <div key={skill.id} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-gray-500">
                {skill.level}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded h-3">
              <div
                className="bg-blue-600 h-3 rounded"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
