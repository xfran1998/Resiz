import { useEffect } from "react";
import Container from "./Container";
import Handler from "./Handler";
import { useLayout } from "./Hooks/useLayout";

function Resiz({ layout, options = {} }) {
  const { initLayout } = useLayout(layout, options);

  useEffect(() => {
    initLayout();
  }, []);

  return (
    <>
      {/* <h1>Resize!!!</h1> */}
      <Container
        idContainer={"Raul Manco"}
        boxes={{ top: 1, left: 0, right: 1, bottom: 1 }}
        height_boxes={200}
        width_boxes={200}
        background={"#ddd"}
      />
      <Handler />
    </>
  );
}

export default Resiz;
