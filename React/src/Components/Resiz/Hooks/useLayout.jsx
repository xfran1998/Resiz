import { useEffect, useState } from "react";

const useLayout = (layout, options) => {
  const [minHeight, setMinHeightContainer] = useState(options.minHeight || 50);
  const [minWidth, setMinWidthcontainer] = useState(options.minWidth || 50);
  const [containers, setContainers] = useState([]);
  const [size, setSize] = useState({
    width: options.width || "100%",
    height: options.height || "100%",
  });
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
  });
  const [deltaPosMouse, setDeltaPosMouse] = useState({
    x: 0,
    y: 0,
  });
  const [resizable_boxes, setResizableBoxes] = useState([]);
  const [resizable_bar_x, setResizableBarX] = useState([]); // horizontal bar
  const [resizable_bar_y, setResizableBarY] = useState([]); // vertical bar
  const [dirDrag, setDirDrag] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingBar, setDraggingBar] = useState(null);

  const [boxes, setBoxes] = useState(null);
  const [handlers, setHandlers] = useState(null);

  const createLayout = (layout) => {
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
    const _boxes = {};
    const _handle = {
      xAxis: [], // horizontal bar  --> yAxis: [{ boundrie: [[1,1],[1,3]], containers: [{id=0, side:'bottom'}, {id='a', side:'top'}, {id='b', side:'top'}] }]
      yAxis: [], // vertical bar    --> xAxis: [{ boundrie: [[1,1],[3,1]], containers: [{id=0, side:'right'}, {id='a', side:'left'}, {id='b', side:'left'}] }]
    };
    let main_axis_x = layout.length;
    let main_axis_y = layout[0].length;

    // Get different _boxes from the layout.
    for (let i = 0; i < main_axis_x; i++) {
      for (let j = 0; j < main_axis_y; j++) {
        const box_type = layout[i][j];

        if (!_boxes[box_type]) {
          _boxes[box_type] = [];
        }
        _boxes[box_type].push([i, j]);
      }
    }

    // create handlers for the _boxes.
    Object.keys(_boxes).forEach((box_type) => {
      const box = _boxes[box_type];
      const boundries = getBoundries(box, main_axis_x, main_axis_y);

      _boxes[box_type] = boundries.corners;

      Object.keys(boundries.boundries).forEach((key) => {
        if (boundries.boundries[key] && boundries.boundries[key].length > 0) {
          setHandler(_handle, boundries.boundries[key], box_type, key); // method to create the handlers.
        }
      });
    });

    // this._boxes = _boxes;
    // this.handle = handle;
    console.log("_boxes", _boxes);
    console.log("handle", _handle);
    // setBoxes(_boxes);
    // setHandlers(handle); // useState to save the handlers.

    return { _boxes, _handle };
  };

  const getBoundries = (_boxes, max_size_x, max_size_y) => {
    let boundries = {
      top: null,
      right: null,
      bottom: null,
      left: null,
    };

    // get corners of the box array
    // initializate the corners with the first box.
    const corners = {
      top: _boxes[0][0],
      right: _boxes[0][1],
      bottom: _boxes[0][0],
      left: _boxes[0][1],
    };
    _boxes.forEach((box) => {
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
  };

  const setHandler = (handlers, boundrie, box_type, side) => {
    // check if the boundrie is in the x axis. of 2 points
    const axis = isXAxis(boundrie) ? "xAxis" : "yAxis";

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

    // swap side --> container are in the opposite side of the handler.
    if (side == "top") side = "bottom";
    else if (side == "bottom") side = "top";
    else if (side == "left") side = "right";
    else if (side == "right") side = "left";

    if (handler) {
      // add container to the handler.
      handler.containers.push({ id: box_type, side: side });
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
      containedBy.containers.push({ id: box_type, side: side });
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
      containers: [{ id: box_type, side: side }, ...containers],
    });
  };

  const isXAxis = (boundrie) => {
    return boundrie[0][0] === boundrie[1][0]; // check if the boundrie is in the x axis. of 2 points
  };

  const checkIsValidCorners = (corners) => {
    let box = [];
    Object.keys(corners).forEach((box_type) => {
      box.push(corners[box_type]);
    });

    // check all the boxes are not overlaping the others.
    for (let i = 0; i < box.length; i++) {
      for (let j = i + 1; j < box.length; j++) {
        if (isOverlaping(box[i], box[j])) {
          return false;
        }
      }
    }

    return true;
  };

  const isOverlaping = (box1, box2) => {
    // box = {top: , right: , bottom: , left: }
    // check if the boxes are overlaping
    if (box1.top >= box2.bottom || box1.bottom <= box2.top) {
      return false;
    }
    if (box1.left >= box2.right || box1.right <= box2.left) {
      return false;
    }

    return true;
  };

  const joinHandlers = (_handle) => {
    // join the handlers on the same axis value
    console.log("joinHandlers1", _handle);

    // aux function
    const join = (
      minCoord1,
      minCoord2,
      maxCoord1,
      maxCoord2,
      axis,
      isXAxis,
      i,
      j
    ) => {
      // get min row and max row
      let min_row = Math.min(minCoord1, minCoord2);
      let max_row = Math.max(maxCoord1, maxCoord2);

      // set the new boundrie
      const min_y = isXAxis ? 1 : 0;
      const max_y = isXAxis ? 1 : 0;

      axis[i].boundrie[0][min_y] = min_row;
      axis[i].boundrie[1][max_y] = max_row;

      // get all the containers that are in both handlers
      axis[i].containers = axis[i].containers.concat(axis[j].containers);

      // remove the handler
      axis.splice(j, 1);
    };

    const y_axis = _handle.yAxis;
    for (let i = 0; i < y_axis.length; i++) {
      for (let j = i + 1; j < y_axis.length; j++) {
        if (y_axis[i].boundrie[0][1] === y_axis[j].boundrie[0][1]) {
          join(
            y_axis[i].boundrie[0][0],
            y_axis[j].boundrie[0][0],
            y_axis[i].boundrie[1][0],
            y_axis[j].boundrie[1][0],
            y_axis,
            false,
            i,
            j
          );

          j--; // decrement j to avoid skipping an element
        }
      }
    }

    const x_axis = _handle.xAxis;
    for (let i = 0; i < x_axis.length; i++) {
      for (let j = i + 1; j < x_axis.length; j++) {
        if (x_axis[i].boundrie[0][0] === x_axis[j].boundrie[0][0]) {
          join(
            x_axis[i].boundrie[0][1],
            x_axis[j].boundrie[0][1],
            x_axis[i].boundrie[1][1],
            x_axis[j].boundrie[1][1],
            x_axis,
            true,
            i,
            j
          );

          j--; // to avoid skipping the next element
        }
      }
    }

    console.log("joinHandlers2", _handle);
  };

  const initLayout = () => {
    console.log("initLayout");
    // console.log(layout);
    // console.log(options);

    const { _boxes, _handle } = createLayout(layout);
    // check if the layout is valid.
    if (!checkIsValidCorners(_boxes)) throw new Error("Invalid layout");

    joinHandlers(_handle);
  };

  return {
    initLayout,
  };
};

export { useLayout };
