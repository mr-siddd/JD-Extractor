import React from "react";
import JobInput from "./components/JobInput";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Job JD Extractor</h1>
      <JobInput />
    </div>
  );
}

export default App;
