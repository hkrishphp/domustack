/** Convert an ISO timestamp to a relative time string like "2 min ago" */
export function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

  return formatDate(isoDate);
}

/** Convert an ISO date string to "Jan 15, 2026" format */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Map DB status values to display labels */
export function statusLabel(status: string): string {
  switch (status) {
    case "open":
      return "Open for Bids";
    case "planning":
      return "Planning";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

/** CSS classes for project status badges */
export function statusColor(status: string): string {
  switch (status) {
    case "open":
      return "bg-accent/15 text-accent";
    case "completed":
      return "bg-verified/20 text-green-700";
    case "in_progress":
      return "bg-primary/10 text-primary";
    default:
      return "bg-secondary text-muted-foreground";
  }
}
