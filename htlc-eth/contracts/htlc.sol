pragma solidity ^0.5.0;

/**
 * @title Hashed Timelock Contracts (HTLCs) on Ethereum ETH.
 *
 * This contract provides a way to create and keep HTLCs for ETH.
 *
 * See HashedTimelockERC20.sol for a contract that provides the same functions
 * for ERC20 tokens.
 *
 * Protocol:
 *
 *  1) newHTLC(receiver, hashlock, timelock) - a sender calls this to create
 *      a new HTLC and gets back a 32 byte contract id
 *  2) withdraw(htlcId, preimage) - once the receiver knows the preimage of
 *      the hashlock hash they can claim the ETH with this function
 *  3) refund() - after timelock has expired and if the receiver did not
 *      withdraw funds the sender / creator of the HTLC can get their ETH
 *      back with this function.
 */
contract HashedTimelock {

    event LogHTLCNew(
        bytes32 indexed htlcId,
        address indexed sender,
        address indexed receiver,
        uint amount,
        bytes32 hashlock,
        uint timelock
    );
    event LogHTLCWithdraw(bytes32 indexed htlcId);
    event LogHTLCRefund(bytes32 indexed htlcId);

    struct LockHTLC {
        address payable sender;
        address payable receiver;
        uint amount;
        bytes32 hashlock; // sha-2 sha256 hash
        uint timelock; // UNIX timestamp seconds - locked UNTIL this time
        bool withdrawn;
        bool refunded;
        bytes preimage;
    }

    modifier fundsSent() {
        require(msg.value > 0, "msg.value must be > 0");
        _;
    }
    modifier futureTimelock(uint _time) {
        // only requirement is the timelock time is after the last blocktime (now).
        // probably want something a bit further in the future then this.
        // but this is still a useful sanity check:
        require(_time > now, "timelock time must be in the future");
        _;
    }
    modifier contractExists(bytes32 _htlcId) {
        require(haveContract(_htlcId), "htlcId does not exist");
        _;
    }
    modifier hashlockMatches(bytes32 _htlcId, bytes memory _x) {
        require(
            contracts[_htlcId].hashlock == sha256(abi.encodePacked(_x)),
            "hashlock hash does not match"
        );
        _;
    }
    modifier withdrawable(bytes32 _htlcId) {
        require(contracts[_htlcId].receiver == msg.sender, "withdrawable: not receiver");
        require(contracts[_htlcId].withdrawn == false, "withdrawable: already withdrawn");
        require(contracts[_htlcId].timelock > now, "withdrawable: timelock time must be in the future");
        _;
    }
    modifier refundable(bytes32 _htlcId) {
        require(contracts[_htlcId].sender == msg.sender, "refundable: not sender");
        require(contracts[_htlcId].refunded == false, "refundable: already refunded");
        require(contracts[_htlcId].withdrawn == false, "refundable: already withdrawn");
        require(contracts[_htlcId].timelock <= now, "refundable: timelock not yet passed");
        _;
    }

    mapping (bytes32 => LockHTLC) contracts;

    /**
     * @dev Sender sets up a new hash time lock contract depositing the ETH and
     * providing the reciever lock terms.
     *
     * @param _receiver Receiver of the ETH.
     * @param _hashlock A sha-2 sha256 hash hashlock.
     * @param _timelock UNIX epoch seconds time that the lock expires at.
     *                  Refunds can be made after this time.
     * @return htlcId Id of the new HTLC. This is needed for subsequent
     *                    calls.
     */
    function newHTLC(address payable _receiver, bytes32 _hashlock, uint _timelock)
        external
        payable
        fundsSent
        futureTimelock(_timelock)
        returns (bytes32 htlcId)
    {
        htlcId = sha256(
            abi.encodePacked(
                msg.sender,
                _receiver,
                msg.value,
                _hashlock,
                _timelock
            )
        );

        // Reject if a contract already exists with the same parameters. The
        // sender must change one of these parameters to create a new distinct
        // contract.
        if (haveContract(htlcId))
            revert("Contract already exists");

        contracts[htlcId] = LockHTLC(
            msg.sender,
            _receiver,
            msg.value,
            _hashlock,
            _timelock,
            false,
            false,
            '0x0'
        );

        emit LogHTLCNew(
            htlcId,
            msg.sender,
            _receiver,
            msg.value,
            _hashlock,
            _timelock
        );
    }

    /**
     * @dev Called by the receiver once they know the preimage of the hashlock.
     * This will transfer the locked funds to their address.
     *
     * @param _htlcId Id of the HTLC.
     * @param _preimage sha256(_preimage) should equal the contract hashlock.
     * @return bool true on success
     */
    function withdraw(bytes32 _htlcId, bytes calldata _preimage)
        external
        contractExists(_htlcId)
        hashlockMatches(_htlcId, _preimage)
        withdrawable(_htlcId)
        returns (bool)
    {
        LockHTLC storage c = contracts[_htlcId];
        c.preimage = _preimage;
        c.withdrawn = true;
        c.receiver.transfer(c.amount);
        emit LogHTLCWithdraw(_htlcId);
        return true;
    }

    /**
     * @dev Called by the sender if there was no withdraw AND the time lock has
     * expired. This will refund the contract amount.
     *
     * @param _htlcId Id of HTLC to refund from.
     * @return bool true on success
     */
    function refund(bytes32 _htlcId)
        external
        contractExists(_htlcId)
        refundable(_htlcId)
        returns (bool)
    {
        LockHTLC storage c = contracts[_htlcId];
        c.refunded = true;
        c.sender.transfer(c.amount);
        emit LogHTLCRefund(_htlcId);
        return true;
    }

    /**
     * @dev Get contract details.
     * @param _htlcId HTLC contract id
     * @return All parameters in struct LockHTLC for _htlcId HTLC
     */
    function getContract(bytes32 _htlcId)
        public
        view
        returns (
            address sender,
            address receiver,
            uint amount,
            bytes32 hashlock,
            uint timelock,
            bool withdrawn,
            bool refunded,
            bytes memory preimage
        )
    {
        if (haveContract(_htlcId) == false){
            bytes memory pi = '0x0';
            return (address(0), address(0), 0, 0, 0, false, false,  pi);
        }
        LockHTLC storage c = contracts[_htlcId];
        return (
            c.sender,
            c.receiver,
            c.amount,
            c.hashlock,
            c.timelock,
            c.withdrawn,
            c.refunded,
            c.preimage
        );
    }

    /**
     * @dev Is there a contract with id _htlcId.
     * @param _htlcId Id into contracts mapping.
     */
    function haveContract(bytes32 _htlcId)
        internal
        view
        returns (bool exists)
    {
        exists = (contracts[_htlcId].sender != address(0));
    }

}
