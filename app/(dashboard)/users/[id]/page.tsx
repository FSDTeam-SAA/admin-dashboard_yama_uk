"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { approveUser, getErrorMessage, getUserById, rejectUser } from "@/lib/api";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => getUserById(params.id),
  });

  const approveMutation = useMutation({
    mutationFn: () => approveUser(params.id),
    onSuccess: () => {
      toast.success("User approved");
      queryClient.invalidateQueries({ queryKey: ["user", params.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectUser(params.id),
    onSuccess: () => {
      toast.success("User rejected and removed");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/users");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button className="inline-flex items-center gap-2 text-3xl font-semibold" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" /> User Details
        </button>
      </div>

      {isLoading ? (
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      ) : (
        <>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-6">
              <div className="h-44 w-44 rounded-full bg-[#cbd5e1]" />
              <div>
                <h2 className="text-3xl font-semibold">{data?.name || "Valentino Rossi"}</h2>
                <p className="mt-2 flex items-center gap-2 text-base text-[#6b7280]">
                  <MapPin className="h-6 w-6" /> {data?.address || "Berlin, Germany"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="h-14 px-6 text-lg" onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}>
                Approve
              </Button>
              <Button
                variant="destructive"
                className="h-14 px-6 text-lg"
                onClick={() => rejectMutation.mutate()}
                disabled={rejectMutation.isPending}
              >
                Reject
              </Button>
            </div>
          </div>

          <Card className="bg-[#f4f6f8]">
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-lg font-medium">Email</p>
                <Input readOnly value={data?.email || ""} className="h-14 border-[#c7cbd1] text-lg text-[#6b7280]" />
              </div>
              <div>
                <p className="mb-2 text-lg font-medium">Phone Number</p>
                <Input readOnly value={data?.phone || "454854848989"} className="h-14 border-[#c7cbd1] text-lg text-[#6b7280]" />
              </div>
              <div className="md:col-span-2">
                <p className="mb-2 text-lg font-medium">UK Residential Address</p>
                <Input
                  readOnly
                  value={data?.address || "10 Downing Street, London, SW1A 2AA"}
                  className="h-14 border-[#c7cbd1] text-lg text-[#6b7280]"
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}


