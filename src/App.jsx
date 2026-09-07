import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { PublicLayout, PortalLayout, AdminLayout } from './components/Layout';
import { RequireAuth, PublicOnly } from './components/RouteGuard';

import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BecomeInstructor from './pages/BecomeInstructor';

import Dashboard from './pages/student/Dashboard';
import MyLearning from './pages/student/MyLearning';
import Learn from './pages/student/Learn';
import Quiz from './pages/student/Quiz';
import Assignments from './pages/student/Assignments';
import Certificates from './pages/student/Certificates';
import Wishlist from './pages/student/Wishlist';
import CartPage from './pages/student/CartPage';
import Checkout from './pages/student/Checkout';
import Messages from './pages/student/Messages';
import Notifications from './pages/student/Notifications';
import Profile from './pages/student/Profile';
import Settings from './pages/student/Settings';

import InstructorHome from './pages/instructor/InstructorHome';
import InstructorCourses from './pages/instructor/InstructorCourses';
import CourseWizard from './pages/instructor/CourseWizard';
import CurriculumBuilder from './pages/instructor/CurriculumBuilder';
import CourseStudents from './pages/instructor/CourseStudents';
import CourseQA from './pages/instructor/CourseQA';
import CourseReviews from './pages/instructor/CourseReviews';
import Earnings from './pages/instructor/Earnings';
import InstructorSettings from './pages/instructor/InstructorSettings';

import AdminHome from './pages/admin/AdminHome';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';
import AdminSupport from './pages/admin/AdminSupport';
import AdminSettings from './pages/admin/AdminSettings';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/courses" element={<Catalog />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/become-instructor" element={<BecomeInstructor />} />
                <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
                <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
              </Route>

              <Route element={<PortalLayout />}>
                <Route path="/dashboard" element={<RequireAuth role="student"><Dashboard /></RequireAuth>} />
                <Route path="/my-learning" element={<RequireAuth role="student"><MyLearning /></RequireAuth>} />
                <Route path="/learn/:courseId" element={<RequireAuth role="student"><Learn /></RequireAuth>} />
                <Route path="/learn/:courseId/quiz/:lessonId" element={<RequireAuth role="student"><Quiz /></RequireAuth>} />
                <Route path="/assignments" element={<RequireAuth role="student"><Assignments /></RequireAuth>} />
                <Route path="/certificates" element={<RequireAuth role="student"><Certificates /></RequireAuth>} />
                <Route path="/wishlist" element={<RequireAuth role="student"><Wishlist /></RequireAuth>} />
                <Route path="/cart" element={<RequireAuth role="student"><CartPage /></RequireAuth>} />
                <Route path="/checkout" element={<RequireAuth role="student"><Checkout /></RequireAuth>} />
                <Route path="/messages" element={<RequireAuth role="student"><Messages /></RequireAuth>} />
                <Route path="/notifications" element={<RequireAuth role="student"><Notifications /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth role="student"><Profile /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />

                <Route path="/instructor" element={<RequireAuth role="instructor"><InstructorHome /></RequireAuth>} />
                <Route path="/instructor/courses" element={<RequireAuth role="instructor"><InstructorCourses /></RequireAuth>} />
                <Route path="/instructor/courses/new" element={<RequireAuth role="instructor"><CourseWizard /></RequireAuth>} />
                <Route path="/instructor/courses/:courseId/edit" element={<RequireAuth role="instructor"><CurriculumBuilder /></RequireAuth>} />
                <Route path="/instructor/courses/:courseId/students" element={<RequireAuth role="instructor"><CourseStudents /></RequireAuth>} />
                <Route path="/instructor/courses/:courseId/qa" element={<RequireAuth role="instructor"><CourseQA /></RequireAuth>} />
                <Route path="/instructor/courses/:courseId/reviews" element={<RequireAuth role="instructor"><CourseReviews /></RequireAuth>} />
                <Route path="/instructor/earnings" element={<RequireAuth role="instructor"><Earnings /></RequireAuth>} />
                <Route path="/instructor/settings" element={<RequireAuth role="instructor"><InstructorSettings /></RequireAuth>} />
              </Route>

              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<RequireAuth role="admin"><AdminHome /></RequireAuth>} />
                <Route path="/admin/users" element={<RequireAuth role="admin"><AdminUsers /></RequireAuth>} />
                <Route path="/admin/courses" element={<RequireAuth role="admin"><AdminCourses /></RequireAuth>} />
                <Route path="/admin/categories" element={<RequireAuth role="admin"><AdminCategories /></RequireAuth>} />
                <Route path="/admin/payments" element={<RequireAuth role="admin"><AdminPayments /></RequireAuth>} />
                <Route path="/admin/reports" element={<RequireAuth role="admin"><AdminReports /></RequireAuth>} />
                <Route path="/admin/support" element={<RequireAuth role="admin"><AdminSupport /></RequireAuth>} />
                <Route path="/admin/settings" element={<RequireAuth role="admin"><AdminSettings /></RequireAuth>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}