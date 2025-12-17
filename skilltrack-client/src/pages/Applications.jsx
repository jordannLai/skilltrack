import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";


export default function Applications() {

    // STATUS BADGE FUNCTION 
    function statusBadge(status) {
        const colors = {
            Applied: "bg-gray-200 text-gray-800",
            Interview: "bg-blue-200 text-blue-800",
            Offer: "bg-green-200 text-green-800",
            Rejected: "bg-red-200 text-red-800",
        };

        return (
            <span
                className={`px-2 py-1 rounded text-sm font-medium ${colors[status] || "bg-gray-100"
                    }`}
            >
                {status}
            </span>
        );
    }


    // STATE
    const [applications, setApplications] = useState([]);

    const [form, setForm] = useState({
        company: "",
        role: "",
        status: "Applied",
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        api.get("/applications")
            .then(res => {
                setApplications(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch applications:", err);
            });
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
                const res = await api.put(
                    `/applications/${editingId}`,
                    form
                );

                setApplications(
                    applications.map(app =>
                        app.id === editingId ? res.data : app
                    )
                );

                setEditingId(null);
            } else {
                const res = await api.post("/applications", form);


                setApplications(prev => [res.data, ...prev]);
            }

            setForm({
                company: "",
                role: "",
                status: "Applied",
            });
        } catch (err) {
            console.error("Add / Update failed:", err);
        }
    }



    function handleEdit(app) {
        setForm({
            company: app.company,
            role: app.role,
            status: app.status,
        });
        setEditingId(app.id);
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/applications/${id}`);
            setApplications(applications.filter(app => app.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }




    // RETURN JSX
    return (
        <DashboardLayout>
            <h2 className="text-2xl font-bold mb-6">Applications</h2>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-end"
            >
                <div>
                    <label className="block text-sm font-medium">Company</label>
                    <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="border p-2 rounded w-48"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Role</label>
                    <input
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="border p-2 rounded w-64"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option>Applied</option>
                        <option>Interview</option>
                        <option>Offer</option>
                        <option>Rejected</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {editingId ? "Update" : "Add"}
                </button>

            </form>

            {/* TABLE */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Company</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id} className="border-t">
                                <td className="p-3">{app.company}</td>
                                <td className="p-3">{app.role}</td>
                                <td className="p-3">{statusBadge(app.status)}</td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(app)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(app.id)}
                                        className="text-red-600 hover:underline text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
