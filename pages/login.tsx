import React from "react";
import Link from "next/link";

import includes from "lodash/includes";
import { withAuthUser, AuthAction } from "next-firebase-auth";

import { useSetState } from "@mantine/hooks";
import {
  createStyles,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Text,
  Divider,
  ButtonProps,
} from "@mantine/core";

import firebase from "../firebase/firebaseClient";

const Login = () => {
  const { classes } = useStyles();

  const [state, setState] = useSetState<{
    email: string;
    password: string;
    errors: {
      email?: string;
      password?: string;
    };
  }>({
    email: "",
    password: "",
    errors: {},
  });

  const signIn = () =>
    firebase
      .auth()
      .signInWithEmailAndPassword(state.email, state.password)
      .catch((e) => {
        console.log(e)
        if (includes(e.code, "password")) {
          setState({ errors: { password: e.message } });
        } else if (includes(e.code, "email")) {
          setState({ errors: { email: e.message } });
        }
      });

  const signInWithGoogle = () =>
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());

  const signInWithGoogle = () =>
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Sign in to your account
        </Title>

        <TextInput
          value={state.email}
          label="Email address"
          error={state.errors.email}
          placeholder="hello@gmail.com"
          size="md"
          onChange={(e) => {
            setState({ email: e.target.value });
          }}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          error={state.errors.password}
          mt="md"
          size="md"
          onChange={(e) => {
            setState({ password: e.target.value });
          }}
        />
        <Button fullWidth mt="xl" size="md" onClick={signIn}>
          Sign in
        </Button>
        <Divider label="Or" labelPosition="center" my="lg" />
        <GoogleButton fullWidth mt="xs" size="md" onClick={signInWithGoogle}>
          Sign in with Google
        </GoogleButton>
        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Link href="/signup" passHref>
            <Anchor<"a"> weight={700}>Sign up</Anchor>
          </Link>
        </Text>
      </Paper>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Login);

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: "100vh",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    height: "100vh",
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

function GoogleIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 262"
      width={14}
      height={14}
      {...props}
    >
      <path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
      />
      <path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
}

function GoogleButton(props: ButtonProps<"button">) {
  return (
    <Button
      leftIcon={<GoogleIcon />}
      variant="default"
      color="gray"
      {...props}
    />
  );
}
