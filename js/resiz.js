var dragging = false;

class resizeBox {
  constructor(
    layout = null,
    {
      width = "500px",
      height = "500px",
      location = "body",
      class_box = "resize-box",
      thickness = "10px",
      color = "#444",
    }
  ) {
    if (layout === null) return;

    this.dragging = false;

    this.width = width;
    this.height = height;
    this.location = location;
    this.class_box = class_box;
    this.thickness = thickness;
    this.color = color;

    this.min = 300;
    this.max = 1000;

    this.resizable_boxes = [];
    this.resizable_bar_x = []; // horizontal bar
    this.resizable_bar_y = []; // vertical bar

    this.create_layout(layout);
    console.log(this.boxes);
    console.log(this.handle);

    // check if the layout is valid.
    if (!this.checkIsValidCorners(this.boxes))
      throw new Error("Invalid layout");

    this.create_container();
    this.generateListeners();
  }

  create_container() {
    const width_boxes = parseInt(this.width.split("px")[0]) / this.main_axis_y;
    const height_boxes =
      parseInt(this.height.split("px")[0]) / this.main_axis_x;
    const container = document.createElement("div");
    container.classList.add("resize-container");
    container.style.width = this.width;
    container.style.height = this.height;
    container.style.position = "relative";
    container.style.overflow = "hidden";
    // container.style.display = 'flex';
    // container.style.flexDirection = 'row';
    // container.style.flexWrap = 'wrap';

    // create resizable boxes
    Object.keys(this.boxes).forEach((key, index) => {
      let box = document.createElement("div");
      box.classList.add("box");
      box.classList.add("resize-box");
      box.style.top = this.boxes[key].top * height_boxes + "px";
      box.style.left = this.boxes[key].left * width_boxes + "px";
      box.style.width =
        (this.boxes[key].right - this.boxes[key].left) * width_boxes + "px";
      box.style.height =
        (this.boxes[key].bottom - this.boxes[key].top) * height_boxes + "px";
      box.style.position = "absolute";
      box.style.background =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
      box.style.zIndex = "1";

      container.appendChild(box);
    });

    // create resizable bars
    Object.keys(this.handle).forEach((key) => {
      this.handle[key].forEach((handler, index) => {
        let bar = document.createElement("div");
        bar.classList.add("resize-bar");
        // bar.classList.add(key);
        bar.setAttribute("data-axis", key);
        bar.setAttribute("data-index", index);
        bar.style.position = "absolute";
        bar.style.zIndex = "2";
        bar.style.backgroundColor = this.color;
        // bar.style.borderRadius = 'px';
        bar.style.transition = "all 0.5s";
        // bar.style.transformOrigin = '50% 50%';

        console.log(handler);
        if (key == "xAxis") {
          bar.style.cursor = "row-resize";
          bar.style.transform = "translate(0, -50%)";
          let top = handler.boundrie[0][0] * height_boxes;
          let left = handler.boundrie[0][1] * width_boxes;
          let width =
            (handler.boundrie[1][1] - handler.boundrie[0][1]) * width_boxes;
          // let height = parseInt(this.thickness.split('px')[0]);
          let height = this.thickness;
          console.log(this.thickness);

          bar.style.top = top + "px";
          bar.style.left = left + "px";
          bar.style.width = width + "px";
          bar.style.height = height;
        }

        if (key == "yAxis") {
          bar.style.cursor = "col-resize";
          bar.style.transform = "translate(-50%, 0)";
          let top = handler.boundrie[0][0] * height_boxes;
          let left = handler.boundrie[0][1] * width_boxes;
          let width = this.thickness;
          let height =
            (handler.boundrie[1][0] - handler.boundrie[0][0]) * height_boxes;

          bar.style.top = top + "px";
          bar.style.left = left + "px";
          bar.style.width = width;
          bar.style.height = height + "px";
        }

        container.appendChild(bar);
      });
    });

    document.querySelector("#test").appendChild(container);
  }

