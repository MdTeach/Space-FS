import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import { Contract } from "web3-eth-contract";
import Web3Context from "contexts/Web3Context";
import { AbiItem } from "web3-utils";
import useWeb3 from "hooks/web3";
import EventContractJSON from "artifacts/contracts/Event.sol/Event.json";
import TokenContractJSON from "artifacts/contracts/Event.sol/Event.json";

// components
import MetaMaskMissing from "use_wallet/provider_error";
import Loading from "components/helpers/loading";
import EventList from "components/list_events/event_list";
import EventCreate from "components/create_event/event_create";
import EventShow from "components/show/ShowLayout";

const eventAddress = "0xE635AE769772F90bC595db03387DD34272A49225";
function App() {
  const { isLoading, web3, account, hasMetamask } = useWeb3();
  const [eventContract, setEventContract] = useState<Contract>();
  const [tokenContract, setTokenContract] = useState<Contract>();
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    (async () => {
      if (web3 !== null) {
        const _eventAbi = EventContractJSON.abi as AbiItem[];
        const _eventContract: any = new web3.eth.Contract(
          _eventAbi,
          eventAddress
        );

        setEventContract(_eventContract);
        // setTokenContract(_tokenContract)
        console.log(eventContract);

        setIsConfigured(true);
      }
    })();
  }, [web3]);

  if (!isLoading && !hasMetamask) {
    return <MetaMaskMissing />;
  }
  if (isLoading || !isConfigured) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Web3Context.Provider
          value={{
            web3,
            eventContract,
            eventAddress,
            account,
          }}
        >
          <Switch>
            <Route exact path="/">
              <EventList />
            </Route>
            <Route exact path="/events">
              <EventCreate />
            </Route>
            <Route path="/show/:event_id">
              <EventShow />
            </Route>
          </Switch>
        </Web3Context.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
