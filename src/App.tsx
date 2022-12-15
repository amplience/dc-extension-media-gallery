import "./App.css";
import ImageList from "@mui/material/ImageList";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import { useMediaQuery, useTheme } from "@mui/material";
import SortableListItem from "./sortable-list-item";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { GraphQLClient } from "./graphql-client";
import { ExtensionContextProvider } from "./extension-context";

const itemData = [
  {
    id: 0,
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    author: "@bkristastucchio",
  },
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    author: "@rollelflex_graphy726",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "@helloimnik",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    author: "@nolanissac",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "@hjrc33",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    author: "@tjdragotta",
  },
  {
    id: 7,
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "@katie_wasserman",
  },
  {
    id: 8,
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    author: "@silverdalex",
  },
  {
    id: 9,
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    author: "@shelleypauls",
  },
  {
    id: 10,
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    author: "@peterlaster",
  },
  {
    id: 11,
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    author: "@southside_customs",
  },
];

function TitlebarBelowImageList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const isXLarge = useMediaQuery(theme.breakpoints.down("xl"));
  let cols = 8;
  if (isXLarge) cols = 7;
  if (isLarge) cols = 5;
  if (isLarge) cols = 5;
  if (isTablet) cols = 3;
  if (isMobile) cols = 2;

  const [items, setItems] = useState(itemData);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    (async () => {
      const gqlTest = new GraphQLClient('https://auth.amplience.net/oauth/token', 'https://api.amplience.net/graphql');

      // absolutely do not push client credentials!
      
      await gqlTest.auth('clientid', 'secret');

      const result = await gqlTest.fetch(`
        { 
          assetSearch(
            keyword: "*"
            first: 100
            filters: { createdDate: "2022-01-01T00:00:00.000Z TO NOW" }
            sort: { createdDate: DESC }
          ) {
            total
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `);

      console.log(result)
    })();
  })

  const dragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <ExtensionContextProvider>
      <ImageList sx={{ width: "100%" }} cols={cols} gap={8}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={dragEnd}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            {items.map((item) => (
              <SortableListItem key={item.img} id={item.id}>
                <img
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.title}
                  subtitle={<span>by: {item.author}</span>}
                  position="below"
                  actionIcon={
                    <IconButton
                      sx={{ color: "white" }}
                      aria-label={`select ${item.title}`}
                    >
                      <CheckBoxOutlineBlank />
                    </IconButton>
                  }
                  actionPosition="left"
                />
              </SortableListItem>
            ))}
          </SortableContext>
        </DndContext>
      </ImageList>
    </ExtensionContextProvider>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TitlebarBelowImageList />
      </header>
    </div>
  );
}

export default App;
