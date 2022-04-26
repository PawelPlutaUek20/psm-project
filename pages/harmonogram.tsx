import React, { ReactNode, useState } from "react";
import compose from "lodash/fp/compose";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";
import {
  Textarea,
  TextInput,
  Button,
  ColorInput,
  Modal,
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Group,
  Divider,
} from "@mantine/core";
import { Todo } from "../types";
import { useCollection } from "@nandorojo/swr-firestore";
import dynamic from "next/dynamic";
import image from "next/image";
import { createStyles, Image, Text } from "@mantine/core";
import { TodoComponent } from "../components/Todo";

const Harmonogram = React.memo(() => {
  const user = useAuthUser();
  const { geolocation, setGeolocation } = React.useContext(GeolocationContext);
  const [opened, setOpened] = useState(false);
  const [markerPosition, setMarkerPosition] = React.useState({
    lat: geolocation.latitude,
    lng: geolocation.longitude,
  });

  // const { data, add } = useCollection<Todo, any>(user.id ? "todos" : null, {
  //   where: ["userId", "==", user.id],
  // });

  const data: Todo[] = [
    {
      title: "Football",
      userId: "asdasdasd",
      geolocation: {
        latitude: 39.98230151403531,
        longitude: -3.8671875000000004,
      },
      content: "Ligue 1 opener postponed after Maselle virus cases",
      status: "asdasdasdasd",
      colour: "#f2cc94",
    },
  ];

  const [todo, setTodo] = useState({
    title: "",
    content: "",
    status: "idk",

    colour: "#e64980",
  });

  return (
    <>
      <TextInput
        placeholder="Title"
        label="Task title"
        radius="lg"
        value={todo.title}
        onChange={(event) =>
          setTodo({ ...todo, title: event.currentTarget.value })
        }
      ></TextInput>
      <Textarea
        placeholder=" Task description"
        label="Task description"
        radius="lg"
        size="md"
        value={todo.content}
        onChange={(event) =>
          setTodo({ ...todo, content: event.currentTarget.value })
        }
      />
      <div>{JSON.stringify(markerPosition)}</div>
      <Button onClick={() => setOpened(true)}>Open Modal</Button>

      <ColorInput
        sx={{ marginBottom: 200 }}
        format="hex"
        value={todo.colour}
        swatches={[
          "#25262b",
          "#868e96",
          "#fa5252",
          "#e64980",
          "#be4bdb",
          "#7950f2",
          "#4c6ef5",
          "#228be6",
          "#15aabf",
          "#12b886",
          "#40c057",
          "#82c91e",
          "#fab005",
          "#fd7e14",
        ]}
        onChange={(color) => {
          setTodo({ ...todo, colour: color });
        }}
      />

      <Button
        fullWidth
        // onClick={async () =>
        //   await add({
        //     userId: user.id!,
        //     title: todo.title,
        //     geolocation: JSON.stringify(markerPosition),
        //     content: todo.content,
        //     status: "dik",
        //     colour: todo.colour,
        //   })
        // }
      >
        add task
      </Button>
      {data?.map((todo, index) => (
        <TodoComponent todo={todo} />
      ))}
    </>
  );
});

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Harmonogram);
