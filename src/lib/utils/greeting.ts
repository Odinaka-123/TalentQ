export type TimeOfDay = "morning" | "afternoon" | "night";

/**
 * Buckets the current local hour into morning / afternoon / night.
 * Uses the browser's own clock, so it naturally reflects whatever
 * timezone the person is actually in — no location lookup needed.
 *   morning:   5:00–11:59
 *   afternoon: 12:00–16:59
 *   night:     17:00–4:59
 */
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  return "night";
}
