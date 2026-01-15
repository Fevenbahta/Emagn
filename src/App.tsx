import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store"; // Redux store

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TransactionCreate from "./pages/TransactionCreate";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import ApiIntegration from "./pages/ApiIntegration";
import NotFound from "./pages/NotFound";
import CategoryList from "./pages/CategoryList";
import CategoryForm from "./pages/CategoryForm";
import TransactionDetail from "./pages/TransactionDetail";
import AttributeForm from "./pages/AttributeForm";
import AttributeList from "./pages/AttributeList";
import Unauthorized from "./pages/Unauthorized";
import RoleGuard from "./components/RoleGuard";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/transaction/create" element={<TransactionCreate />} />
        <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/api" element={<ApiIntegration />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
           
{/* 
        <Route path="/categories" element={<CategoryList />} />
<Route path="/categories/create" element={<CategoryForm />} />
<Route path="/categories/edit/:id" element={<CategoryForm />} />
<Route path="/categories/:categoryId/attributes/new" element={<AttributeForm />} />
<Route path="/categories/:categoryId/attributes/edit/:attributeId" element={<AttributeForm />} />
<Route path="/categories/attributes" element={<AttributeList />} /> */}

    {/* Protected category routes - super_admin only */}
        <Route path="/categories" element={
          <RoleGuard allowedRoles={["super_admin"]}>
            <CategoryList />
          </RoleGuard>
        } />
        
        <Route path="/categories/create" element={
          <RoleGuard allowedRoles={["super_admin"]}>
            <CategoryForm />
          </RoleGuard>
        } />
        
        <Route path="/categories/edit/:id" element={
          <RoleGuard allowedRoles={["super_admin"]}>
            <CategoryForm />
          </RoleGuard>
        } />
        
        {/* Protected attribute routes - super_admin only */}
        <Route path="/categories/attributes" element={
          <RoleGuard allowedRoles={["super_admin"]}>
            <AttributeList />
          </RoleGuard>
        } />
        
        <Route path="/categories/:categoryId/attributes/new" element={
          <RoleGuard allowedRoles={["super_admin"]}>
            <AttributeForm />
          </RoleGuard>
        } />
        
        <Route path="/categories/:categoryId/attributes/edit/:attributeId" element={
          <RoleGuard allowedRoles={["super_admin"]}>
            <AttributeForm />
          </RoleGuard>
        } />
        
        {/* Unauthorized page */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
