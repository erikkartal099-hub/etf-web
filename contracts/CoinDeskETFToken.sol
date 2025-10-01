// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CoinDeskETFToken
 * @dev ERC20 token representing CoinDesk Crypto 5 ETF shares
 * This is a simplified demo contract for the investment platform
 */
contract CoinDeskETFToken is ERC20, Ownable {
    // Token metadata
    uint8 private constant DECIMALS = 18;
    uint256 private constant INITIAL_SUPPLY = 1000000 * (10 ** DECIMALS);
    
    // Mapping to track user deposits
    mapping(address => uint256) public deposits;
    
    // Events
    event TokensMinted(address indexed user, uint256 amount, uint256 ethAmount);
    event TokensBurned(address indexed user, uint256 amount, uint256 ethAmount);
    
    constructor() ERC20("CoinDesk Crypto 5 ETF", "CD5ETF") Ownable(msg.sender) {
        // Mint initial supply to contract owner
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint ETF tokens in exchange for ETH
     */
    function mintTokens() external payable {
        require(msg.value > 0, "Must send ETH");
        
        // Calculate tokens to mint (1 ETH = 1 ETF token for simplicity)
        uint256 tokensToMint = msg.value;
        
        // Track deposit
        deposits[msg.sender] += msg.value;
        
        // Mint tokens to user
        _mint(msg.sender, tokensToMint);
        
        emit TokensMinted(msg.sender, tokensToMint, msg.value);
    }
    
    /**
     * @dev Burn ETF tokens and withdraw ETH
     */
    function burnTokens(uint256 tokenAmount) external {
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient balance");
        
        // Calculate ETH to return
        uint256 ethToReturn = tokenAmount;
        require(address(this).balance >= ethToReturn, "Insufficient contract balance");
        
        // Burn tokens
        _burn(msg.sender, tokenAmount);
        
        // Transfer ETH
        payable(msg.sender).transfer(ethToReturn);
        
        emit TokensBurned(msg.sender, tokenAmount, ethToReturn);
    }
    
    /**
     * @dev Owner can withdraw excess ETH
     */
    function withdrawExcess() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Get contract ETH balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}
