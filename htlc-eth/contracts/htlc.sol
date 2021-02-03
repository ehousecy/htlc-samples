pragma solidity ^0.5.0;

/**
 * @title 以太坊上的哈希时间锁合约（HTLCs）。
 *
 * 此合约提供了创建和保存ETH的HTLC。
 *
 *
 * 接口：
 *
 *  1） newHTLC(receiver, hashlock, timelock) - 发送者调用此合约来创建一个新的HTLC流程，返回32位字节的合约id。
 *  2） withdraw(htlcId, preimage) - 一旦接收者知道哈希锁的原像，他们可以通过此方法来提取锁定的ETH。
 *  3） refund() - 在时间锁过期后，接收者还没有提取锁定的资产，发送者或者HTLC的创建者可以调用此方法取回ETH。
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
     * @dev 发送者设置哈希时间锁来存储ETH以及其锁定时间。
     *
     * @param _receiver ETH接收者。
     * @param _hashlock 基于sha256的哈希时间锁。
     * @param _timelock 过期是的时间戳，在此之间之后若ETH还未被接收者提取，可以被发送者取回。
     * @return htlcId 资产被锁定的在的HTLC的Id。之后的调用会需要。
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
     * @dev 接收者一旦知道时间锁原像，会调用此方法提取锁定资产。
     *
     * @param _htlcId HTLC的Id。
     * @param _preimage 哈希锁原像，sha256(_preimage) 等于哈希锁。
     * @return bool 成功返回true。
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
     * @dev 如果时间锁过期，发送者调用此方法取回锁定的资产。
     *
     * @param _htlcId 锁定资产的HTLC的Id
     * @return bool 成功返回true。
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
     * @dev 获取HTLC的细节。
     * @param _htlcId HTLC的Id。
     * @return 所有LockHTLC的参数。
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
     * @dev 查询是否有id为_htlcId的HTLC。
     * @param _htlcId 存储HTLC的映射的键。
     */
    function haveContract(bytes32 _htlcId)
        internal
        view
        returns (bool exists)
    {
        exists = (contracts[_htlcId].sender != address(0));
    }

}
