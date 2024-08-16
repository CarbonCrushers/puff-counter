"use client";

import { useState, FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  name: string;
  email: string;
  createdAt: string;
}

export function Users() {
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    createdAt: Date.now().toString(),
  });
  const users = useQuery(api.users.list);
  const addUser = useMutation(api.users.add);
  const deleteUser = useMutation(api.users.remove);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
    console.log("Selected newUser:", newUser);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Adding new user:", newUser);
    addUser(
      newUser as {
        name: string;
        email: string;
      },
    ).catch((error) => {
      console.error("Failed to add strain:", error);
    });
    setNewUser({
      name: "",
      email: "",
      createdAt: "",
    });
  };

  const handleDeleteStrain = async (id: Id<"users">) => {
    try {
      await deleteUser({ id });
      console.log(`Deleted user with ID ${id}`);
    } catch (error) {
      console.error(`Failed to delete user with ID ${id}:`, error);
    }
  };

  return (
    <div className="flex grow flex-col">
      <div className="flex flex-col container pt-4 gap-6">
        <h3 className="text-lg font-medium mt-4">Users</h3>
        <ul className="space-y-2">
          {users?.map((user) => (
            <li key={user._id} className="flex justify-between p-2 border-b">
              <span>
                {user.name} - {user.email} -{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
              <div>
                <Button variant="ghost">
                  <Pencil1Icon />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteStrain(user._id)}
                >
                  <TrashIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold">Add a new strain</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleInputChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            required
          />

          <Button type="submit">Add User</Button>
        </form>
      </div>
    </div>
  );
}

export default Users;
