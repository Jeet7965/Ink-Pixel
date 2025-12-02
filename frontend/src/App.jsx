
import './App.css'
import { ToastContainer, toast } from "react-toastify";
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import CreateBlog from './pages/blogPage/CreateBlog';
import MyBlogs from './pages/blogPage/MyBlog';
import MediaUpload from './pages/mediaPage/uploadMedia';
import GallerySection from './pages/mediaPage/GallerySection';
import BlogSection from './pages/blogPage/BlogSection';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/Forgot_Password';
import BlogDetails from './pages/blogPage/BlogDetails';
import PageNotFound from './components/PageNotFound';
import ProfilePage from './pages/ProfilePage';
import UpdateBlog from './pages/blogPage/UpdateBlog';
import ProtectedRoute from './routes/protectedRoutes';
import ImageDetails from './pages/mediaPage/ImageDetails';
import MyGallery from './pages/mediaPage/MyGallery';
import AboutUs from './pages/About';
import ResetPassword from './components/ResetPassword';


function App() {


  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />
        <Route path="/create-blog" element={<ProtectedRoute> <CreateBlog /> </ProtectedRoute>} />
        <Route path="/update-blog/:id" element={<ProtectedRoute> <UpdateBlog /> </ProtectedRoute>} />
        <Route path="/blogs" element={<BlogSection />} />
        <Route path="/blog/:id" element={<ProtectedRoute><BlogDetails /></ProtectedRoute>} />
        <Route path="/my-blogs" element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />

        <Route path="/upload-media" element={<ProtectedRoute><MediaUpload /></ProtectedRoute>} />
        <Route path="/media/download/:id" element={<ProtectedRoute><ImageDetails /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute><GallerySection /></ProtectedRoute>} />
        <Route path="/my-gallery" element={<ProtectedRoute><MyGallery /></ProtectedRoute>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

    </div>
  )
}

export default App
