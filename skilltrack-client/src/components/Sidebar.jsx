import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav className="flex flex-col gap-4">
        <Link className="hover:text-blue-400" to="/">
          Dashboard
        </Link>
        <Link className="hover:text-blue-400" to="/applications">
          Applications
        </Link>
        <Link className="hover:text-blue-400" to="/projects">
          Projects
        </Link>
        <Link className="hover:text-blue-400" to="/skills">
          Skills
        </Link>
      </nav>
    </aside>
  );
}
