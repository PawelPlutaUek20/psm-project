import React from "react";

import compose from "lodash/fp/compose";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import withNotifications from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";

const Home = React.memo(() => {
  const user = useAuthUser();
  const geolocation = React.useContext(GeolocationContext);

  return (
    <>
      <button onClick={() => alert(JSON.stringify(geolocation))}>
        my location
      </button>
      <button onClick={() => user.signOut()}>sign out</button>
    </>
  );
});

Home.displayName = "Home";

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Home);
