// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";

/// @title Base Lucky Lotto (onchain SVG ticket)
/// @notice Simple fixed-supply paid mint. Metadata + image are fully on-chain.
contract BaseLuckyLotto is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 3000;
    uint256 public constant MINT_PRICE = 0.00015 ether;

    uint256 public totalMinted;
    address public immutable payout;

    error SoldOut();
    error WrongValue();

    constructor(address _payout) ERC721("Base Lucky Lotto", "BLL") Ownable(msg.sender) {
        require(_payout != address(0), "payout=0");
        payout = _payout;
    }

    function mint() external payable nonReentrant returns (uint256 tokenId) {
        if (msg.value != MINT_PRICE) revert WrongValue();
        if (totalMinted >= MAX_SUPPLY) revert SoldOut();

        tokenId = ++totalMinted;
        _safeMint(msg.sender, tokenId);
    }

    function withdraw() external nonReentrant {
        uint256 bal = address(this).balance;
        (bool ok, ) = payout.call{value: bal}("");
        require(ok, "withdraw failed");
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        string memory svg = _buildSVG(tokenId);
        string memory image = string.concat(
            "data:image/svg+xml;base64,",
            Base64.encode(bytes(svg))
        );

        // minimal JSON metadata
        bytes memory json = abi.encodePacked(
            "{",
                "\"name\":\"Base Lucky Lotto #", tokenId.toString(), "\" ,",
                "\"description\":\"On-chain lucky ticket on Base. Mint price fixed; supply capped.\" ,",
                "\"image\":\"", image, "\" ,",
                "\"attributes\":[",
                    "{\"trait_type\":\"Series\",\"value\":\"Genesis\"},",
                    "{\"trait_type\":\"Network\",\"value\":\"Base\"},",
                    "{\"trait_type\":\"Ticket\",\"value\":\"", tokenId.toString(), "\"}",
                "]",
            "}"
        );

        return string.concat(
            "data:application/json;base64,",
            Base64.encode(json)
        );
    }

    function _buildSVG(uint256 tokenId) internal pure returns (string memory) {
        // clean, lightweight ticket design
        return string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' width='900' height='600' viewBox='0 0 900 600'>",
                "<defs>",
                "<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>",
                "<stop offset='0%' stop-color='#0b1020'/>",
                "<stop offset='100%' stop-color='#1b2a6b'/>",
                "</linearGradient>",
                "<filter id='shadow' x='-20%' y='-20%' width='140%' height='140%'>",
                "<feDropShadow dx='0' dy='8' stdDeviation='10' flood-color='#000' flood-opacity='0.35'/>",
                "</filter>",
                "</defs>",
                "<rect width='900' height='600' fill='url(#g)'/>",
                "<g filter='url(#shadow)'>",
                "<rect x='70' y='70' width='760' height='460' rx='26' fill='#f7f3e8'/>",
                "<rect x='70' y='160' width='760' height='2' fill='#1b2a6b' opacity='0.25'/>",
                "</g>",
                "<text x='110' y='130' font-family='ui-sans-serif, system-ui' font-size='40' fill='#0b1020' font-weight='700'>BASE LUCKY LOTTO</text>",
                "<text x='110' y='210' font-family='ui-monospace, SFMono-Regular, Menlo, Monaco' font-size='22' fill='#0b1020' opacity='0.75'>ON-CHAIN TICKET</text>",
                "<text x='110' y='290' font-family='ui-monospace, SFMono-Regular, Menlo, Monaco' font-size='30' fill='#0b1020' font-weight='700'>TICKET #",
                    tokenId.toString(),
                "</text>",
                "<text x='110' y='340' font-family='ui-sans-serif, system-ui' font-size='18' fill='#0b1020' opacity='0.7'>Network: Base</text>",
                "<text x='110' y='370' font-family='ui-sans-serif, system-ui' font-size='18' fill='#0b1020' opacity='0.7'>Supply: 3000 max</text>",
                "<text x='110' y='400' font-family='ui-sans-serif, system-ui' font-size='18' fill='#0b1020' opacity='0.7'>Mint: 0.00015 ETH</text>",
                "<circle cx='740' cy='320' r='78' fill='#1b2a6b' opacity='0.12'/>",
                "<circle cx='760' cy='330' r='58' fill='#1b2a6b' opacity='0.16'/>",
                "<text x='680' y='505' font-family='ui-monospace, SFMono-Regular, Menlo, Monaco' font-size='14' fill='#0b1020' opacity='0.45'>data: on-chain</text>",
                "</svg>"
            )
        );
    }
}
