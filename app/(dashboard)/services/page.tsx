"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage, getServices, updateService } from "@/lib/api";

export default function ServicesPage() {
  const [vehicleType, setVehicleType] = React.useState<"car" | "truck">("car");
  const [zipCode, setZipCode] = React.useState("");
  const [drafts, setDrafts] = React.useState<Record<string, { price: string; commission: string }>>({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["services", vehicleType],
    queryFn: () => getServices({ vehicleType, page: 1, limit: 10 }),
  });

  const mutation = useMutation({
    mutationFn: (payload: { id: string; price: number }) => updateService(payload.id, { price: payload.price }),
    onSuccess: () => {
      toast.success("Service updated");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-[#1f2937]">Services</h1>

      <div className="rounded-xl bg-[#cce5f5] p-2">
        <div className="grid grid-cols-2 gap-2">
          <Button variant={vehicleType === "car" ? "default" : "secondary"} className="h-14 text-base" onClick={() => setVehicleType("car")}>
            Car/SUV
          </Button>
          <Button variant={vehicleType === "truck" ? "default" : "secondary"} className="h-14 text-base" onClick={() => setVehicleType("truck")}>
            Truck / Trailer
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-semibold">Set Service Location</h2>
        <div className="flex gap-2">
          <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Add Zip Code" className="h-12 max-w-sm bg-[#f4f6f8] text-base" />
          <Button className="h-12" onClick={() => toast.success(`Zip code ${zipCode} added`)}>
            Add
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#b9bfc8] bg-[#f4f6f8]">
        <table className="min-w-full">
          <thead className="bg-[#cce5f5] text-left text-lg font-semibold">
            <tr>
              <th className="px-4 py-4">Serial Number</th>
              <th className="px-4 py-4">Current Price</th>
              <th className="px-4 py-4">Update Price</th>
              <th className="px-4 py-4">Set Commission</th>
              <th className="px-4 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-12 w-full" />
                    </td>
                  </tr>
                ))
              : data?.data.map((service) => (
                  <tr key={service._id} className="border-b border-[#d2d7dc] text-[17px]">
                    <td className="px-4 py-4">
                      {service.title || `${service.carName} ${service.carModel}`}
                    </td>
                    <td className="px-4 py-4">${service.price}</td>
                    <td className="px-4 py-4">
                      <Input
                        className="h-12 max-w-[180px] border-dashed border-[#9ca3af] text-base"
                        value={drafts[service._id]?.price ?? ""}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [service._id]: { ...(prev[service._id] || { commission: "" }), price: e.target.value },
                          }))
                        }
                        placeholder="$100"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Input
                        className="h-12 max-w-[180px] border-dashed border-[#9ca3af] text-base"
                        value={drafts[service._id]?.commission ?? ""}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [service._id]: { ...(prev[service._id] || { price: "" }), commission: e.target.value },
                          }))
                        }
                        placeholder="10%"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        size="sm"
                        onClick={() => {
                          const value = Number(drafts[service._id]?.price || "0");
                          if (!value) {
                            toast.error("Enter a valid price");
                            return;
                          }
                          mutation.mutate({ id: service._id, price: value });
                        }}
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <Button className="h-14 w-52 text-lg" onClick={() => toast.success("Services submitted")}>
          Submit
        </Button>
      </div>
    </div>
  );
}


