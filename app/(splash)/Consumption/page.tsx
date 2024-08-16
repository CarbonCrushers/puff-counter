"use client";

import { useState, FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ConsumptionType {
  strainId: Id<"strains">;
  quantity: number;
  timestamp: string;
  userId: Id<"users">;
  method: "Smoke" | "Bong" | "Dab" | "Edible";
}

export function Consumption() {
  const users = useQuery(api.users.list);
  const consumptionLogs = useQuery(api.consumptionLog.list);
  const strains = useQuery(api.strains.list);
  const dailyConsumptionLogs = useQuery(
    api.consumptionLog.countTodayConsumptionLogs,
    {
      userId: "j979ed9pwnzbd855d74wsbnvas6ywe64" as Id<"users">,
    },
  );

  const addLine = useMutation(api.consumptionLog.add);
  const deleteLine = useMutation(api.consumptionLog.remove);

  const userConsumptionLogs = useQuery(
    api.consumptionLog.getUserConsumptionLogs,
    {
      userId: users?.[0]?._id as Id<"users">,
    },
  );

  const [newConsumption, setNewConsumption] = useState<ConsumptionType>({
    strainId: strains?.[0]?._id as Id<"strains">,
    quantity: 1,
    timestamp: new Date().toISOString(),
    userId: users?.[0]?._id as Id<"users">,
    method: "Smoke",
  });
  const [displayCreationForm, setDisplayCreationForm] =
    useState<boolean>(false);

  const getUserName = (userId: Id<"users">) => {
    const user = users?.find((u) => u._id === userId);
    return user?.name;
  };

  const getStrainName = (strainId: Id<"strains">) => {
    const strain = strains?.find((s) => s._id === strainId);
    return strain?.name;
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    if (name === "quantity") {
      setNewConsumption({ ...newConsumption, quantity: parseInt(value) });
    } else {
      setNewConsumption({ ...newConsumption, [name]: value });
    }
    console.log("Selected newUser:", newConsumption);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Adding new user:", newConsumption);
    addLine(newConsumption as ConsumptionType).catch((error) => {
      console.error("Failed to add strain:", error);
    });
    setNewConsumption({
      strainId: strains?.[0]?._id as Id<"strains">,
      quantity: 1,
      timestamp: new Date().toISOString(),
      userId: users?.[0]?._id as Id<"users">,
      method: "Smoke",
    });
  };

  const handleDeleteLine = async (id: Id<"consumptionLog">) => {
    try {
      await deleteLine({ id });
      console.log(`Deleted user with ID ${id}`);
    } catch (error) {
      console.error(`Failed to delete user with ID ${id}:`, error);
    }
  };

  console.log("userConsumptionLogs", userConsumptionLogs);

  return (
    <div className="flex flex-col container pt-6 gap-6 w-full">
      <h1 className="text-2xl font-semibold">
        Today you smoked {dailyConsumptionLogs} joints!
      </h1>
      {displayCreationForm && (
        <div className="flex flex-col grow">
          <h2 className="text-xl font-semibold">Add a new entry</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <select
              name="userId"
              value={newConsumption.userId}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            >
              {users?.map(({ name, _id }) => (
                <option key={_id} value={_id}>
                  {name}
                </option>
              ))}
            </select>
            <select
              name="strainId"
              value={newConsumption.strainId}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            >
              {strains?.map(({ name, _id }) => (
                <option key={_id} value={_id}>
                  {name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newConsumption.quantity}
              onChange={handleInputChange}
              required
            />
            <select
              name="method"
              value={newConsumption.method}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            >
              <option value="Smoke">Smoke</option>
              <option value="Bong">Bong</option>
              <option value="Dab">Dab</option>
              <option value="Edible">Edible</option>
            </select>

            <Button type="submit">Add User</Button>
          </form>
        </div>
      )}
      <div className="flex flex-col grow ">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium mt-4">Cannabis Consumption</h3>
          <Button onClick={() => setDisplayCreationForm(!displayCreationForm)}>
            {displayCreationForm ? "Hide" : "Add"} New Entry
          </Button>
        </div>
        <ul className="space-y-2">
          {consumptionLogs?.map((spliff) => (
            <li key={spliff._id} className="flex justify-between p-2 border-b">
              <span>
                {getUserName(spliff.userId)} {spliff.method.toLocaleLowerCase()}
                d {spliff.quantity} joints of {getStrainName(spliff.strainId)}{" "}
                the {new Date(spliff.timestamp).toLocaleDateString()}
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
      </div>
    </div>
  );
}

export default Consumption;
