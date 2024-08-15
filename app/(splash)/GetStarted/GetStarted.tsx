"use client";

import { useState, FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Strain {
  name: string;
  imageUrl: string;
  effectiveness: number;
  type: "Indica" | "Sativa" | "Hybrid" | "Unknown";
  origin: Id<"origins"> | "";
}

export function StrainsCRUD() {
  const [newStrain, setNewStrain] = useState<Strain>({
    name: "",
    imageUrl: "",
    effectiveness: 3,
    type: "Unknown",
    origin: "",
  });
  const origins = useQuery(api.origins.list);
  const strains = useQuery(api.strains.list);
  const addStrain = useMutation(api.strains.addStrain);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    if (name === "effectiveness") {
      setNewStrain({ ...newStrain, effectiveness: parseInt(value) });
    } else {
      setNewStrain({ ...newStrain, [name]: value });
    }
    console.log("Selected newStrain:", newStrain);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Adding new strain:", newStrain);
    addStrain(
      newStrain as {
        name: string;
        imageUrl: string;
        effectiveness: number;
        type: "Indica" | "Sativa" | "Hybrid" | "Unknown";
        origin: Id<"origins">;
      },
    ).catch((error) => {
      console.error("Failed to add strain:", error);
    });
    setNewStrain({
      name: "",
      imageUrl: "",
      effectiveness: 3,
      type: "Unknown",
      origin: "",
    });
  };

  return (
    <div className="flex grow flex-col">
      <div className="container pt-4 w-1/2">
        <h2 className="text-xl font-semibold">Strains</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={newStrain.name}
            onChange={handleInputChange}
            required
          />
          <Input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={newStrain.imageUrl}
            onChange={handleInputChange}
            required
          />
          <Input
            type="number"
            name="effectiveness"
            placeholder="Effectiveness"
            value={newStrain.effectiveness}
            onChange={handleInputChange}
            required
          />
          <select
            name="type"
            value={newStrain.type}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="Indica">Indica</option>
            <option value="Sativa">Sativa</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Unknown">Unknown</option>
          </select>
          <select
            name="origin"
            value={newStrain.origin}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            {origins?.map(({ name, _id }) => (
              <option key={_id} value={_id}>
                {name}
              </option>
            ))}
          </select>

          <Button type="submit">Add Strain</Button>
        </form>

        <h3 className="text-lg font-medium mt-4">Where did you buy from?</h3>
        <ul className="flex  space-x-2 border-r p-2">
          {origins?.map(({ name }) => (
            <span key={name} className="p-2 bg-green-500 rounded-lg  ">
              {name}
            </span>
          ))}
        </ul>

        <h3 className="text-lg font-medium mt-4">Your Strains</h3>
        <ul className="space-y-2">
          {strains?.map((strain) => (
            <li key={strain._id} className="flex justify-between p-2 border-b">
              <span>
                {strain.name} - {strain.type}
              </span>
              {/* Placeholder for update and delete buttons */}
              <div>
                <Button variant="ghost">Update</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
