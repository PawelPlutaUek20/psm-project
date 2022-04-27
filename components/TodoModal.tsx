import React from "react";
import dynamic from "next/dynamic";

import {
  Button,
  ColorPicker,
  Group,
  InputWrapper,
  Modal,
  TextInput,
  useMantineTheme,
  NativeSelect
} from "@mantine/core";
import { CircleCheck } from 'tabler-icons-react';
import { DatePicker } from "@mantine/dates";
import { useSetState } from "@mantine/hooks";

import { Todo } from "../types";

const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

type Props = {
  action: (todo: any) => Promise<any> | null;
  actionText: string;
  todo?: Todo;
  opened: { get: boolean; set: React.Dispatch<React.SetStateAction<boolean>> };
};

const emptyTodo: Todo = {
  title: "",
  userId: "",
  geolocation: {
    latitude: 50.0686,
    longitude: 19.9551,
  },
  description: "",
  locationName: "",
  color: "#FFE8CC",
  start: {
    seconds: new Date().getTime() / 1000,
    nanoseconds: 0,
  },
  end: {
    seconds: new Date().getTime() / 1000,
    nanoseconds: 0,
  },
  status: "To-Do"
};

export const TodoModal: React.FC<Props> = ({
  todo,
  opened,
  action,
  actionText,
}) => {
  const theme = useMantineTheme();
  const [state, setState] = useSetState<Todo>(todo || emptyTodo);

  console.log(state);

  const swatches = Object.keys(theme.colors).map(
    (color) => theme.colors[color][1]
  );
  return (
    <Modal
      opened={opened.get}
      onClose={() => opened.set(false)}
      title={`${actionText} task`}
      size="100%"
    >
      <TextInput
        label="Title"
        placeholder="Meeting"
        value={state.title || undefined}
        onChange={(e) => setState({ title: e.target.value })}
        mb={"xs"}
      />
      <TextInput
        mb={"xs"}
        label="Description"
        placeholder="New project"
        value={state.description}
        onChange={(e) => setState({ description: e.target.value })}
      />
    <NativeSelect
      defaultValue={state.status}
      label="Select task status"
      rightSection={<CircleCheck size={14} color={'#40bf4f'}/>}
      required
      onChange={(event) => setState({status: event.currentTarget.value})}
      data={["To-Do", "In Progress", "Done"]}
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
        placeholder="Sightglass Coffee"
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
        <Button
          onClick={async () => {
            const { __snapshot, hasPendingWrites, exists, ...todo } = state;
            await action(todo);
            opened.set(false);
          }}
        >
          {actionText} task
        </Button>
      </Group>
    </Modal>
  );
};
