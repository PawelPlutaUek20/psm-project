import React from "react";
import Link from "next/link";

import { useCollection } from "@nandorojo/swr-firestore";
import compose from "lodash/fp/compose";
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

import { getTodos } from "./api/todos";

import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";
import { Todo } from "../types";

type Props = {
  todos: Todo[];
};

const Home: React.FC<Props> = ({ todos }) => {
  const user = useAuthUser();
  const { geolocation, setGeolocation } = React.useContext(GeolocationContext);

  const { data, add } = useCollection<Todo, any>(
    user.id ? "todos" : null,
    {
      where: ["userId", "==", user.id],
    },
    { initialData: todos, revalidateOnMount: true }
  );
  return (
    <>
      <button onClick={() => alert(JSON.stringify(geolocation))}>
        my location
      </button>
      <button onClick={() => user.signOut()}>sign out</button>
      <Link href="/map" passHref>
        <a>
          <button>Map</button>
        </a>
      </Link>
      <button
        onClick={async () =>
          await add({
            title: (Math.random() + 1).toString(36).substring(7),
            userId: user.id!,
          })
        }
      >
        add random todo
      </button>
      <button
        onClick={() =>
          setGeolocation({
            latitude: 50.0686,
            longitude: 19.9551,
          })
        }
      >
        get notified
      </button>
      <ol>
        {data?.map((todo, key) => (
          <li key={key}>{todo.title}</li>
        ))}
      </ol>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const todos = AuthUser.id && (await getTodos(AuthUser.id));
  return { props: { ["todos"]: todos } };
});

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Home);
