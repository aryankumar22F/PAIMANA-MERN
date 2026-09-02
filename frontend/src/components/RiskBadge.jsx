import React from "react";
import { CheckCircle2, Clock, AlertTriangle, AlertOctagon, HelpCircle } from "lucide-react";

const RiskBadge = ({ status }) => {
  let badgeClass = "badge-status";
  let Icon = HelpCircle;

  switch (status) {
    case "On Track":
      badgeClass += " on-track";
      Icon = CheckCircle2;
      break;
    case "Delayed":
      badgeClass += " delayed";
      Icon = Clock;
      break;
    case "Cost Overrun":
      badgeClass += " cost-overrun";
      Icon = AlertTriangle;
      break;
    case "Critical":
      badgeClass += " critical";
      Icon = AlertOctagon;
      break;
    case "Completed":
      badgeClass += " completed";
      Icon = CheckCircle2;
      break;
    default:
      badgeClass += " on-track";
  }

  return (
    <span className={badgeClass}>
      <Icon size={12} />
      <span>{status || "Unknown"}</span>
    </span>
  );
};

export default RiskBadge;
