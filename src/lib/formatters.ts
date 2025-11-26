export const formatDate = (dateString: string | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Using Spanish locale to get DD/MM/YYYY format
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Converts a Date object or a date string to YYYY-MM-DD format.
 * @param date The date to format.
 * @returns The formatted date string or an empty string if the date is invalid.
 */
export const toYYYYMMDD = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    console.error("Failed to format date", date, error);
    return "";
  }
};
