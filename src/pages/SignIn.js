import React, { useState } from "react";
import "./SignIn.css";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

function SignIn() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [current, setCurrent] = useState(true);
  return (
    <div className="SignIn">
      {current ? (
        <div>
          <Row className="g-2">
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="First Name">
                <Form.Control type="text" placeholder="name@example.com" />
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="Last Name">
                <Form.Control type="text" placeholder="name@example.com" />
              </FloatingLabel>
            </Col>
          </Row>
        </div>
      ) : (
        <></>
      )}
      <div>
        <Row className="g-1">
          <FloatingLabel controlId="floatingInputGrid" label="Email">
            <Form.Control type="text" placeholder="name@example.com" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingInputGrid" label="Password">
            <Form.Control type="password" placeholder="name@example.com" />
          </FloatingLabel>
        </Row>
      </div>

      <Button variant="primary">{current ? "Sign Up" : "Sign In"}</Button>

      <p>{current ? `Already have an account?` : `Don't have an account?`}</p>
    </div>
  );
}

export default SignIn;
