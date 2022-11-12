import { useEffect, useState } from "react";

const useContainer = ({
  idContainer,
  background,
  ...rest
}) => {
  console.log('rest: ', rest);
  // const size = { 
  //   height: rest.height_boxes * (rest.boxes.bottom - rest.boxes.top), 
  //   width: rest.width_boxes * (rest.boxes.right - rest.boxes.left), 
  //   top: rest.boxes.top, 
  //   left: rest.boxes.left 
  // }
  
  const [style, setStyle] = useState({
    height: rest.style.height + "px",
    width: rest.style.width + "px",
    background: background,
    zIndex: 1,
    position: "absolute",
    top:  rest.style.top + "px",
    left: rest.style.left + "px",
  });
  const [top, setTop] = useState(rest.style.top);
  const [left, setLeft] = useState(rest.style.left);
  const [width, setWidth] = useState(rest.style.width);
  const [height, setHeight] = useState(rest.style.height);

  const handleChangePos = ({}) => {};
  const handleChangeSize = ({}) => {};

  return { style };
};

export { useContainer };
