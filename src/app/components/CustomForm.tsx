"use client";

import { useState } from "react";

export default function CustomForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");

    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) setStatus("Submitted successfully!");
    else setStatus(`Error: ${data.error}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-full max-w-md">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name *"
        className="border p-2 rounded"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Message *"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
      <p>{status}</p>
    </form>
  );
}
