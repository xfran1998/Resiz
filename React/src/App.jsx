import Monaco from "./Monaco";
import Resiz from "./Components/Resiz/Resiz";
import { useEffect } from "react";

function Test() {
  let test = "probando";

  const functTest = () => {
    test += " ahora";
  };

  functTest();
  return (
    <>
      <h1>{test}</h1>
    </>
  );
}

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
      idWrapper: "test",
      background: "#ddd",
      minHeight: 500,
      minWidth: 500,
    },
  };
  return (
    <>
      <Resiz {...resiz} />
      {/* <Test /> */}
    </>
  );
}

//const rootElement = document.getElementById("root");
export default App;
