import React from "react";
import dynamic from "next/dynamic";

import compose from "lodash/fp/compose";
import { AuthAction, withAuthUser } from "next-firebase-auth";

import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";

const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

const Map = React.memo(() => {
  const geolocation = React.useContext(GeolocationContext);

  return <MapComponent geolocation={geolocation} />;
});

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Map);
