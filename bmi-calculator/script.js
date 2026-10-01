var ui = window.bridge.ui;

function stop() {
  window.bridge.send(window.parent, { event: "stop" });
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

function askHeight() {
  ui.number({
    title: "Height (cm):",
    maxLength: 3,
    action: "Next",
    onDone: function (height) {
      if (!Number(height)) return ui.result({ type: "fail", message: "Enter your height" });
      askWeight(height);
    },
    onBack: stop,
  });
}

// Clear on an empty field closes this screen, which shows the height again.
function askWeight(height) {
  ui.number({
    title: "Weight (kg):",
    maxLength: 3,
    action: "Calculate",
    onDone: function (weight) {
      if (!Number(weight)) return ui.result({ type: "fail", message: "Enter your weight" });
      showResult(height, weight);
    },
  });
}

function showResult(height, weight) {
  var bmi = calculateBMI(height, weight);
  ui.confirm({
    text: bmi,
    info: categorizeBMI(bmi),
    onDone: function () {
      ui.closeAll();
      askHeight();
    },
  });
}

askHeight();
