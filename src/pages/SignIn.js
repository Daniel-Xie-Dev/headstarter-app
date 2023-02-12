import React, { useState } from "react";
import "./SignIn.css";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useStore } from "../useStore";
import { addDoc, collection } from "firebase/firestore/lite";

function SignIn() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [current, setCurrent] = useState(true);
  const {setUser} = useStore();

  const handleSignUp = async () => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    setUser(user.user);
    await addDoc(collection(db, "users", user.user.uid), {
      firstName : firstName,
      lastName : lastName,
    })
    
  }

  const handleSignIn = async () => {

  }


  return (
    <div className="SignIn">
      {current ? (
        <div>
          <Row className="g-2">
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="First Name">
                <Form.Control type="text" placeholder="name@example.com" onChange={(e) => setFirstName(e.target.value)}/>
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="Last Name">
                <Form.Control type="text" placeholder="name@example.com" onChange={(e) => setLastName(e.target.value)} />
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
            <Form.Control type="text" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)}/>
          </FloatingLabel>
          <FloatingLabel controlId="floatingInputGrid" label="Password">
            <Form.Control type="password" placeholder="name@example.com" onChange={(e) => setPassword(e.target.value)}/>
          </FloatingLabel>
        </Row>
      </div>
      
      <Button variant="primary" onClick={() => {current ? handleSignUp() : handleSignIn()}}>{current ? "Sign Up" : "Sign In"}</Button>

      <p>{current ? `Already have an account?` : `Don't have an account?`}</p>
      <Button variant="primary" onClick={() => setCurrent(!current)}>{current ? "Sign in" : `Sign up`}</Button>
    </div>
  );
}

export default SignIn;
