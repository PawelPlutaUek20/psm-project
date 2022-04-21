import React from "react";
import Link from "next/link";

import { withAuthUser, AuthAction } from "next-firebase-auth";

import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Text,
  createStyles,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";

import firebase from "../firebase/firebaseClient";

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

const Signup = () => {
  const { classes } = useStyles();
  const [state, setState] = useSetState({
    email: "",
    password: "",
  });

  const signup = () =>
    firebase
      .auth()
      .createUserWithEmailAndPassword(state.email, state.password)
      .catch((e) => console.log(e));

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
          Welcome to Mantine!
        </Title>

        <TextInput
          value={state.email}
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
          onChange={(e) => {
            setState({ email: e.target.value });
          }}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          onChange={(e) => {
            setState({ password: e.target.value });
          }}
        />
        <Button fullWidth mt="xl" size="md" onClick={signup}>
          Register
        </Button>

        <Text align="center" mt="md">
          Already have an account?{" "}
          <Link href="/login">
            <Anchor<"a"> weight={700}>Login</Anchor>
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
})(Signup);
