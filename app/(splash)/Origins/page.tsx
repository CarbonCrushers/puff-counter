"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";

interface Origin {
  _id: Id<"origins">;
  name: string;
}

function OriginsTable() {
  const [newOriginName, setNewOriginName] = useState<string>("");
  const [editingOrigin, setEditingOrigin] = useState<Origin | null>(null);

  const origins = useQuery(api.origins.list);
  const addOrigin = useMutation(api.origins.add);
  const updateOrigin = useMutation(api.origins.update);
  const removeOrigin = useMutation(api.origins.remove);

  const handleAddOrigin = async () => {
    if (newOriginName.trim() !== "") {
      await addOrigin({ name: newOriginName });
      setNewOriginName("");
    }
  };

  const handleUpdateOrigin = async (id: Id<"origins">) => {
    if (editingOrigin?.name.trim() !== "") {
      await updateOrigin({ id, name: editingOrigin!.name });
      setEditingOrigin(null);
    }
  };

  const handleDeleteOrigin = async (id: Id<"origins">) => {
    await removeOrigin({ id });
  };

  return (
    <div className="flex grow flex-col">
      <div className="container">
        <div className="container px-6 pt-4">
          <h2 className="text-2xl font-semibold mb-4">Origins</h2>

          <div className="mb-4 flex">
            <Input
              type="text"
              placeholder="New Origin Name"
              value={newOriginName}
              onChange={(e) => setNewOriginName(e.target.value)}
              className="mr-2"
            />
            <Button onClick={handleAddOrigin} disabled={!newOriginName}>
              Add Origin
            </Button>
          </div>

          <table className="table-auto w-full">
            <thead>
              <tr className="">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {origins?.map((origin) => (
                <tr key={origin._id} className="border-t">
                  <td className="px-4 py-2">
                    {editingOrigin && editingOrigin._id === origin._id ? (
                      <Input
                        type="text"
                        value={editingOrigin.name}
                        onChange={(e) =>
                          setEditingOrigin({
                            ...editingOrigin,
                            name: e.target.value,
                          })
                        }
                        className="mr-2"
                      />
                    ) : (
                      origin.name
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {editingOrigin && editingOrigin._id === origin._id ? (
                      <Button
                        variant="default"
                        onClick={() => handleUpdateOrigin(origin._id)}
                        className="mr-2"
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => setEditingOrigin(origin)}
                        className="mr-2"
                      >
                        <Pencil1Icon />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteOrigin(origin._id)}
                    >
                      <TrashIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OriginsTable;
