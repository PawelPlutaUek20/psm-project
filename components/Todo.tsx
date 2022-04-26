import React from "react";
import dynamic from "next/dynamic";

import { MapPin, Clock } from "tabler-icons-react";
import {
  Card,
  Divider,
  Text,
  Modal,
  TextInput,
  InputWrapper,
  useMantineTheme,
  ColorPicker,
  Group,
  Button,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { DatePicker } from "@mantine/dates";

import { Todo } from "../types";

type Props = {
  todo: Todo;
};

const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

export const TodoComponent: React.FC<Props> = React.memo(({ todo }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = React.useState(false);
  const [state, setState] = useSetState(todo);

  console.log(state);

  const swatches = Object.keys(theme.colors).map(
    (color) => theme.colors[color][2]
  );

  return (
    <>
      <Card
        onClick={() => setOpened(true)}
        sx={{ backgroundColor: todo.color }}
        withBorder
        p="md"
        radius="lg"
      >
        <Text weight={600} mb={4}>
          {todo.title}
        </Text>

        <Text color="gray" mb={4}>
          {todo.description}
        </Text>
        <div
          style={{
            display: "flex",
            gap: 4,
            alignItems: "flex-start",
            marginTop: 8,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <MapPin color="blue" />
          </div>
          <Text color="blue">{todo.locationName}</Text>
        </div>
        <Divider color="gray" my="sm" />
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Clock width={20} height={20} />
          <Text>
            {new Date(todo.start.seconds * 1000).toDateString()} -{" "}
            {new Date(todo.end.seconds * 1000).toDateString()}
          </Text>
        </div>
      </Card>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Edit your task"
        size="100%"
      >
        <TextInput
          label="Title"
          placeholder="your@email.com"
          value={state.title}
          onChange={(e) => setState({ title: e.target.value })}
          mb={"xs"}
        />
        <TextInput
          mb={"xs"}
          label="Description"
          placeholder="your@email.com"
          value={state.description}
          onChange={(e) => setState({ title: e.target.value })}
        />
        <Group grow mb="xs">
          <DatePicker
            value={new Date(state.start.seconds * 1000)}
            onChange={(start) =>
              setState({
                start: { seconds: start!.getTime() / 1000, nanoseconds: 0 },
              })
            }
            placeholder="Pick date"
            label="Starts"
          />
          <DatePicker
            value={new Date(state.end.seconds * 1000)}
            onChange={(end) =>
              setState({
                end: { seconds: end!.getTime() / 1000, nanoseconds: 0 },
              })
            }
            placeholder="Pick date"
            label="Ends"
          />
        </Group>
        <TextInput
          mb="xs"
          label="Location name"
          placeholder="your@email.com"
          value={state.locationName}
          onChange={(e) => setState({ locationName: e.target.value })}
        />
        <InputWrapper mb="xs" label="Location">
          <MapComponent
            geolocation={state.geolocation}
            markerPosition={{
              lat: state.geolocation.latitude,
              lng: state.geolocation.longitude,
            }}
            setMarkerPosition={async ({ lat, lng }) => {
              setState({ geolocation: { latitude: lat, longitude: lng } });
            }}
          />
        </InputWrapper>
        <InputWrapper mb="xs" label="Color">
          <ColorPicker
            sx={{ width: "100%" }}
            format="hex"
            value={state.color}
            onChange={(color) => setState({ color })}
            swatches={swatches}
          />
        </InputWrapper>
        <Group mt="xs" position="right">
          <Button onClick={() => console.log(state)}>Edit task</Button>
        </Group>
      </Modal>
    </>
  );
});
