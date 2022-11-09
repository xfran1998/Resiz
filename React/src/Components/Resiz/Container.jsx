import { useEffect, useState } from "react";
import { useContainer } from "./Hooks/useContainer";

function Container({
  idContainer,
  background,
  zIndex,
  ...rest
}) {
  // const [height, setHeight] = useState(size.height);
  // const [width, setWidth] = useState(size.width);
  // const [top, setTop] = useState(size.top * size.height);
  // const [left, setLeft] = useState(size.left * size.width);
  const [id, setId] = useState(idContainer);
  const { style } = useContainer({
    idContainer,
  background,
  zIndex,
  ...rest 
  });

  useEffect(() => {
    console.log('style: ', style);
  }, []);

  return (
    <div id={idContainer} className="resize-box" style={style}>
      <h1>{idContainer}</h1>
    </div>
  );
}

export default Container;
