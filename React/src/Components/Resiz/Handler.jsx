import { useControlHandler } from "./Hooks/useControlHandler.jsx";

function Handler({ handlerKey, handlerStyle }) {
  console.log("handlerKey", handlerKey);
  const { style } = useControlHandler({
    handlerStyle,
  });

  return <div className="resize-bar" style={style} />;
}

export default Handler;
