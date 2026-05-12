/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import SocialLanding from "./pages/SocialLanding";
import PolicyPage from "./pages/PolicyPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminContracts from "./pages/admin/AdminContracts";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminContent from "./pages/admin/AdminContent";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminReceipts from "./pages/admin/AdminReceipts";
import AdminLayout from "./components/admin/AdminLayout";
import { ContentProvider } from "./context/ContentContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-600/20 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/social" element={<SocialLanding />} />
            <Route path="/privacy" element={<PolicyPage title="Privacy Policy" content={<PrivacyContent />} />} />
            <Route path="/cookies" element={<PolicyPage title="Cookie Policy" content={<CookieContent />} />} />
            <Route path="/terms" element={<PolicyPage title="Terms & Conditions" content={<TermsContent />} />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><AdminLayout><AdminProjects /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/contracts" element={<ProtectedRoute><AdminLayout><AdminContracts /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute><AdminLayout><AdminPayments /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/employees" element={<ProtectedRoute><AdminLayout><AdminEmployees /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/invoices" element={<ProtectedRoute><AdminLayout><AdminInvoices /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/receipts" element={<ProtectedRoute><AdminLayout><AdminReceipts /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
            <Route path="/admin/security" element={<ProtectedRoute><AdminLayout><AdminSecurity /></AdminLayout></ProtectedRoute>} />
          </Routes>
        </Router>
      </ContentProvider>
    </AuthProvider>
  );
}

const PrivacyContent = () => (
  <>
    <p>At MADECC Construction, your privacy is paramount. This policy outlines how we handle your data when you interact with our services.</p>
    <h3 className="text-black font-bold">1. Data Collection</h3>
    <p>We collect information you provide via contact forms, including name, email, and project details, solely for the purpose of business communication.</p>
    <h3 className="text-black font-bold">2. Use of Information</h3>
    <p>Collected data is used to provide project estimates, updates, and maintenance notifications. We never sell your data to third parties.</p>
    <h3 className="text-black font-bold">3. Security</h3>
    <p>We implement industry-standard SSL encryption and firewall protections to ensure your information remains secure during transit and at rest.</p>
  </>
);

const CookieContent = () => (
  <>
    <p>Our website uses cookies to enhance your browsing experience and analyze site traffic.</p>
    <h3 className="text-black font-bold">What are cookies?</h3>
    <p>Small text files stored on your device that help us remember your preferences and understand how you interact with our pages.</p>
    <h3 className="text-black font-bold">Managing Cookies</h3>
    <p>You can disable cookies through your browser settings, though some site functionalities may be limited as a result.</p>
  </>
);

const TermsContent = () => (
  <>
    <p>By accessing the MADECC Construction website, you agree to comply with our standard terms of use.</p>
    <h3 className="text-black font-bold">1. Intellectual Property</h3>
    <p>All architectural designs, photographs, and text content displayed on this site are the property of MADECC Construction and protected by copyright law.</p>
    <h3 className="text-black font-bold">2. Limitation of Liability</h3>
    <p>While we strive for 100% accuracy, MADECC is not liable for errors in technical specifications provided on the website. Official project documentation supersedes web content.</p>
  </>
);
