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
import { sample } from "lodash";

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
        onClick={() =>
          console.log({
            userId: user.id!,
            title: sample([
              "Go for a walk",
              "Listen to music",
              "Take photographs",
              "Read a newspaper or magazine",
              "Take a bath",
              "Sit in the sun",
              "Watch a movie",
              "Laugh",
              "Write in a journal",
              "Work on a puzzle",
              "Recall a happy memory",
              "Coloring",
              "Gardening",
              "Spend time with friends",
              "Do yoga",
              "Swimming",
              "Singing",
              "Dancing",
              "Go to a flea market",
              "Drawing or doodling",
              "Painting",
              "Buy fresh flowers",
              "Join a book club",
              "Go to a farmer’s market",
              "Be affectionate with a loved one",
              "Play a musical instrument",
              "Crafting (crochet, model building)",
              "Get a manicure or pedicure",
              "Cooking",
              "Jogging or running",
              "Play a sport",
              "Go sightseeing in your own town",
              "Read a book",
              "Meditate",
              "Watch a sunrise or sunset",
              "Enjoy a cup of tea",
              "Have a picnic",
              "Visit a museum",
              "Sudoku or a crossword puzzle",
              "Play a board game",
              "Look at old photos",
              "Light a scented candle",
              "Call a friend or family member",
              "Hiking",
              "Get a massage",
              "Volunteer",
              "Go to the library",
              "Go to a park",
              "Stargazing",
              "Explore somewhere new",
            ])!,
            geolocation: "0,0",
            content: sample([
              "You could say it that way as an announcement to your family as you leave the house",
              "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies ",
              "relating to, having, or being elements or events with definite probability of occurrence",
              "Mahadevan was born in Madras in 1957 and moved to Mangalore in 1959. He discovered his ability to memorize numbers at the age of 5 during a party hosted by his family. During the party, Rajan wandered to a parking lot and committed the license plate numbers of every guest's car for recitation later",
              "Brajnovac (Serbian Cyrillic: Брајновац) is a village in Central Serbia (Šumadija), in the municipality of Rekovac (Region of Levač), located at 43°46′49″N 21°07′45″E, at an elevation of 270 metres (890 ft). According to the 2002 census, the village had 221 citizens. ",
              "The Pointe de Boveire is a mountain of the Pennine Alps, located between Fionnay and Liddes in the canton of Valais. It lies north of the Petit Combin, in the Grand Combin massif. ",
              "Harry Walter Mosby (3 May 1945 – 17 November 1993), also known as Harry Moseby, is an Australian Paralympic athlete from the Torres Strait. At the 1976 Toronto Games, he won a silver medal in the Men's Discus 1C event and finished fourth in the Men's Javelin C1, fifth in the Men's Shot Put C1 and twelfth in the Men's Precision Javelin C1",
              "Chris Polk (born December 16, 1989) is a former American football running back. He played college football for the Washington Huskies. ",
              "The Elder Grey Meetinghouse is a historic church on Chadbourne Ridge Road in North Waterboro, Maine. Built in 1806, it is one of Maine's oldest churches. ",
              "Agelescape is a genus of funnel weavers first described by G. Levy in 1996",
              "Linda Tsungirirai Masarira is a Zimbabwean politician who served as a spokesperson for one of the biggest opposition parties in Zimbabwe, MDC-T led by Thokozani Khupe.",
              "Umm Al Afaei (Arabic: ام الافاعي) is a rural district in Qatar, located in the municipality of Al Rayyan.",
              "The 2012 Black-Eyed Susan Stakes was the 88th running of the Black-Eyed Susan Stakes. The race took place in Baltimore, Maryland on May 18, 2012,",
              "Monopis dorsistrigella, the skunkback monopi, is a species of clothes moth in the family Tineidae.",
              "Magpie Records is a British record label set up in 1976 by Bruce Bastin. It was owned by Interstate Music. It specialises in re-issuing pre and post war blues and jazz recordings. ",
            ])!,
            status: "dik",
            colour: sample([
              "#1F85DE",
              "#360d0d",
              "#360d0d",
              "#485592",
              "#1338d6",
              "#a313d6",
              "#55156c",
              "#6c1559",
              "#ce24a9",
              "#ce2435",
              "#7a1620",
              "#acd322",
              "#637622",
              "#5fec45",
              "#378628",
              "#52f8cb",
              "#259073",
              "#0a523f",
              "#2571d6",
            ])!,
          })
        }
      >
        {" "}
        Add random task
      </Button>
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
