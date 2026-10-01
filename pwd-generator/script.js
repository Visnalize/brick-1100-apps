var ui = window.bridge.ui;

var charset =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
var MAX_LENGTH = 30;

function stop() {
  window.bridge.send(window.parent, { event: "stop" });
}

function generatePassword(length) {
  var password = "";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
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
