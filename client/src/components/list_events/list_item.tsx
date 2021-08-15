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
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "components/helpers/loading";

import axios from "axios";

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

export default function AlignItemsList({ hash }: { hash: string }) {
  const classes = useStyles();
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`https://ipfs.io/ipfs/${hash}`);
      setData(data);
      console.log(data);

      setIsLoading(false);
    })();
  }, [0]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={`${data.name}`} src="#" />
      </ListItemAvatar>
      <ListItemText
        primary={data.name}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              className={classes.inline}
              color="textPrimary"
            >
              Price: {data.price} DAIx persecond
            </Typography>
            <br />
            <b>{data.info}</b>
            <br />
            Organizer: {data.host}
            <br />
            Time: {data.date}
            <br />
            <br />
            <Link to={`/show/${hash}`}>
              <Button variant="contained" color="primary">
                Join The Show
              </Button>
            </Link>
            <br />
            <br />
          </React.Fragment>
        }
      />
    </ListItem>
  );
}
