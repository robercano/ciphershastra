pragma solidity ^0.8.0;

contract sherlock {
    uint256 public var256_1 = 1337; // Slot 0

    // Slot 1
    bool public bool_1 = false; // Slot 1
    bool public bool_2 = false; // Slot 1
    bool public bool_3 = true; // Slot 1
    uint16 public var16_1 = 32; // Slot 1
    uint16 private var16_2 = 64; // Slot 1
    address public contractAdd = address(this); // Slot 1

    uint256 private var256_2 = 3445; // Slot 2
    uint256 private var256_3 = 6677; // Slot 3
    bytes32 private iGotThePassword; // Slot 4
    bytes32 private actuallPass; // Slot 5
    bytes32 private definitelyThePass; // Slot 6
    uint256 public var256_4 = 7788; // Slot 7

    // Slot 8
    uint16 public var16_3 = 69;
    uint16 private var16_4 = 7;
    bool private _Pass = true;
    bool private _The = true;
    bool private _Password = false;
    address private owner;
    uint16 private counter;

    // Slot X
    bytes32 public constant thePassword = 0xaabbaabbaabbaabbaabbaabbaabbaabbaabbaabbaabbaabbaabbaabbaabbaabb; //...................[REDACTED]...................

    // Slot X
    bytes32 private constant ohNoNoNoNoNo = 0xccddccddccddccddccddccddccddccddccddccddccddccddccddccddccddccdd; // .................[REDACTED]...................

    // Slot 9-12
    bytes32[4] private passHashes;
    struct Passwords {
        bytes32 name;
        uint256 secretKey;
        bytes32 password;
    }

    // Slot 13
    Passwords[] private passwords;

    // Slot 14
    mapping(uint256 => Passwords) private destiny;

    //...................[REDACTED]...................
}