  create_layout(layout) {
    // RULES:
    // - Only one box can be resized at a time.
    // - The boxes has to be squares or rectangles, not polygons.
    // - The boxes had to be resizable with the edge resize bars.

    // Example1:
    // [[ 0, 0, 1 ].
    //  [ 0, 0, 1 ]]
    //
    // RESULT:
    // [ X X | Y ]
    // [ X X | Y ]

    // Example2:
    // [[ a, c, b ].
    //  [ a, c, b ]]
    //
    // RESULT:
    // [ X | Y | Z ]
    // [ X | Y | Z ]

    // Example3:
    // [[ a, b, b ].
    //  [ a, c, c ]]
    //
    // RESULT:
    // [ X | Z  Z ]
    // [   | ---- ]
    // [ X | Y  Y ]

    // STEP 1:
    // - Create a matrix with the layout.
    const boxes = {};
    const handle = {
      xAxis: [], // horizontal bar  --> yAxis: [{ boundrie: [[1,1],[1,3]], containers: [0, 'a', 'b']}, {...} ]
      yAxis: [], // vertical bar    --> xAxis: [{ boundrie: [[1,1],[3,1]], containers: [0, 'a', 'b']}, {...} ]
    };
    this.main_axis_x = layout.length;
    this.main_axis_y = layout[0].length;

    // Get different boxes from the layout.
    for (let i = 0; i < this.main_axis_x; i++) {
      for (let j = 0; j < this.main_axis_y; j++) {
        const box_type = layout[i][j];

        if (!boxes[box_type]) {
          boxes[box_type] = [];
        }
        boxes[box_type].push([i, j]);
      }
    }

    // create handlers for the boxes.
    Object.keys(boxes).forEach((box_type) => {
      const box = boxes[box_type];
      const boundries = this.getBoundries(
        box,
        this.main_axis_x,
        this.main_axis_y
      );

      boxes[box_type] = boundries.corners;

      // console.log(boundries);
      Object.keys(boundries.boundries).forEach((key) => {
        if (boundries.boundries[key] && boundries.boundries[key].length > 0) {
          this.setHandler(handle, boundries.boundries[key], box_type);
        }
      });
    });

    this.boxes = boxes;
    this.handle = handle;
  }

  isXAxis(boundrie) {
    return boundrie[0][0] === boundrie[1][0]; // check if the boundrie is in the x axis. of 2 points
  }

  setHandler(handlers, boundrie, box_type) {
    // check if the boundrie is in the x axis. of 2 points
    const axis = this.isXAxis(boundrie) ? "xAxis" : "yAxis";

    // check if the handler already exists.
    const handler = handlers[axis].find((handler) => {
      return (
        handler.boundrie[0][0] === boundrie[0][0] &&
        handler.boundrie[0][1] === boundrie[0][1] &&
        handler.boundrie[1][0] === boundrie[1][0] &&
        handler.boundrie[1][1] === boundrie[1][1]
      );
    });

    // if the handler already exists, return
    if (handler) {
      // add container to the handler.
      handler.containers.push(box_type);
      return;
    }

    // in case the handler doesn't exist, check if it's contained
    const containedBy = handlers[axis].find((handler) => {
      return (
        handler.boundrie[0][0] <= boundrie[0][0] &&
        handler.boundrie[0][1] <= boundrie[0][1] &&
        handler.boundrie[1][0] >= boundrie[1][0] &&
        handler.boundrie[1][1] >= boundrie[1][1]
      );
    });

    // if the handler is contained, return
    if (containedBy) {
      // add container to the handler.
      containedBy.containers.push(box_type);

      return;
    }

    // in case the handler is not contained, check if it contains other handlers
    const contains = handlers[axis].filter((handler) => {
      return (
        handler.boundrie[0][0] >= boundrie[0][0] &&
        handler.boundrie[0][1] >= boundrie[0][1] &&
        handler.boundrie[1][0] <= boundrie[1][0] &&
        handler.boundrie[1][1] <= boundrie[1][1]
      );
    });

    // if the handler contains other handlers, remove them
    // first save the containers of the removed handlers
    const containers = [];
    if (contains.length > 0) {
      contains.forEach((handler) => {
        containers.push(...handler.containers);
        handlers[axis].splice(handlers[axis].indexOf(handler), 1);
      });
    }

    // add the handler to the list
    handlers[axis].push({
      boundrie: boundrie,
      containers: [box_type, ...containers],
    });
  }

