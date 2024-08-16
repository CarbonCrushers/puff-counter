"use client";

import { useState, FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ConsumptionType {
  strainId: Id<"strains"> | "";
  quantity: number;
  timestamp: string;
  userId: Id<"users"> | "";
  method: "Smoke" | "Bong" | "Dag" | "Edible";
}

export function Consumption() {
  const [newConsumption, setNewConsumption] = useState<ConsumptionType>({
    strainId: "",
    quantity: 0,
    timestamp: Date.now().toString(),
    userId: "",
    method: "Smoke",
  });
  const consumptionLogs = useQuery(api.consumptionLog.list, {
    id: "j979ed9pwnzbd855d74wsbnvas6ywe64",
  });
  const addLine = useMutation(api.consumptionLog.add);
  const deleteLine = useMutation(api.consumptionLog.remove);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setNewConsumption({ ...newConsumption, [name]: value });
    console.log("Selected newUser:", newConsumption);
  };

  /* const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Adding new user:", newConsumption);
    addLine(newConsumption as ConsumptionType).catch((error) => {
      console.error("Failed to add strain:", error);
    });
    setNewConsumption({
      strainId: "",
      quantity: 0,
      timestamp: "",
      userId: "",
      method: "Smoke",
    });
  }; */

  const handleDeleteLine = async (id: Id<"consumptionLog">) => {
    try {
      await deleteLine({ id });
      console.log(`Deleted user with ID ${id}`);
    } catch (error) {
      console.error(`Failed to delete user with ID ${id}:`, error);
    }
  };

  return (
    <div className="flex grow flex-col">
      <div className="flex flex-col container pt-4 gap-6">
        <h3 className="text-lg font-medium mt-4">Cannabis Consumption</h3>
        <ul className="space-y-2">
          {consumptionLogs?.map((spliff) => (
            <li key={spliff._id} className="flex justify-between p-2 border-b">
              <span>
                {spliff.strainId} - {spliff.userId} -{" "}
                {new Date(spliff.timestamp).toLocaleDateString()} -{" "}
                {spliff.quantity} - {spliff.method}
              </span>
              <div>
                <Button variant="ghost">
                  <Pencil1Icon />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteLine(spliff._id)}
                >
                  <TrashIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold">Add a new entry</h2>
        {/* <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={newConsumption.name}
            onChange={handleInputChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={newConsumption.userId}
            onChange={handleInputChange}
            required
          />

          <Button type="submit">Add User</Button>
        </form> */}
      </div>
    </div>
  );
}

export default Consumption;
