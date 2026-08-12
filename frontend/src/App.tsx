import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import News from "./pages/News";
import Projects from "./pages/Projects";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import Resume from "./pages/Resume";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import ToolsIndex from "./pages/tools/ToolsIndex";
import Base64ToolPage from "./pages/tools/Base64ToolPage";
import IpLookupToolPage from "./pages/tools/IpLookupToolPage";
import PasswordGeneratorToolPage from "./pages/tools/PasswordGeneratorToolPage";
import MetaTagToolPage from "./pages/tools/MetaTagToolPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ProjectsPage from "./pages/admin/ProjectsPage";
import StoriesPage from "./pages/admin/StoriesPage";
import GalleryPage from "./pages/admin/GalleryPage";
import UsersPage from "./pages/admin/UsersPage";
import ProjectForm from "./components/admin/ProjectFormData";
import LoginPage from "./pages/admin/LoginPage";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./pages/admin/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/tools" element={<ToolsIndex />} />
          <Route path="/tools/base64" element={<Base64ToolPage />} />
          <Route path="/tools/ip" element={<IpLookupToolPage />} />
          <Route path="/tools/password" element={<PasswordGeneratorToolPage />} />
          <Route path="/tools/meta-tag" element={<MetaTagToolPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/edit/:id" element={<ProjectForm />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
