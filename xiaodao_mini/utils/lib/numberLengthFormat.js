var numberLengthFormat = function(num, length = 2) {
  return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}

module.exports = numberLengthFormat