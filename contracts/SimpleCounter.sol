// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract SimpleCounter {
    uint256 public counter;
    uint256 public price;

    event IncrementCounter(
        address msgSender,
        uint256 newCounterValue,
        uint256 timestamp
    );

    event PriceUpdated(uint256 indexed timeStamp, uint256 price);

    function increment() external {
        counter++;
        emit IncrementCounter(msg.sender, counter, block.timestamp);
    }

    function updatePrice(uint256 _price) external {
        price = _price;

        emit PriceUpdated(block.timestamp, _price);
    }
}
