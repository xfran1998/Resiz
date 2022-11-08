import { useEffect, useState } from "react";

const useControlContainer = ({
  idContainer,
  boxes,
  height_boxes,
  width_boxes,
  background,
}) => {
  const [style, setStyle] = useState({
    height: height_boxes,
    width: width_boxes,
    background: background,
    zIndex: 1,
    position: "absolute",
    top: boxes.top * height_boxes + "px",
    left: boxes.left * width_boxes + "px",
  });

  const handleChangePos = ({}) => {};

  return { style };
};

export { useControlContainer };
