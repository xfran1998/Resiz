import { createElement, useEffect, useState } from "react";
// import ResizeBox from "./assets/resiz";
import ResizeBox from "./Resiz";

function Layout() {
  const [containers, setContainers] = useState([]);

  return (
    <div id="test">
      <ResizeBox />
    </div>
  );
}

export default Layout;
