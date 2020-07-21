function timeConverter(UNIX_timestamp) {
  var d = new Date(UNIX_timestamp); // The 0 there is the key, which sets the date to the epoch
  // d.setUTCSeconds(UNIX_timestamp);
  var time =
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

export { timeConverter };
