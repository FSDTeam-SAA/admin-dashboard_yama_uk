import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentDisputePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-[#1f2937]">Payment / Dispute</h1>
      <Card className="bg-[#f4f6f8]">
        <CardHeader>
          <CardTitle className="text-lg">Dispute Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-[#6b7280]">
            This section is prepared for payment and dispute operations. Connect your backend dispute endpoints here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


