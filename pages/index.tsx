import React, { useState } from "react";
import Link from "next/link";
import { Todo } from "../types";
import compose from "lodash/fp/compose";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { useCollection } from "@nandorojo/swr-firestore";
import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";

import { Text, Grid, Card, Button, SegmentedControl } from "@mantine/core";
import { GrillOff } from "tabler-icons-react";

const Home: React.FC = () => {
  const user = useAuthUser();
  const { geolocation, setGeolocation } = React.useContext(GeolocationContext);

  const { data } = useCollection<Todo>(user.id ? "todos" : null, {
    where: ["userId", "==", user.id],
  });

  const task = data?.length === 1 ? "task" : "tasks";
  const [value, setValue] = useState("all");
  const [searchInput, setSearchInput] = useState("");

  console.log(searchInput);

  let filteredData =
    value !== "all"
      ? data?.filter((todo) => {
          return todo.status === value;
        })
      : data;

  let searchedFilteredData = filteredData?.filter((todo) => {
    if (searchInput !== "") {
      return todo.title.toLowerCase().includes(searchInput.toLowerCase());
    }
    return todo;
  });

  <>
    {/* <button onClick={() => alert(JSON.stringify(geolocation))}>
      my location
    </button> */}

    {/* <Link href="/map" passHref>
      <a>
        <button>Map</button>
      </a>
    </Link> */}
  </>;

  return (
    <Grid>
      <Grid.Col
        span={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        <Text weight={600} size="xl">
          You have {data?.length} {task} this month
        </Text>
      </Grid.Col>
      <Grid.Col
        span={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for tasks.."
          style={{
            backgroundImage:
              "url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vector_search_icon.svg/800px-Vector_search_icon.svg.png",
            backgroundSize: "15px 15px",
            backgroundPosition: "10px 12px",
            backgroundRepeat: "no-repeat",
            width: "80%",
            padding: "12px 20px 12px 40px",
            border: "5px solid #ddd",
          }}
        />
      </Grid.Col>
      <Grid.Col
        span={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <SegmentedControl
          size="md"
          color="green"
          value={value}
          onChange={setValue}
          data={[
            { label: "All", value: "all" },
            { label: "To-Do", value: "To-Do" },
            { label: "In Progress", value: "In Progress" },
            { label: "Done", value: "Done" },
          ]}
        />
      </Grid.Col>
      <Grid.Col
        span={4}
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "left",
          paddingLeft: "10%",
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        <Text weight={600} size="xl">
          Today&apos;s Tasks
        </Text>
      </Grid.Col>
      <Grid.Col
        span={4}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        <Button
          color="green"
          onClick={() =>
            setGeolocation({
              latitude: 50.0686,
              longitude: 19.9551,
            })
          }
        >
          Get Notified
        </Button>
      </Grid.Col>
      <Grid.Col
        span={3}
        style={{
          display: "flex",
          justifyContent: "right",
          alignItems: "right",
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        <Button<typeof Link> component={Link} href="/harmonogram">
          {" "}
          See All
        </Button>
      </Grid.Col>
      <Grid.Col
        span={11}
        style={{
          justifyContent: "left",
          alignItems: "left",
          paddingLeft: "10%",
        }}
      >
        {data ? (
          searchedFilteredData?.map((todo) => (
            <Card
              key={todo.id}
              shadow="sm"
              p="lg"
              sx={{ backgroundColor: todo.color }}
              withBorder
              radius="lg"
              mb="md"
            >
              <Text weight={600} mb={4}>
                {todo.title}
              </Text>
              <Text color="gray" mb={4}>
                {todo.description}
              </Text>
            </Card>
          ))
        ) : (
          <Card
            shadow="sm"
            p="lg"
            sx={{ backgroundColor: "gray" }}
            withBorder
            radius="lg"
            mb="md"
          >
            {" "}
            <Text weight={600} mb={4}>
              No tasks to show
            </Text>
          </Card>
        )}
      </Grid.Col>
      <Grid.Col
        span={11}
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "10%",
        }}
      >
        <Button color="green" onClick={() => user.signOut()}>
          Sign Out
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Home);
