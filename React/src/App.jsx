import Monaco from "./Monaco";
import Layout from "./Layout";
import { useEffect } from "react";

function App() {
  const resiz = {
      layout: [
        ["code1", "code2"],
        ["code3", "code4"],
      ],
      options: {
        width: "600px",
        height: "500px",
        thickness: "4px",
        color: "#111",
        id_wrapper: "test",
        background: "#ddd",
      },
    };
  return (
    <>
      {/* <h1>Test</h1> */}
      {/* <Monaco /> */}
      <Layout {...resiz}/>
    </>
  );
}

//const rootElement = document.getElementById("root");
export default App;
