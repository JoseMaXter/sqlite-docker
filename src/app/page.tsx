"use client";
import { useState, useEffect } from "react";

interface User {
  created_at: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email) return;
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, email }),
    });
    await response.json();
    fetchUsers();
    setName("");
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-9">
      <form className="flex flex-col gap-3 w-1/2" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-center">Create User 2.0</h1>
        <input
          className="border-2 border-gray-300 rounded-md p-2 outline-none"
          type="text"
          name="name"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border-2 border-gray-300 rounded-md p-2 outline-none"
          type="email"
          name="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-blue-500 cursor-pointer text-white p-2 rounded-md"
          type="submit"
        >
          Submit
        </button>
      </form>

      <div className="flex flex-col gap-3 w-1/2">
        <h1 className="text-2xl font-bold ">Users</h1>
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <div
              className="flex flex-col gap-2 bg-gray-100 p-2 rounded-md"
              key={user.id}
            >
              <p>
                <span className="font-bold">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-bold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-bold">Role:</span> {user.role}
              </p>
              <p>
                <span className="font-bold">Created at:</span> {user.created_at}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
