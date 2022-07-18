import React, { useReducer } from "react";
import { Container } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  return (
    <>
      <div className="text-sm-left text-md-center my-5">
        <Container>
          <h1 className="display-4">Book your Appointment</h1>
        </Container>
      </div>
    </>
  );
}

export default Header;
