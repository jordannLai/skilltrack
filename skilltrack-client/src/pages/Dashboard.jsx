import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">
        Dashboard
      </h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Applications</h3>
          <p className="text-gray-500 text-sm">Track job progress</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Projects</h3>
          <p className="text-gray-500 text-sm">Showcase your work</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Skills</h3>
          <p className="text-gray-500 text-sm">Measure growth</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
