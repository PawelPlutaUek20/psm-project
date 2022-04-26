import React from "react";
import Link from "next/link";

import compose from "lodash/fp/compose";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import { Todos } from "../components/Todos";
import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";

const Home: React.FC = () => {
  const user = useAuthUser();
  const { geolocation, setGeolocation } = React.useContext(GeolocationContext);
  
  return (
    <>
      <button onClick={() => alert(JSON.stringify(geolocation))}>
        my location
      </button>
      <button onClick={() => user.signOut()}>sign out</button>
      <Link href="/harmonogram" passHref>
        <a>
        <button>Harmonogram</button>
        </a>
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
      <Todos userId={user.id} />
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
