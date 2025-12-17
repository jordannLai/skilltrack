import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Applications from "../pages/Applications";
import Projects from "../pages/Projects";
import Skills from "../pages/Skills";


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/skills" element={<Skills />} />
            </Routes>
        </BrowserRouter>
    );
}
