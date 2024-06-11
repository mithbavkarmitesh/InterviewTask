import moment from "moment";

/**
 *
 * @param date Date Object
 * @returns date in format dd-mm-yyyy
 */
function formatDate(date: Date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}

/**
 * Converts string to Date object
 * @param dateString
 * @returns Date Object
 */
function convertToDate(dateString: string) {
  //  Convert a "dd/MM/yyyy" string into a Date object
  let d = dateString.split("/");
  let dat = new Date(d[2] + "/" + d[1] + "/" + d[0]);
  return dat;
}
const CONFIG_NEW = {
  future: "in %s",
  past: "%s ago",
  s: "secs",
  ss: "%ss",
  m: "a min",
  mm: "%dm",
  h: "1h",
  hh: "%dh",
  d: "a day",
  dd: "%dd",
  M: "month",
  MM: "%dM",
  y: "year",
  yy: "%dY",
};

const getTimeAgo = (dateString: string) => {
  const parsedDate = moment.utc(dateString).local();
  moment.updateLocale("en", { relativeTime: CONFIG_NEW });
  const timeAgo = parsedDate.fromNow();
  return timeAgo;
};

export { formatDate, convertToDate, getTimeAgo };
