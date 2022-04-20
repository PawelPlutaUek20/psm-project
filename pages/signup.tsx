import React from "react";
import Link from "next/link";

import { Button, Col, Container, Row } from "react-bootstrap";
import { withAuthUser, AuthAction } from "next-firebase-auth";

import firebase from "../firebase/firebaseClient";

const Auth = () => {
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  };

  const signup = () =>
    firebase
      .auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .catch((e) => console.log(e));

  return (
    <Container className="md-container d-flex align-items-center justify-content-center vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <form>
              <p className="h4 text-center mb-4">Sign up</p>
              <label htmlFor="defaultFormLoginEmailEx" className="grey-text">
                Your email
              </label>
              <input
                name="email"
                type="email"
                onChange={updateForm}
                id="defaultFormLoginEmailEx"
                className="form-control"
              />
              <br />
              <label htmlFor="defaultFormLoginPasswordEx" className="grey-text">
                Your password
              </label>
              <input
                name="password"
                onChange={updateForm}
                type="password"
                id="defaultFormLoginPasswordEx"
                className="form-control"
                autoComplete="on"
              />
              <div className="text-center mt-4">
                <Button color="indigo" onClick={signup} className="w-100">
                  Register
                </Button>
              </div>
              <div className="text-center mt-4">
                Have already an account? <Link href="/login">Login here</Link>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
