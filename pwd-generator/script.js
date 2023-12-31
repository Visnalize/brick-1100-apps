var input = document.getElementById("input");
var output = document.getElementById("output");

var charset =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
var password = "";

window.addEventListener("keydown", handleKeydown);
window.bridge.on("keypress", handleKeypress);
window.bridge.on("numpress", handleKeypress);

function handleKeydown(e) {
  if (e.code === "Backspace") {
    input.textContent = input.textContent.slice(0, -1);
  }
  if (e.code.includes("Digit") && input.textContent.length < 2) {
    input.textContent += e.code.slice(-1);
  }
  if (e.code === "Enter") {
    if (input.textContent.length > 0 && !password) {
      generatePassword();
    } else {
      stop();
    }
  }
}

function handleKeypress(key) {
  if (typeof key === "number" && input.textContent.length < 2) {
    input.textContent += key;
  }

  if (key === "clear") {
    if (input.textContent.length > 0) {
      input.textContent = input.textContent.slice(0, -1);
    } else {
      stop();
    }
  }

  if (key === "ok") {
    if (input.textContent.length > 0 && !password) {
      generatePassword();
    } else {
      stop();
    }
  }
}

function stop(data) {
  password = "";
  window.bridge.send(window.parent, { event: "stop", data: data });
}

function generatePassword() {
  var length = parseInt(input.textContent);

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  if (password.length > 30) {
    return stop({ error: "Out of range" });
  }

  input.parentElement.hidden = true;
  output.parentElement.hidden = false;
  output.textContent = password;
}
