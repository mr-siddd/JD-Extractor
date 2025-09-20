import React, { useState } from "react";

function JobInput() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/extract-jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter job URL"
          className="p-2 border rounded w-96"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Extract JD
        </button>
      </form>
      {result && (
        <div className="mt-6 p-4 bg-white shadow rounded w-3/4">
          <h2 className="font-semibold text-lg mb-2">Result</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default JobInput;
