import { Decoration } from "@/lib/types";
import { Badge } from "../ui/badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export const getVerificationBadge = (decoration: Decoration) => {
  if (decoration.verified) {
    return (
      <Badge className="bg-green-500 hover:bg-green-600">
        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
      </Badge>
    );
  } else if (decoration.verificationSubmitted) {
    if (decoration.verificationStatus === "pending") {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          <AlertTriangle className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
    } else if (decoration.verificationStatus === "rejected") {
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          <AlertTriangle className="w-3 h-3 mr-1" /> Rejected
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-500 hover:bg-yellow-600">
        <AlertTriangle className="w-3 h-3 mr-1" /> Pending
      </Badge>
    );
  }
  return (
    <Badge className="bg-white hover:bg-gray-50 text-black">
      <AlertTriangle className="w-3 h-3 mr-1" /> Unverified
    </Badge>
  );
};
