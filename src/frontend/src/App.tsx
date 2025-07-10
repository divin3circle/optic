import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createActor, canisterId } from "../../declarations/backend";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Navbar from "./components/ui/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OTP from "./pages/OTP";
import "@nfid/identitykit/react/styles.css";
import { IdentityKitProvider } from "@nfid/identitykit/react";

const queryClient = new QueryClient();

function App() {
  const [greeting, setGreeting] = useState("");

  function handleSubmit(event: any) {
    // event.preventDefault();
    // const name = event.target.elements.name.value;
    // const backend = createActor(canisterId);
    // backend.greet(name).then((greeting: any) => {
    //   setGreeting(greeting);
    // });
    // return false;
  }

  return (
    <IdentityKitProvider
      signerClientOptions={{
        targets: ["uxrrr-q7777-77774-qaaaq-cai"],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <main className=" text-secondary-text h-screen w-screen">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/onboard" element={<Signup />} />
              <Route path="/otp" element={<OTP />} />
            </Routes>
          </Router>
        </main>
      </QueryClientProvider>
    </IdentityKitProvider>
  );
}

export default App;
