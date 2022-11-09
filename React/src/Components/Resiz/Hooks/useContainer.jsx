import { useEffect, useState } from "react";

const useContainer = ({
  idContainer,
  background,
  ...rest
}) => {
  console.log('rest: ', rest);
  const size = { 
    height: rest.height_boxes * (rest.boxes.bottom - rest.boxes.top), 
    width: rest.width_boxes * (rest.boxes.right - rest.boxes.left), 
    top: rest.boxes.top, 
    left: rest.boxes.left 
  };
  console.log('size: ', size);
  
  const [style, setStyle] = useState({
    height: size.height,
    width: size.width,
    background: background,
    zIndex: 1,
    position: "absolute",
    top: size.top * size.height + "px",
    left: size.left * size.width + "px",
  });
  const [top, setTop] = useState(size.top * size.height);
  const [left, setLeft] = useState(size.left * size.width);
  const [width, setWidth] = useState(size.width);
  const [height, setHeight] = useState(size.height);

  const handleChangePos = ({}) => {};
  const handleChangeSize = ({}) => {};

  return { style };
};

export { useContainer };
