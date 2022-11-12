import { useEffect, useState } from "react";

const useContainer = ({ idContainer, background, ...rest }) => {
  const [style, setStyle] = useState({
    height: rest.style.height + "px",
    width: rest.style.width + "px",
    background: background,
    zIndex: 1,
    position: "absolute",
    top: rest.style.top + "px",
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
