import React, { useState } from "react";
import "./SignIn.css";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useStore } from "../useStore";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [current, setCurrent] = useState(true);
  const { setUser, setUserData } = useStore();
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async () => {
    let error = false;

    if (firstName.length < 1) {
      setFirstNameError("Invalid First Name Length");
      error = true;
    }

    if (lastName.length < 1) {
      setLastNameError("Invalid Last Name Length");
      error = true;
    }

    const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(emailRegEx)) {
      setEmailError("Invalid Email!");
      error = true;
    }

    if (password.length < 8) {
      setPasswordError("Password must be atleast characters!");
      error = true;
    }

    if (error) return;

    const user = await createUserWithEmailAndPassword(auth, email, password);

    setUser(user.user);
    await setDoc(doc(db, "users", user.user.uid), {
      firstName: firstName,
      lastName: lastName,
      group: "",
      email: email,
      isAdmin: false,
    });
    handleSignIn();
  };

  const handleSignIn = async () => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    setUser(user.user);
    localStorage.setItem("user", JSON.stringify(user.user));
    const userData = (await getDoc(doc(db, "users", user.user.uid))).data();
    setUserData(userData);
    navigate("/home");
  };

  return (
    <div className="SignIn">
      {current ? (
        <div>
          <Row className="g-2">
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="First Name">
                <Form.Control
                  type="text"
                  placeholder="name@example.com"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <p className="SignInError">{firstNameError}</p>
              </FloatingLabel>
            </Col>
            <Col md>
              <FloatingLabel controlId="floatingInputGrid" label="Last Name">
                <Form.Control
                  type="text"
                  placeholder="name@example.com"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </FloatingLabel>
              <p className="SignInError">{lastNameError}</p>
            </Col>
          </Row>
        </div>
      ) : (
        <></>
      )}
      <div>
        <Row className="g-1">
          <FloatingLabel controlId="floatingInputGrid" label="Email">
            <Form.Control
              type="text"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>
          <p className="SignInError">{emailError}</p>
          <FloatingLabel controlId="floatingInputGrid" label="Password">
            <Form.Control
              type="password"
              placeholder="name@example.com"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
          <p className="SignInError">{passwordError}</p>
        </Row>
      </div>

      <Button
        variant="primary"
        onClick={() => {
          current ? handleSignUp() : handleSignIn();
        }}
      >
        {current ? "Sign Up" : "Sign In"}
      </Button>

      <p>{current ? `Already have an account?` : `Don't have an account?`}</p>
      <Button variant="primary" onClick={() => setCurrent(!current)}>
        {current ? "Sign in" : `Sign up`}
      </Button>
    </div>
  );
}

export default SignIn;
