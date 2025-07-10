import { useState } from "react";
import { createActor, canisterId } from "../../declarations/backend";

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
    <main className="bg-background text-secondary-text h-screen w-screen">
      <div className="w-48 h-48 bg-secondary border-2 border-secondary rounded-full"></div>
      <h1 className="text-4xl font-karla text-text">Hello World</h1>
    </main>
  );
}

export default App;
