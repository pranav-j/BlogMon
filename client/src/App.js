import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateBlog from './components/CreateBlog';
import EditBlog from './components/EditBlog';
import Login from './components/Login';
import Signup from './components/Signup';
import FullBlog from './components/FullBlog';
import Profile from './components/Profile';
import AuthorProfile from './components/AuthorProfile';
import AdminPanel from './components/AdminPanel';

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/create-blog", element: <CreateBlog />},
  { path: "/edit-blog/:id", element: <EditBlog />},
  { path: "/login", element: <Login />},
  { path: "/signup", element: <Signup />},
  { path: "/blog/:id", element: <FullBlog />},
  { path: "/profile", element: <Profile />},
  { path: "/author-profile/:authorId/:authorName", element: <AuthorProfile />},

  { path: "/admin-panel", element: <AdminPanel />}
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
