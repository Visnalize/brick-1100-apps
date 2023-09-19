var routes = [
  { title: "Number", href: "/number", range: [1, 100] },
  {
    title: "Color",
    href: "/color",
    array: ["Red", "Green", "Blue", "Orange", "Green", "Violet"],
  },
  { title: "Coin", href: "/coin", array: ["Head", "Tail"] },
];

var routeIndex = 0;

var ModeSelect = {
  view: function () {
    return m(
      "div#list-select",
      routes.map(function (route, i) {
        return m("div" + (routeIndex === i ? ".active" : ""), route.title);
      })
    );
  },
};

var RouteIndex = {
  view: function () {
    return [m(ModeSelect), m("footer", "Select")];
  },
};

var RouteResult = {
  view: function () {
    var route;
    var title;
    var result;
    routes.forEach(function (r) {
      if (m.route.get() === r.href) {
        route = r;
      }
    });

    if (route.array) {
      result = route.array[randomize(0, route.array.length - 1)];
    } else if (route.range) {
      result = randomize(route.range[0], route.range[1]);
    }

    if (route.title === "Coin") {
      title = "Coin tossed:";
    } else {
      title = "Lucky " + route.title + ":";
    }

    return m("div#result-screen", [
      m("div", title),
      m("div#output", result),
      m("footer", "OK"),
    ]);
  },
};

var routeMap = { "/": RouteIndex };

routes.forEach(function (route) {
  routeMap[route.href] = RouteResult;
});

m.route(document.body, "/", routeMap);

/**
 * @param {number} min
 * @param {number} max
 */
function randomize(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener("keydown", handleKeydown);
window.bridge.on("keypress", handleKeypress);
window.bridge.on("numpress", handleKeypress);

/** @param {KeyboardEvent} event */
function handleKeydown(event) {
  var route = m.route.get();
  if (route === "") {
    if (event.code === "ArrowUp") {
      routeIndex = (routeIndex - 1 + routes.length) % routes.length;
      m.redraw();
    }
    if (event.code === "ArrowDown") {
      routeIndex = (routeIndex + 1) % routes.length;
      m.redraw();
    }
    if (event.code === "Enter") {
      m.route.set(routes[routeIndex].href);
    }
  } else {
    m.route.set("");
  }
}

function handleKeypress(key) {
  var route = m.route.get();
  if (route === "") {
    if (key === "up") {
      routeIndex = (routeIndex - 1 + routes.length) % routes.length;
      m.redraw();
    }
    if (key === "down") {
      routeIndex = (routeIndex + 1) % routes.length;
      m.redraw();
    }
    if (key === "ok") {
      m.route.set(routes[routeIndex].href);
    }
    if (key === "clear") {
      window.bridge.send(window.parent, { event: "stop" });
    }
  } else {
    if (key === "clear") {
      window.bridge.send(window.parent, { event: "stop" });
    } else {
      m.route.set("");
    }
  }
}
