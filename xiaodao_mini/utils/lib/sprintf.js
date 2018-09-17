var sprintf = function () {
  var arg = arguments,
    str = arg[0] || '',
    i, n;
  for (i = 1, n = arg.length; i < n; i++) {
    str = str.replace(/%d/, arg[i]);
  }
  return str;
}

module.exports = sprintf
