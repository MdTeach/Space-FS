import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Web3Context from "../../contexts/Web3Context";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import EventItem from "./list_item";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "100ch",
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: "inline",
    },
  })
);

export default function AlignItemsList() {
  const classes = useStyles();
  const context = useContext(Web3Context);
  const [listedEvents, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const datas = await context.eventContract?.methods.getEvents().call();
      setEvents(datas);
      console.log(datas);
    })();
  }, [0]);

  return (
    <List
      className={classes.root}
      style={{
        marginLeft: "20%",
      }}
    >
      <h1
        style={{
          padding: "0.1em",
          color: "gray",
        }}
      >
        Listed Events:
      </h1>
      {listedEvents.map((el, id) => (
        <div key={id}>
          <EventItem hash={el} />
          <Divider variant="inset" component="li" />
        </div>
      ))}

      <div style={{ padding: "1em" }}>
        <Link to="/events">
          <Button
            variant="contained"
            color="primary"
            style={{ fontSize: "1em" }}
          >
            Create Your Event
          </Button>
        </Link>
      </div>
    </List>
  );
}
