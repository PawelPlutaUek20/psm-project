import React from "react";
import Link from "next/link";

import compose from "lodash/fp/compose";
import { useCollection } from "@nandorojo/swr-firestore";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";
import { Todo } from "../types";

const Home: React.FC = () => {
  const user = useAuthUser();
  const { geolocation, setGeolocation } = React.useContext(GeolocationContext);

  const { data, add } = useCollection<Todo>(user.id ? "todos" : null, {
    where: ["userId", "==", user.id],
  });
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
      <Link href="/harmonogram">
        <button>harmonogram</button>
      </Link>
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

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Home);
