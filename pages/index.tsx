import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import compose from "lodash/fp/compose";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

import { getUserTodos } from "./api/todos";

import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";
import { Todo } from "../types";

type Props = {
  todos: Todo[];
};

const Home: React.FC<Props> = ({ todos }) => {
  const router = useRouter();
  const user = useAuthUser();
  const geolocation = React.useContext(GeolocationContext);

  const refreshData = () => {
    router.replace(router.asPath);
  };
  return (
    <>
      <button onClick={() => alert(JSON.stringify(geolocation))}>
        my location
      </button>
      <button onClick={() => user.signOut()}>sign out</button>
      <Link href="/map">
        <button>map</button>
      </Link>
      <button
        onClick={() =>
          fetch("api/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              title: (Math.random() + 1).toString(36).substring(7),
            }),
          }).then(() => refreshData())
        }
      >
        add random todo
      </button>
      <ol>
        {todos.map((todo, index) => (
          <li key={index}>{todo.title}</li>
        ))}
      </ol>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const todos = AuthUser.id && (await getUserTodos(AuthUser.id));
  return {
    props: {
      todos,
    },
  };
});

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Home);
