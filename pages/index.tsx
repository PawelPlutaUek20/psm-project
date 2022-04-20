import localforage from "localforage";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import React from "react";
import { Container, Row, Card, Button } from "react-bootstrap";
import { onMessageListener } from "../firebase/messaging/initMessaging";

// const sendNotification = (fcm_token: string | null) =>
//   sleep(5000).then(() =>
//     fetch("https://fcm.googleapis.com/fcm/send", {
//       method: "POST",
//       headers: {
//         Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         notification: {
//           title: "Fireabse",
//           body: "Firebase is awesome",
//         },
//         to: fcm_token,
//       }),
//     })
//   );

const withinRadius = (
  point: { latitude: number; longitude: number },
  interest: { latitude: number; longitude: number },
  kms: number
) => {
  let R = 6371;
  let deg2rad = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

  let dLat = deg2rad(interest.latitude - point.latitude);
  let dLon = deg2rad(interest.longitude - point.longitude);

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point.latitude)) *
      Math.cos(deg2rad(interest.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.asin(Math.sqrt(a));
  let d = R * c;

  return d <= kms;
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const Home = React.memo(() => {
  const user = useAuthUser();

  onMessageListener()
    .then((payload) => {
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));

  const [currentPosition, setCurrentPosition] = React.useState<{
    latitude: number;
    longitude: number;
  }>();

  const [notified, setNotified] = React.useState<boolean>(false);

  React.useEffect(() => {
    const interval = setInterval(
      () =>
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ latitude, longitude });
        }),
      5000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (
      currentPosition &&
      !notified &&
      withinRadius(
        currentPosition,
        { latitude: 50.0671743, longitude: 20.0263019 },
        1
      )
    ) {
      setNotified(true);
      localforage
        .getItem<string>("fcm_token")
        .then((fcm_token) => alert(fcm_token));
    }
  }, [currentPosition, notified]);

  return (
    <Container className="md-container">
      <Container>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <p>
          Get started by editing <code>pages/index.js</code>
        </p>
        <Container>
          <Row className="justify-content-md-between">
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Documentation</Card.Title>
                <Card.Text>
                  Find in-depth information about Next.js features and API.
                </Card.Text>
                <Button variant="primary">More &rarr;</Button>
              </Card.Body>
            </Card>
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Learn</Card.Title>
                <Card.Text>
                  Learn about Next.js in an interactive course with quizzes!
                </Card.Text>
                <Button variant="primary" href="https://nextjs.org/learn">
                  More &rarr;
                </Button>
              </Card.Body>
            </Card>
          </Row>
          <Row className="justify-content-md-between">
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Examples</Card.Title>
                <Card.Text>
                  Discover and deploy boilerplate example Next.js projects.
                </Card.Text>
                <Button
                  variant="primary"
                  href="https://github.com/vercel/next.js/tree/canary/examples"
                >
                  More &rarr;
                </Button>
              </Card.Body>
            </Card>
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Deploy</Card.Title>
                <Card.Text>
                  Instantly deploy your Next.js site to a public URL with
                  Vercel.
                </Card.Text>
                <Button variant="primary" onClick={() => user.signOut()}>
                  More &rarr;
                </Button>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </Container>

      <footer className="cntr-footer">
        <a
          href="https://vercel.com?filter=next.js&utm_source=github&utm_medium=example&utm_campaign=next-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
        </a>
      </footer>
    </Container>
  );
});

Home.displayName = "Home";

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
