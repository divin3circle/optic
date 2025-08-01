import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/ui/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@nfid/identitykit/react/styles.css";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import { IdentityKitTheme } from "@nfid/identitykit/react";
import Loading from "@/components/ui/Loading";
import RequireUser from "./components/app/dashboard/RequireUser";
import { Toaster } from "@/components/ui/sonner";

const Landing = lazy(() => import("./pages/Landing"));
const Signup = lazy(() => import("./pages/Signup"));
const OTP = lazy(() => import("./pages/OTP"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const DirectMessages = lazy(() => import("./pages/DirectMessages"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Settings = lazy(() => import("./pages/Settings"));
const Groups = lazy(() => import("./pages/Groups"));

const queryClient = new QueryClient();

function App() {
  return (
    <IdentityKitProvider
      signerClientOptions={{
        targets: ["uxrrr-q7777-77774-qaaaq-cai"],
      }}
      theme={IdentityKitTheme.LIGHT}
    >
      <QueryClientProvider client={queryClient}>
        <main className="text-secondary-text h-screen w-screen">
          <Router>
            <Navbar />
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/onboard" element={<Signup />} />
                <Route path="/otp" element={<OTP />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireUser>
                      <Dashboard />
                    </RequireUser>
                  }
                >
                  <Route index element={<Home />} />
                  <Route
                    path="/dashboard/messages"
                    element={<DirectMessages />}
                  />
                  <Route path="/dashboard/groups" element={<Groups />} />
                  <Route
                    path="/dashboard/notifications"
                    element={<Notifications />}
                  />
                  <Route path="/dashboard/wallet" element={<Wallet />} />
                  <Route path="/dashboard/profile" element={<Settings />} />
                </Route>
              </Routes>
            </Suspense>
            <Toaster position="top-center" richColors />
          </Router>
        </main>
      </QueryClientProvider>
    </IdentityKitProvider>
  );
}

export default App;
