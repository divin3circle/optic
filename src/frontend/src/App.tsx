import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createActor, canisterId } from "../../declarations/backend";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Navbar from "./components/ui/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OTP from "./pages/OTP";

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
    <QueryClientProvider client={queryClient}>
      <main className="bg-background text-secondary-text h-screen w-screen">
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
  );
}

export default App;
