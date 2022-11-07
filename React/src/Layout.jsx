import { createElement, useEffect, useState } from "react";
// import ResizeBox from "./assets/resiz";
import { cloneElement } from "react";
import ResizeBox from "./Components/Resiz/Resiz";

function Layout({layout, options={}}) {
  const [containers, setContainers] = useState([]);
  
  const initLayout = () => {

  }

  useEffect(() => {
    console.log(layout);
    console.log(options);
  });

  return (
    <div id="test">
      <ResizeBox />
    </div>
  );
}

export default Layout;
