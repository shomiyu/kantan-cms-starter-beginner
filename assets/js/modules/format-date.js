export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const delimiter = ".";
  return `${date.getFullYear()}${delimiter}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${delimiter}${date
    .getDate()
    .toString()
    .padStart(2, "0")}`.replace(/\n|\r/g, "");
};
