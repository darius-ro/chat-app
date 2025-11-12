import { format, isToday } from "date-fns";

export function getPrettierTime(time: string) {
  const date = new Date(time);

  if (isToday(date)) {
    return `today at ${format(date, "HH:mm")}`;
  }

  return `on ${format(date, "dd.MM.yyyy")} at ${format(date, "HH:mm")}`;
}
