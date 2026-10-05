var ui = window.bridge.ui;

var charset =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
var MAX_LENGTH = 30;

function stop() {
  window.bridge.send(window.parent, { event: "stop" });
}

/**
 * A random index below `max` from the browser's secure random numbers. Math.random is not made for
 * passwords. Values past the last whole multiple of `max` are drawn again, so every index is as
 * likely as any other.
 */
function randomIndex(max) {
  var limit = 256 - (256 % max);
  var byte = new Uint8Array(1);
  do {
    window.crypto.getRandomValues(byte);
  } while (byte[0] >= limit);
  return byte[0] % max;
}

function generatePassword(length) {
  var password = "";
  for (var i = 0; i < length; i++) {
    password += charset.charAt(randomIndex(charset.length));
  }
  return password;
}

ui.number({
  title: "Password length",
  maxLength: 2,
  action: "Generate",
  onDone: function (value) {
    var length = parseInt(value, 10);
    if (!length || length > MAX_LENGTH) {
      return ui.result({ type: "fail", message: "Out of range" });
    }
    ui.text({ title: "Your password", text: generatePassword(length), onDone: stop });
  },
  onBack: stop,
});
