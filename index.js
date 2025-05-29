function init(type) {
  const list = document.getElementById("list");
  const GIT_URL = `https://github.com/Visnalize/brick-1100-${type}/tree/main`;
  const GAME_URL = `https://brick1100-${type}.visnalize.com`;
  const PREVIEW_URL = "https://brick1100.visnalize.com/#/online/previewer";
  const PHONE_FRAME = "https://visnalize.com/assets/phone-v.CTqaLA5O.webp";
  const CACHE_KEY = `brick1100-${type}`;

  function render(data) {
    const items = data
      .filter((item) => item.type === "dir")
      .map((item) => {
        const name = item.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const iframe = m("iframe", {
          src: `${PREVIEW_URL}?url=${GAME_URL}/${item.name}`,
          frameborder: "0",
        });
        return m("div.mb-6", [
          m("div.frame.mx-auto", [iframe, m(`img[src='${PHONE_FRAME}']`)]),
          m(
            "a.button.is-text.is-block",
            {
              href: `${GIT_URL}/${item.name}`,
              target: "_blank",
            },
            m("h2.is-size-4.is-size-3-desktop", name)
          ),
        ]);
      });
    m.render(list, m("div.grid.is-col-min-10.is-gap-4", items));
  }

  function fetchData() {
    fetch(`https://api.github.com/repos/Visnalize/brick-1100-${type}/contents`)
      .then((response) => {
        if (response.ok && response.status === 200) {
          return response.json();
        }
        m.render(
          list,
          m("div.cell.has-text-centered", [
            m("h2.is-size-3", "Failed to fetch data"),
            m("p", "Please try again later"),
          ])
        );
      })
      .then((data) => {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, timestamp: Date.now() })
        );
        render(data);
      });
  }

  if (localStorage.getItem(CACHE_KEY)) {
    const { data, timestamp } = JSON.parse(localStorage.getItem(CACHE_KEY));
    const oneDay = 86400000;
    if (Date.now() - timestamp < oneDay) {
      render(data);
    } else {
      fetchData();
    }
  } else {
    fetchData();
  }

  bridge.send(target, {
    event: "_init",
    data: {
      "vw-ratio": 1.3070696471734529,
      color: {
        root: { fg: "#a3b65c", bg: "#000000e6" },
        inactive: { fg: "#4e5f46" },
        night: { fg: "#6b762d", inactive: { fg: "#1c2119" } },
      },
    },
  });
}
