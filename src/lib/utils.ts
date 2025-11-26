export const getTrafficLightColor = (endDate: string | Date): string => {
  if (!endDate) return "bg-gray-400"; // Default color for tasks with no end date

  const today = new Date();
  const dueDate = new Date(endDate);

  // Reset time part to compare dates only
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 2) {
    return "red"; // Red for less than 2 days or past due
  } else if (diffDays <= 3) {
    return "yellow"; // Yellow for 2-3 days
  } else {
    return "green"; // Green for more than 3 days
  }
};
