import { createRouter, createWebHistory } from 'vue-router'

// 🔹 Landing & Student Pages
import Landing from './components/Landing.vue'
import Home from './Home.vue'
import Community from './Community.vue'
import Profile from './components/Profile.vue'
import Settings from './components/Settings.vue'
import Saved from './components/Saved.vue'
import Report from './components/Report.vue'
import ProjectDetails from './components/ProjectDetails.vue'
import ApplyProject from './components/ApplyProject.vue'

// 🔹 Client Pages
import ClientHome from './components/ClientHome.vue'
import ClientProfile from './components/ClientProfile.vue'
import ClientSettings from './components/ClientSettings.vue'
import ClientSaved from './components/ClientSaved.vue'
import ClientReport from './components/ClientReport.vue'
import ClientCommunity from './components/ClientCommunity.vue'
import Payment from './components/Payment.vue'
import FreelancerProfile from './components/FreelancerProfile.vue'

// Auth Pages
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import SignupStep1 from './views/SignupStep1.vue'
import SignupStep2 from './views/SignupStep2.vue'
import SignupStep3 from './views/SignupStep3.vue'
import ClientSignupStep1 from './views/ClientSignupStep1.vue'
import ClientSignupStep2 from './views/ClientSignupStep2.vue'
import ClientSignupStep3 from './views/ClientSignupStep3.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ResetPassword from './views/ResetPassword.vue'
import VerifyCode from './views/VerifyCode.vue'
import PasswordSuccess from './views/PasswordSuccess.vue'

const routes = [
  // ✅ الصفحة الرئيسية (Landing Page)
  { path: '/', name: 'Landing', component: Landing },

  // Auth
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/signup/step1', name: 'SignupStep1', component: SignupStep1 },
  { path: '/signup/step2', name: 'SignupStep2', component: SignupStep2 },
  { path: '/signup/step3', name: 'SignupStep3', component: SignupStep3 },
  { path: '/client-signup/step1', name: 'ClientSignupStep1', component: ClientSignupStep1 },
  { path: '/client-signup/step2', name: 'ClientSignupStep2', component: ClientSignupStep2 },
  { path: '/client-signup/step3', name: 'ClientSignupStep3', component: ClientSignupStep3 },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/verify-code', name: 'VerifyCode', component: VerifyCode },
  { path: '/password-success', name: 'PasswordSuccess', component: PasswordSuccess },
  
  // 🔹 Student Dashboard & Pages
  { path: '/student-home', name: 'StudentHome', component: Home },
  { path: '/community', name: 'Community', component: Community },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/saved', name: 'Saved', component: Saved },
  { path: '/report', name: 'Report', component: Report },
  
  // ✅ ضفنا :id عشان المسار يشتغل صح
  { path: '/project/:id', name: 'ProjectDetails', component: ProjectDetails, props: true },
  { path: '/apply/:id', name: 'ApplyProject', component: ApplyProject, props: true },
  
  // 🔹 Client Dashboard & Pages
  { path: '/client-home', name: 'ClientHome', component: ClientHome },
  { path: '/client-profile', name: 'ClientProfile', component: ClientProfile },
  { path: '/client-settings', name: 'ClientSettings', component: ClientSettings },
  { path: '/client-saved', name: 'ClientSaved', component: ClientSaved },
  { path: '/client-report', name: 'ClientReport', component: ClientReport },
  { path: '/client-community', name: 'ClientCommunity', component: ClientCommunity },
  { path: '/payment', name: 'Payment', component: Payment },
  
  // ✅ ضفنا :slug عشان مسار الفريلانسر يشتغل صح
  { path: '/freelancer/:slug', name: 'FreelancerProfile', component: FreelancerProfile, props: true },
  
  // ✅ أي مسار غلط يرجعك للرئيسية
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
})

// ✅ تم تعديل الحماية: يسمح بالدخول من غير توكن (مؤقتاً عشان تكملِي الشغل)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userType = user.user_type || user.role
  
  // الصفحات العامة (كل الصفحات دلوقتي عامة لحد ما نرجع اللوجين)
  const publicPages = ['/', '/student-home', '/client-home', '/profile', '/settings', '/saved', '/report', '/community', '/project', '/apply', '/client-profile', '/client-settings', '/client-saved', '/client-report', '/client-community', '/payment', '/freelancer']
  
  const studentPages = ['StudentHome', 'Profile', 'Saved', 'Report', 'Community', 'Settings', 'ProjectDetails', 'ApplyProject', 'FreelancerProfile']
  const clientPages = ['ClientHome', 'ClientProfile', 'ClientSaved', 'ClientReport', 'ClientCommunity', 'ClientSettings', 'Payment']
  
  // ✅ لو مفيش توكن، اسمحي بالدخول عادي (مؤقتاً)
  if (!token) {
    next()
    return
  }
  
  // التحقق من نوع المستخدم (لو التوكن موجود)
  if (studentPages.includes(to.name) && userType !== 'student') {
    next({ name: 'ClientHome' })
    return
  }
  
  if (clientPages.includes(to.name) && userType !== 'client') {
    next({ name: 'StudentHome' })
    return
  }
  
  next()
})

export default router