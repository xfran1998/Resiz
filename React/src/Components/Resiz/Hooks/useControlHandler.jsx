import { useEffect, useState } from "react";

const useControlHandler = ({ handlerStyle }) => {
  console.log("handlerStyle", handlerStyle);
  // const {
  //   topStyle = top,
  //   leftStyle = left,
  //   widthStyle = width,
  //   heightStyle = height,
  //   ...restStyle
  // } = handlerStyle;
  const [top, setTop] = useState(handlerStyle.top);
  const [left, setLeft] = useState(handlerStyle.left);
  const [width, setWidth] = useState(handlerStyle.width);
  const [height, setHeight] = useState(handlerStyle.height);

  delete handlerStyle.top;
  delete handlerStyle.left;
  delete handlerStyle.width;
  delete handlerStyle.height;

  const [style, setStyle] = useState({
    top: top + "px",
    left: left + "px",
    width: width + "px",
    height: height + "px",
    ...handlerStyle,
  });

  const handleChangePos = ({}) => {};

  return { style };
};

export { useControlHandler };
