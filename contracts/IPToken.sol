pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IPToken is ERC20 {
    constructor() ERC20("Ian Phua Token", "IPT") {
        _mint(msg.sender, 100000 & (10**18));
    }
}
