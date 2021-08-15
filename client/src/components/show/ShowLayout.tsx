import axios from "axios";
import Web3Context from "contexts/Web3Context";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Loading from "components/helpers/loading";

import hostImage from "./p1.png";
import guestImage from "./p2.png";
import bgImage from "./bg.png";

const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const BGImage = new Image();
const HostImage = new Image();
const GuestImage = new Image();
BGImage.src = bgImage;
GuestImage.src = guestImage;
HostImage.src = hostImage;

interface RouteParams {
  event_id: string;
}

const App = () => {
  const history = useHistory();
  const context = useContext(Web3Context);
  const sf = new SuperfluidSDK.Framework({
    web3: context.web3,
  });

  const superUser = sf.user({
    address: context.account,
    token: "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f", //DAIx
  });

  const { event_id } = useParams<RouteParams>();
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const [paying, isPaying] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      await sf.initialize();

      const { data } = await axios.get(`https://ipfs.io/ipfs/${event_id}`);
      const isOwner = data.host === context.account;

      console.log("is host", isOwner);
      console.log("hash iiis", event_id);
      console.log("data is", data);

      if (isOwner) {
      } else {
        console.log("superuser is", superUser);
        await superUser.flow({
          recipient: data.host,
          flowRate: "1000000000000000",
        });
      }

      setData(data);
      setIsOwner(isOwner);
      setIsLoading(false);

      setInterval(async () => {
        const guests = await fetchData(data.host);
        canvasUpdate(data, guests);
        // canvasUpdate(data, "guests");
      }, 1000);
    })();
  }, []);

  const fetchData = async (host: string) => {
    // GrapgQL
    const QUERY_URL =
      "https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-mumbai";

    const addres = host.toLowerCase();
    const query = `{
				account(id: "${addres}") {
					flowsReceived {
						flowRate
						owner{
							id
						}
					}
				}
			}
		`;

    console.log("Query was", query);
    const result = await axios.post(QUERY_URL, { query });
    const senders = result.data.data.account.flowsReceived;
    let senderAddrs = senders.filter((el: any) => el.flowRate > 0);
    senderAddrs = senderAddrs.map((el: any) => el.owner.id);
    return senderAddrs;
  };

  const cancelStream = async () => {
    await sf.initialize();

    await superUser.flow({
      recipient: data.host,
      flowRate: "0",
    });

    history.push("/");
  };

  const closeStream = async () => {
    history.push("/");
  };

  const canvasUpdate = (data: any, guests: any) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.canvas.height = document.documentElement.clientHeight;
    ctx.canvas.width = document.documentElement.clientWidth;

    ctx.drawImage(BGImage, 0, 0);
    ctx.drawImage(HostImage, 0, 0, 32, 32, 240, 195, 40, 40);
    ctx.font = "18px bold Arial";
    ctx.fillStyle = "#00ff00";
    const hostAddress = getMinAddress(data.host);
    ctx.fillText(`Host(${hostAddress})`, 200, 195);

    ctx.font = "16px ";
    ctx.fillStyle = "#a20404";

    const posX = [160, 310];
    const posY = [370, 370];
    const textPosX = [125, 280];
    const textPosY = [370, 370];
    for (let i = 0; i < guests.length; i++) {
      const element = guests[i];
      const _addrs = getMinAddress(element);
      ctx.fillText(`(${_addrs})`, textPosX[i], textPosY[i]);
      ctx.drawImage(GuestImage, 0, 0, 32, 32, posX[i], posY[i], 40, 40);
    }

    // let gAddress = getMinAddress(data.host);
    // ctx.fillText(`(${hostAddress})`, 125, 370);
    // ctx.drawImage(GuestImage, 0, 0, 32, 32, 160, 370, 40, 40);

    // gAddress = getMinAddress(data.host);
    // ctx.fillText(`(${hostAddress})`, 280, 370);
    // ctx.drawImage(GuestImage, 0, 0, 32, 32, 310, 370, 40, 40);
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div style={{ backgroundColor: "black" }}>
      <div>
        <div
          className="container"
          style={{
            height: "100vh",
            width: "60hw",
            marginLeft: "30%",
            backgroundColor: "black",
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
      <div style={{ padding: "2em 1em", position: "absolute", top: "0" }}>
        {isOwner ? null : <button onClick={cancelStream}>Cancel Stream</button>}
        {isOwner ? <button onClick={closeStream}>Close Stream</button> : null}
        <br />
        {isOwner ? <button>Toggle Mic</button> : null}
      </div>
    </div>
  );
};

export default App;

const getMinAddress = (addrs: string) => {
  return (
    addrs.substr(0, 4) +
    "..." +
    addrs.substr(addrs.length - 4, addrs.length - 1)
  );
};
