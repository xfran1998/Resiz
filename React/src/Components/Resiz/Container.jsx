import { useEffect, useState } from "react";

function Container({idContainer, boxes, height_boxes, width_boxes, background}){
  const [height, setHeight] = useState(height_boxes);
  const [width, setWidth] = useState(width_boxes);
  const [top, setTop] = useState(boxes.top * height_boxes);
  const [left, setLeft] = useState(boxes.left * width_boxes);
  const [id, setId] = useState(idContainer);

  

  const [test, setTest] = useState("test");
  useEffect(() => {
    console.log(idContainer);
  }, []);

  return (
    <div id={idContainer} className="resize-box" style={useControlContainer.getStyle}>
      <h1>Res: {idContainer}</h1>
    </div>
  );
}

export default Container;

