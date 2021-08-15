//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Token is ERC721 {
    uint256 public tokenCounter;
    address public _owner;

    string private _baseURL = "https://ipfs.io/ipfs/";

    constructor(address _organizer) ERC721("SPACE FS", "SFS") {
        _owner = _organizer;
    }

    function MintEventToken(address user, string memory _tokenURI)
        public
        OnlyOwner
    {
        _safeMint(user, tokenCounter);
        _setTokenURI(tokenCounter, _tokenURI);
        tokenCounter += 1;
    }

    modifier OnlyOwner() {
        require(msg.sender == _owner, "Err: only owner can execute this");
        _;
    }
}
