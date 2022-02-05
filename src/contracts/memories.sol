// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Memories {

    uint internal memoriesLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

// a struct with all the memory values
    struct Memory {
        address payable owner;
        string name;
        string description;
        uint likes;
        uint dislikes;
        uint tips;
        uint commentCounts;
        string[] comments;
    }

    mapping (uint => Memory) internal memories;// mapping each struct to a uint

     // to add a new memory to the mapping
    function addMemory(
        string memory _name,
        string memory _description 
    ) public {
        uint _likes = 0;
        uint _dislikes = 0;
        uint _tips =0;
        uint _commentCount = 0;
        memories[memoriesLength] = Memory(
            payable(msg.sender),
            _name,
            _description,
            _likes,
            _dislikes,
            _tips,
            _commentCount
        );
        memoriesLength++;
    }
    // to read a memory from the mapping
    function getMemories(uint _index) public view returns (
        address payable,
        string memory,  
        string memory, 
        uint, 
        uint,
        uint
    ) {
        return (
            memories[_index].owner,
            memories[_index].name,  
            memories[_index].description,  
            memories[_index].likes,
            memories[_index].dislikes,
            memories[_index].tips,
            memories[_index].commentCount
        );
    }

     // deleting a memory from the mapping and making sure only the owner of the memory can delete the memory 
     function deleteMemory(uint _index) external{
        require(msg.sender == memories[_index].owner, "you cannot delete this memory");
        delete memories[_index];
    }

    // anyone can like a memory except the owner
    function Like(uint _index) public{
    require(msg.sender != memories[_index].owner, "You cannot like your own memory");
        memories[_index].likes++;
    }
     // anyone can dislike a memory except the owner
    function disLike(uint _index) external{
        require(msg.sender != memories[_index].owner, "You cannot dislike your own memory");
        memories[_index].dislikes++;
    }

   
    // to tip the creator of the memory and the ammount should be more than 1 cUSD
    function Tip (uint _index, uint _price ) public payable  {
        require(_price >= 1, "tipping price should be above or atleast 1 cUSD");
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            memories[_index].owner,
            _price
          ),
          "Transfer failed."
        );
        memories[_index].tips = memories[_index].tips + _price;
    }

  function addComment(uint _index, string memory _comment) public{
    memories[_index].comment.push(_comment);
    memories[_index].commentCount++;
  
  }
  
  function getComment(uint _index, uint _comment) public view returns(string memory){
    return(memories[_index].comments[_comment]);
  }

    // to get the length of memories
    function getmemoriesLength() public view returns (uint) {
        return (memoriesLength);
    }
}
