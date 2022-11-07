import { useEffect } from 'react';
import Container from './Container';
import Handler from './Handler';

function Resiz(){
  useEffect(() => {
    console.log("Resiz");
  }, []);

  return (
    <>
      {/* <h1>Resize!!!</h1> */}
      <Container idContainer={"Cont_test"} boxes={{top:1, left:0, right: 1, bottom:1}} height_boxes={100} width_boxes={100} background={"#ddd"}/>
      <Handler />
    </>
  );
}

export default Resiz;