function timeConverter(UNIX_timestamp) {
  let d = new Date(UNIX_timestamp); // The 0 there is the key, which sets the date to the epoch
  // d.setUTCSeconds(UNIX_timestamp);
  let time =
    d.getDate() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getFullYear() +
    " " +
    d.getHours() +
    ":" +
    d.getMinutes();
  return time;
}

function fileNameDate() {
  let d = new Date();
  return `${d.getDate()}${d.getMonth() + 1}${d.getFullYear()}`;
}

export { timeConverter, fileNameDate };
