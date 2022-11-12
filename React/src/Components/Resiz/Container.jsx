import { useEffect, useState } from "react";
import { useContainer } from "./Hooks/useContainer";

function Container({ idContainer, background, zIndex, ...rest }) {
  console.log("rest: ", rest);
  const [height, setHeight] = useState(rest.height);
  const [width, setWidth] = useState(rest.width);
  const [top, setTop] = useState(rest.top * rest.height);
  const [left, setLeft] = useState(rest.left * rest.width);
  const [id, setId] = useState(idContainer);
  const { style } = useContainer({
    idContainer,
    background,
    zIndex,
    ...rest,
  });

  useEffect(() => {
    console.log("style: ", style);
  }, []);

  return (
    <div
      id={idContainer}
      className="resize-box"
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>{idContainer}</h1>
    </div>
  );
}

export default Container;
