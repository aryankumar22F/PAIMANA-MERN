// Simple rule-based risk scoring (0-100).
// This can later be replaced/enhanced with an ML model by your teammate.

export const calculateRiskScore = (project) => {
  let score = 0;

  // Cost overrun factor
  const costOverrunPercent =
    ((project.revisedCost - project.sanctionedCost) / project.sanctionedCost) * 100;
  if (costOverrunPercent > 25) score += 35;
  else if (costOverrunPercent > 10) score += 20;
  else if (costOverrunPercent > 0) score += 10;

  // Schedule delay factor
  if (project.revisedCompletionDate) {
    const delayDays = Math.round(
      (new Date(project.revisedCompletionDate) - new Date(project.originalCompletionDate)) /
        (1000 * 60 * 60 * 24)
    );
    if (delayDays > 365) score += 35;
    else if (delayDays > 180) score += 20;
    else if (delayDays > 0) score += 10;
  }

  // Progress mismatch factor (financial progress far ahead of physical progress = red flag)
  const progressGap = project.financialProgress - project.physicalProgress;
  if (progressGap > 20) score += 20;
  else if (progressGap > 10) score += 10;

  // Low physical progress despite time elapsed
  const totalDuration =
    new Date(project.originalCompletionDate) - new Date(project.startDate);
  const elapsed = new Date() - new Date(project.startDate);
  const expectedProgress = Math.min(100, (elapsed / totalDuration) * 100);
  if (expectedProgress - project.physicalProgress > 25) score += 15;

  return Math.min(100, Math.round(score));
};

export const getStatusFromRisk = (riskScore, physicalProgress) => {
  if (physicalProgress >= 100) return "Completed";
  if (riskScore >= 60) return "Critical";
  if (riskScore >= 35) return "Delayed";
  if (riskScore >= 15) return "Cost Overrun";
  return "On Track";
};
