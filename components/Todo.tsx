import React from "react";

import { MapPin, Clock } from "tabler-icons-react";
import {
  Card,
  Divider,
  Text,
  Modal,
  Button,
  TextInput,
  Container,
  InputWrapper,
} from "@mantine/core";

import { Todo } from "../types";
import { useSetState } from "@mantine/hooks";
import dynamic from "next/dynamic";

type Props = {
  todo: Todo;
};

const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

export const TodoComponent: React.FC<Props> = ({ todo }) => {
  const [opened, setOpened] = React.useState(false);
  const [state, setState] = useSetState(todo);
  return (
    <>
      <Card
        onClick={() => setOpened(true)}
        sx={{ backgroundColor: todo.colour }}
        withBorder
        p="md"
        radius="lg"
      >
        <Text weight={600} mb={4}>
          {todo.title}
        </Text>

        <Text color="gray" mb={4}>
          {todo.content}
        </Text>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div style={{ flexShrink: 0 }}>
            <MapPin color="blue" width={20} height={20} />
          </div>
          <Text color="blue">{JSON.stringify(state.geolocation)}</Text>
        </div>
        <Divider color="gray" my="sm" />
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Clock width={20} height={20} />
          <Text>4:30 - 5:45</Text>
        </div>
      </Card>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Edit your task"
      >
        <TextInput
          label="Title"
          placeholder="your@email.com"
          value={state.title}
          onChange={(e) => setState({ title: e.target.value })}
        />
        <TextInput
          label="Description"
          placeholder="your@email.com"
          value={state.content}
          onChange={(e) => setState({ title: e.target.value })}
        />
        <InputWrapper label="Location">
          <MapComponent
            geolocation={state.geolocation}
            markerPosition={{
              lat: state.geolocation.latitude,
              lng: state.geolocation.longitude,
            }}
            setMarkerPosition={({ lat, lng }) => {
              console.log(lat, lng);
              setState({ geolocation: { latitude: lat, longitude: lng } });
            }}
          />
        </InputWrapper>
      </Modal>
    </>
  );
};