  /* ***** getBoundries *****
    input: array of boxes, max_size_x, max_size_y.
    output: array of boundries.

    - boxes: Array of positions of the boxes.                       Array(Array(x, y)).
    - position: index of the box                                    Array(x, y).
    - max_size_x: max size of the x axis.                           Number.
    - max_size_y: max size of the y axis.                           Number.
    - boundries: Array of boundries.                                Object(Array(Array(x, y))).
    - boundry: Array of position [start, end].                      Array(Array(x, y)). 

    return the box boundries:
    { top, right, bottom, left }
    
    inside boundries can be null if the box has no boundry on the coord.
    the boundry is null in case to be iqual to 0 or the max size of the layout.

    Note: box [0,0] has vertex [ [0,0], [0,1], [1,0], [1,1] ] when the handle could be created.
    
    Example 1:
    input:
        boxes: [ [0,0], [0,1], [1,0], [1,1] ]
        max_size_x: 3
        max_size_y: 2

    output:
    corners: { top: 0, right: 2, bottom: 2, left: 0] }
        boundries: { top: null, right: [[0,2], [2,2]] , bottom: null, left: null }
    
    Example 2:
    input:
        boxes: [ [0,2], [1,2] ]
        max_size_x: 2
        max_size_y: 3

    output:
        corners: { top: 0, right: 3, bottom: 2, left: 2] }
        boundries: { top: null, right: null, bottom: null, left: [[2,0], [2,2]] }
    */
  getBoundries(boxes, max_size_x, max_size_y) {
    let boundries = {
      top: null,
      right: null,
      bottom: null,
      left: null,
    };

    // get corners of the box array
    // initializate the corners with the first box.
    const corners = {
      top: boxes[0][0],
      right: boxes[0][1],
      bottom: boxes[0][0],
      left: boxes[0][1],
    };
    boxes.forEach((box) => {
      // check top corner
      if (box[0] < corners.top) {
        corners.top = box[0];
      }
      // check right corner
      if (box[1] + 1 > corners.right) {
        corners.right = box[1] + 1;
      }
      // check bottom corner
      if (box[0] + 1 > corners.bottom) {
        corners.bottom = box[0] + 1;
      }
      // check left corner
      if (box[1] < corners.left) {
        corners.left = box[1];
      }
    });

    // get boundries
    // top boundry
    if (corners.top > 0) {
      boundries.top = [
        [corners.top, corners.left],
        [corners.top, corners.right],
      ];
    }
    // right boundry
    if (corners.right < max_size_y) {
      boundries.right = [
        [corners.top, corners.right],
        [corners.bottom, corners.right],
      ];
    }
    // bottom boundry
    if (corners.bottom < max_size_x) {
      boundries.bottom = [
        [corners.bottom, corners.left],
        [corners.bottom, corners.right],
      ];
    }
    // left boundry
    if (corners.left > 0) {
      boundries.left = [
        [corners.top, corners.left],
        [corners.bottom, corners.left],
      ];
    }

    return { corners, boundries };
  }

  // check if the layour is valid
  // is not valid in case any box is overlaping another.
  checkIsValidCorners(corners) {
    let box = [];
    Object.keys(corners).forEach((box_type) => {
      box.push(corners[box_type]);
    });

    // check all the boxes are not overlaping the others.
    for (let i = 0; i < box.length; i++) {
      for (let j = i + 1; j < box.length; j++) {
        if (this.isOverlaping(box[i], box[j])) {
          return false;
        }
      }
    }

    return true;
  }

  isOverlaping(box1, box2) {
    // box = {top: , right: , bottom: , left: }
    // check if the boxes are overlaping
    if (box1.top >= box2.bottom || box1.bottom <= box2.top) {
      return false;
    }
    if (box1.left >= box2.right || box1.right <= box2.left) {
      return false;
    }

    return true;
  }

  handleMouseDown(e) {
    // get the mouse position
    const box_type = e.target;
    // get the box boundries
    console.log(box_type);
  }

  // listen to the resize event
  generateListeners() {
    let handlers = document.querySelectorAll(".resize-bar");
    console.log(handlers);
    handlers.forEach((handler) => {
      // click event on handle
      handler.addEventListener("mousedown", (e) => {
        this.handleMouseDown(e);
        console.log("mousedown");
      });
    });
  }
}

// Invalid layour
// const invalid_box = new resizeBox(
//   [
//     [0, "a", "a"],
//     [0, "b", "b"],
//     [0, "c", "b"],
//   ],
//   { width: "600px", height: "500px" }
// );
