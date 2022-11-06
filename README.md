# Resiz (Resizable Div Container)

Live Demo

## Create a resizable grid container with any layout you want.



```js
const valid_box = new resizeBox(
  [
    ["nav", "nav", "nav"],
    ["left-menu", "code", "code"],
    ["left-menu", "iframe", "iframe"],
    ["left-menu", "iframe", "iframe"],
  ],
  {
    width: "600px",
    height: "500px",
    thickness: "4px",
    color: "#111",
  }
);
```

![Resiz img](https://i.imgur.com/3mHGoNt.png)

```js
let join = true;
const valid_box = new resizeBox(
  [
    [0, 1],
    [2, 3],
  ],
  {
    width: "600px",
    height: "500px",
    thickness: "4px",
    color: "#111",
    join,
  }
);
```

Container and handlers of resizable div that can be customized and styled

State: Beta 1.0.0
