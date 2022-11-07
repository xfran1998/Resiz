import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function Monaco() {
  const [innerCode, setInnerCode] = useState(
    ["// some", "// comment", "// test"].join("\n")
  );

  function handleOnChange(newValue, e) {
    // console.log("onChange", e.changes);

    ApplyChanges(e.changes);
  }

  function ApplyChanges(changes) {
    // console.log("ApplyChanges", changes);

    // variable aux to apply changes
    let code = innerCode;

    // apply changes
    changes.forEach((change) => {
      code =
        code.substring(0, change.rangeOffset) +
        change.text +
        code.substring(change.rangeOffset + change.rangeLength);
    });

    // update state
    setInnerCode(code);

    console.log(code);
  }

  function handleOnMount(editor, monaco) {
    console.log("onMount", monaco);
    // get current value
    console.log(editor.getValue());
  }

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue={innerCode}
      onChange={handleOnChange}
      onMount={handleOnMount}
    />
  );
}

//const rootElement = document.getElementById("root");
export default Monaco;
