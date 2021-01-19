pragma solidity ^0.5.0;

contract localCrypto {
    
    function getEncodedPreimage(bytes32 _preimage)  
        public
        returns (bytes memory encode) {
        bytes memory encode = abi.encodePacked(_preimage);
        return encode;
    }
    
    /**
     * @dev calculate the hashlock corresponding to a preimage.
     * @param _preimage the plain text of a hashlock.
     */
    function getHash(bytes32 _preimage) 
        public 
        returns (bytes32 hashlock) {
        bytes memory encode = abi.encodePacked(_preimage);
        bytes32 hashlock = sha256(abi.encodePacked(_preimage));
        return hashlock;
    }
    
}
