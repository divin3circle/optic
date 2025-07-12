import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Navbar from "./components/ui/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OTP from "./pages/OTP";
import "@nfid/identitykit/react/styles.css";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import { IdentityKitTheme } from "@nfid/identitykit/react";
import Dashboard from "./pages/Dashboard";

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
        <main className=" text-secondary-text h-screen w-screen">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/onboard" element={<Signup />} />
              <Route path="/otp" element={<OTP />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Router>
        </main>
      </QueryClientProvider>
    </IdentityKitProvider>
  );
}

export default App;
