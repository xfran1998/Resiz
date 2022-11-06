# Resiz (Resizable Div Container)

Live Demo: https://sevng.com/

## Create a resizable grid container with any layout you want.

Container and handlers of resizable div that can be customized and styled

Options can be modified to fit your needs:

- `width`: width of the wrapper
- `height`: height of the wrapper
- `id`: id of the wrapper
- `minWidth`: Minimum width of the containers
- `minHeight`: Minimum height of the containers
- `thickness`: Thickness of the handlers
- `color`: Color of the handlers
- `class_box`: Class of all the containers (can be used to style the containers)

All the `id`s of the containers will be generated automatically by the value of the layout.

Will be updated soon.

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

![Resiz img](https://i.imgur.com/4XSZiFC.png)

State: Beta 1.0.0
