const VI_WEEK = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

export function DateToString(date: Date) {
  const today = new Date();
  const input = new Date(date);
  const year = input.getFullYear();
  const month = input.getMonth();
  const day = input.getDate();
  const hour = input.getHours();
  const minute = input.getMinutes();

  const isInThisWeek = isDateInThisWeek(input);
  const dayOfWeek = VI_WEEK[input.getDay()];
  if (isInThisWeek) {
    return day !== today.getDate()
      ? `${dayOfWeek} ${hour}:${
          minute < 10 ? `0${minute}` : minute
        } ${getTimePeriod(hour)}`
      : `${hour}:${minute < 10 ? `0${minute}` : minute}`;
  }
  return `${hour}:${
    minute < 10 ? `0${minute}` : minute
  } ${day} Tháng ${month}, ${year}`;
}

export function isDateInThisWeek(date: Date) {
  const today = new Date();

  const currentDayOfWeek = today.getDay();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(
    today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1)
  );

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return date >= startOfWeek && date <= endOfWeek;
}

export function getTimePeriod(hour: number) {
  if (hour <= 12) return "Sáng";
  if (hour <= 18) return "Chiều";
  return "Tối";
}
