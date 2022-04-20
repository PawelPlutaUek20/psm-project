import React from "react";
import Head from "next/head";
import Link from "next/link";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { Button, Col, Container, Row } from "react-bootstrap";
import { withAuthUser, AuthAction } from "next-firebase-auth";

const Auth = () => {
  const auth = getAuth();
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  };

  const login = () =>
    signInWithEmailAndPassword(auth, form.email, form.password).catch((e) =>
      console.log(e)
    );

  return (
    <Container className="md-container d-flex align-items-center justify-content-center vh-100">


      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <form>
              <p className="h4 text-center mb-4">Sign in</p>
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
                <Button className="w-100" color="indigo" onClick={login}>
                  Login
                </Button>
              </div>
              <div className="text-center mt-4">
                Dont have an account? <Link href="/signup">Register</Link>
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
