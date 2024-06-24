var activeScreen = null;
var root = document.body;
var height, weight;

window.addEventListener("keydown", handleEvent);
window.bridge.on("keypress", handleEvent);
window.bridge.on("numpress", handleEvent);

function handleEvent(data) {
  var isNumber, isEnter, isClear, key;
  if (typeof data === "object" && data.type) {
    isNumber = data.code.includes("Digit");
    isEnter = data.code === "Enter";
    isClear = data.code === "Backspace";
    key = data.key;
  } else {
    isNumber = data >= 0 && data <= 9;
    isEnter = data === "ok";
    isClear = data === "clear";
    key = data;
  }

  if (activeScreen === "InputHeight") {
    var heightInput = document.getElementById("height");
    if (isNumber && heightInput.textContent.length < 4) {
      heightInput.textContent += key;
    }
    if (isClear) {
      if (heightInput.textContent.length > 0) {
        heightInput.textContent = heightInput.textContent.slice(0, -1);
      } else {
        stop();
      }
    }
    if (isEnter) {
      height = heightInput.textContent;
      m.mount(root, InputWeight);
    }
  } else if (activeScreen === "InputWeight") {
    var weightInput = document.getElementById("weight");
    if (isNumber && weightInput.textContent.length < 4) {
      weightInput.textContent += key;
    }
    if (isClear) {
      if (weightInput.textContent.length > 0) {
        weightInput.textContent = weightInput.textContent.slice(0, -1);
      } else {
        m.mount(root, InputHeight);
      }
    }
    if (isEnter) {
      weight = weightInput.textContent;
      m.mount(root, Result);
    }
  } else {
    height = weight = undefined;
    m.mount(root, InputHeight);
  }
}

function stop(data) {
  window.bridge.send(window.parent, { event: "stop", data: data });
}

function calculateBMI(height, weight) {
  var heightInMeters = Number(height) / 100;
  return (Number(weight) / (heightInMeters * heightInMeters)).toFixed(2);
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
      m("div#height.input", height),
      m("footer", "Next"),
    ]);
  },
};

var InputWeight = {
  view: function () {
    activeScreen = "InputWeight";
    return m("div.screen", [
      m("label", "Enter weight (kg):"),
      m("div#weight.input", weight),
      m("footer", "Calculate"),
    ]);
  },
};

var Result = {
  view: function () {
    activeScreen = "Result";
    var bmi = calculateBMI(height, weight);
    var category = categorizeBMI(bmi);

    if (isNaN(bmi)) {
      stop({ error: "Invalid input" });
    }

    return m("div.screen", [
      m("div", "Your BMI:"),
      m("div#result", [m("div", bmi), m("div", "(" + category + ")")]),
      m("footer", "OK"),
    ]);
  },
};

m.mount(root, InputHeight);
