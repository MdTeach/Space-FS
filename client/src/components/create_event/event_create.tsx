import { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Web3Context from "../../contexts/Web3Context";
import { create } from "ipfs-http-client";

import Loading from "components/helpers/loading";
// Material UI imports
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import imageHolder from "./bg.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
  },
  media: {
    width: 250,
    height: 200,
  },
});

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

function GenerateArtLayout() {
  const classes = useStyles();
  const context = useContext(Web3Context);
  const history = useHistory();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [info, setInfo] = useState("");
  const [date, setStartDate] = useState(new Date());
  const [isUploading, setUploading] = useState(false);

  const ipfsUpload = async (info: any) => {
    const data = JSON.stringify(info);
    try {
      const { path } = await ipfs.add(data);
      return [path, null];
    } catch (error) {
      return [null, error];
    }
  };

  const hadleSumitt = async () => {
    setUploading(true);
    const data = {
      name,
      price,
      info,
      date: date.toString().slice(0, -12),
      host: context.account,
    };

    // upload to the ipfs
    const [hash, err] = await ipfsUpload(data);
    if (err) throw err;

    // upload to the contract
    const log = await context.eventContract?.methods
      .createShow(parseInt(price, 10), hash)
      .send({ from: context.account });

    console.log("log", log);
    history.push("/");
    setUploading(false);
  };

  if (isUploading) {
    return <Loading />;
  }
  return (
    <>
      <div>
        <div style={{ textAlign: "center" }}>
          <CardContent>
            <Typography gutterBottom variant="h4" component="h4">
              <h3>Host Your Event</h3>
            </Typography>
          </CardContent>
          <Card className={classes.root} style={{ marginLeft: "40%" }}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={imageHolder}
                title="Image"
              />
            </CardActionArea>
            <CardContent>
              <TextField
                id="outlined-basic"
                label="Event Name"
                variant="outlined"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
            </CardContent>
            <CardContent>
              <TextField
                id="outlined-basic"
                label="Event Price"
                variant="outlined"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                value={price}
              />
            </CardContent>
            <CardContent>
              <TextField
                id="outlined-basic"
                label="Event Info"
                variant="outlined"
                onChange={(e) => {
                  setInfo(e.target.value);
                }}
                value={info}
              />
            </CardContent>
            <CardContent>
              <p>Pick Date & Time</p>
              <DatePicker
                selected={date}
                showTimeSelect
                onChange={(_date: any) => setStartDate(_date)}
              />
            </CardContent>
            <CardActions>
              <Button size="large" color="primary" onClick={hadleSumitt}>
                Create Event
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    </>
  );
}

export default GenerateArtLayout;
