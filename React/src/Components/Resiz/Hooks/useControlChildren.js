import { useState } from "react";

const useControlContainer = ({height, width, background, boxes, height_boxes, width_boxes}) => {
  const [style, setStyle] = useState({
    height: height,
    width: width,
    background: background,
    zIndex: 1,
    position: "absolute",
    top: boxes.top * height_boxes+"px",
    left: boxes.left * width_boxes+"px",
  });

  return style;
};