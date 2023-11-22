var activeScreen = null;
var root = document.body;
var height, weight;

window.addEventListener("keydown", handleKeydown);
window.bridge.on("keypress", handleKeypress);
window.bridge.on("numpress", handleKeypress);

function handleKeydown(event) {
  var isNumber = event.code.includes("Digit");
  var isEnter = event.code === "Enter";
  var isClear = event.code === "Backspace";

  if (activeScreen === "InputHeight") {
    var heightInput = document.getElementById("height");
    if (isNumber && heightInput.textContent.length < 4) {
      heightInput.textContent += event.key;
    }
    if (isClear) {
      heightInput.textContent = heightInput.textContent.slice(0, -1);
    }
    if (isEnter) {
      height = Number(heightInput.textContent);
      m.mount(root, InputWeight);
    }
  } else if (activeScreen === "InputWeight") {
    var weightInput = document.getElementById("weight");
    if (isNumber && weightInput.textContent.length < 4) {
      weightInput.textContent += event.key;
    }
    if (isClear) {
      weightInput.textContent = weightInput.textContent.slice(0, -1);
    }
    if (isEnter) {
      weight = Number(weightInput.textContent);
      m.mount(root, Result);
    }
  } else {
    m.mount(root, InputHeight);
  }
}

function handleKeypress(key) {
  var isNumber = key >= 0 && key <= 9;
  var isEnter = key === 'ok';
  var isClear = key === 'clear';

  if (activeScreen === "InputHeight") {
    var heightInput = document.getElementById("height");
    if (isNumber && heightInput.textContent.length < 4) {
      heightInput.textContent += key;
    }
    if (isClear) {
      heightInput.textContent = heightInput.textContent.slice(0, -1);
    }
    if (isEnter) {
      height = Number(heightInput.textContent);
      m.mount(root, InputWeight);
    }
  } else if (activeScreen === "InputWeight") {
    var weightInput = document.getElementById("weight");
    if (isNumber && weightInput.textContent.length < 4) {
      weightInput.textContent += key;
    }
    if (isClear) {
      weightInput.textContent = weightInput.textContent.slice(0, -1);
    }
    if (isEnter) {
      weight = Number(weightInput.textContent);
      m.mount(root, Result);
    }
  } else {
    m.mount(root, InputHeight);
  }
}

function stop(data) {
  window.bridge.send(window.parent, { event: "stop", data: data });
}

function calculateBMI(height, weight) {
  var heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(2);
}

function categorizeBMI(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24.9) return "Normal weight";
  if (bmi < 29.9) return "Overweight";
  return "Obese";
}

var InputHeight = {
  view: function () {
    activeScreen = "InputHeight";
    return m("div.screen", [
      m("label", "Enter height (cm):"),
      m("div#height.input"),
      m("footer", "Next"),
    ]);
  },
};

var InputWeight = {
  view: function () {
    activeScreen = "InputWeight";
    return m("div.screen", [
      m("label", "Enter weight (kg):"),
      m("div#weight.input"),
      m("footer", "Calculate"),
    ]);
  },
};

var Result = {
  view: function (vnode) {
    activeScreen = "Result";
    var bmi = calculateBMI(height, weight);
    var category = categorizeBMI(bmi);
    return m("div.screen", [
      m("div", "Your BMI:"),
      m("div#result", [m("div", bmi), m("div", "(" + category + ")")]),
      m("footer", "OK"),
    ]);
  },
};

m.mount(root, InputHeight);
