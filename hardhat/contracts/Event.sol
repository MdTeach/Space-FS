//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./Token.sol";

contract Event {
    struct Show {
        address host;
        uint256 price;
        string hash;
        address nft;
    }

    mapping(address => Show) public _listedEvents;
    mapping(address => address) public _userNFT;

    string[] public events;
    uint256 public totalEvents;

    function getEvents() public view returns (string[] memory) {
        return events;
    }

    function createShow(uint256 _price, string memory _hash) public {
        address _host = msg.sender;
        address _nft = _userNFT[_host];

        if (_userNFT[_host] == address(0)) {
            Token token = new Token(_host);
            _userNFT[_host] = address(token);
            _nft = _userNFT[_host];
        }

        Show memory show = Show({
            host: _host,
            price: _price,
            hash: _hash,
            nft: _nft
        });

        _listedEvents[msg.sender] = show;
        events.push(_hash);
        totalEvents += 1;
    }
}
