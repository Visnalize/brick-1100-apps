var ui = window.bridge.ui;

var modes = [
  { title: "Number", result: "Lucky number", range: [1, 100] },
  { title: "Color", result: "Lucky color", array: ["Red", "Green", "Blue", "Orange", "Violet"] },
  { title: "Coin", result: "Coin tossed", array: ["Heads", "Tails"] },
];

/**
 * @param {number} min
 * @param {number} max
 */
function randomize(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(mode) {
  if (mode.array) return mode.array[randomize(0, mode.array.length - 1)];
  return String(randomize(mode.range[0], mode.range[1]));
}

// OK picks again. The screen goes blank for a moment first, so that a pick equal to the last one
// still shows that something happened.
function showPick(mode) {
  ui.text({
    title: mode.result,
    text: pick(mode),
    action: "Again",
    onDone: function (screen) {
      screen.close();
      // Keys do nothing on the blank screen, which closes by itself
      var noop = function () {};
      var blank = ui.text({ title: mode.result, text: " ", action: "Again", onDone: noop, onBack: noop });
      setTimeout(function () {
        blank.close();
        showPick(mode);
      }, 250);
    },
  });
}

ui.list({
  title: "Randomizer",
  items: modes.map(function (mode) {
    return mode.title;
  }),
  onSelect: function (index) {
    showPick(modes[index]);
  },
  onBack: function () {
    window.bridge.send(window.parent, { event: "stop" });
  },
});
