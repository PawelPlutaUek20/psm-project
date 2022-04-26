import React, { ReactNode, useState } from "react";
import compose from "lodash/fp/compose";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import { withNotifications } from "../components/withNotifications";
import { GeolocationContext } from "../components/GeolocationProvider";
import { Textarea, TextInput, Button, ColorInput } from "@mantine/core";
import { Todo } from "../types";
import { useCollection } from "@nandorojo/swr-firestore";
import dynamic from "next/dynamic";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

const Harmonogram = React.memo(() => {
  const user = useAuthUser();
  const { geolocation, setGeolocation } = React.useContext(GeolocationContext);
  const [markerPosition, setMarkerPosition] = React.useState({
    lat: geolocation.latitude,
    lng: geolocation.longitude,
  });

  const { data, add } = useCollection<Todo, any>(user.id ? "todos" : null, {
    where: ["userId", "==", user.id],
  });

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
      <Popup
        trigger={<button className="button">Location </button>}
        modal
        contentStyle={{ width: "100%" }}
      >
        {(close) => {
          return (
            <>
              <MapComponent
                geolocation={geolocation}
                markerPosition={markerPosition}
                setMarkerPosition={setMarkerPosition}
              />
              <Button fullWidth onClick={() => close()}>
                Selcet Location
              </Button>
            </>
          );
        }}
      </Popup>
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
        onClick={async () =>
          await add({
            userId: user.id!,
            title: todo.title,
            geolocation: JSON.stringify(markerPosition),
            content: todo.content,
            status: "dik",
            colour: todo.colour,
          })
        }
      >
        add task
      </Button>
      <ol>
        {data?.map((todo, index) => (
          <li key={index}>
            <h5>{todo.title}</h5>
            {todo.content}
            <p>{JSON.stringify(todo.geolocation)}</p>
          </li>
        ))}
      </ol>
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
