package sdk

type InvokeChainCodeRequest struct {
	OrgName     string `json:"org_name"`
	ChaincodeID string `json:"chaincode_id"`
	Peer        string `json:"peer"`
	ChannelID   string `json:"channel_id"`
	Function    string `json:"function"`
	UserName    string `json:"user_name"`
}

type CreateAccountArgs struct {
	Address string `json:"address"`
	PassWD  string `json:"pass_wd"`
	Flag    string `json:"flag"`
}

type TransferArgs struct {
	From   string `json:"from"`
	To     string `json:"to"`
	Amount string `json:"amount"`
	Passwd string `json:"passwd"`
}

type CreateMidAccountArgs struct {
	Sender string `json:"sender"`
	PreImage string `json:"pre_image"`
	Flag string `json:"flag"`
}

type CreateHTLCArgs struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Amount   string `json:"amount"`
	TTL      string `json:"ttl"`
	PreImage string `json:"pre_image"`
	Passwd   string `json:"passwd"`
	MidAddress string `json:"mid_address"`
}

type CreateHTLBHashArgs struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Amount   string `json:"amount"`
	TTL      string `json:"ttl"`
	Hash     string `json:"hash"`
	Passwd   string `json:"passwd"`
	MidAddress string `json:"mid_address"`
	
}

type ReceiveHTLCArgs struct {
	ID       string `json:"id"`
	PreImage string `json:"pre_image"`
}

type RefundHTLCArgs struct {
	ID       string `json:"id"`
	PreImage string `json:"pre_image"`
}

type QueryHTLCArgs struct {
	ID string `json:"id"`
}

type Account struct {
	Address string `json:"address"`
	Amount uint64 `json:"amount"`
	Passwd string `json:"passwd"`
	Sequence uint64 `json:"sequence"`
}

type HTLCState int

const (
	HashLOCK HTLCState = 0
	Received HTLCState = 1
	Refund   HTLCState = 2
)

type HTLC struct {
	Sender      string    `json:"sender"`
	Receiver    string    `json:"receiver"`
	Amount      uint64    `json:"amount"`
	HashValue   string    `json:"hash_value"`
	TimeLock    int64     `json:"time_lock"`
	PreImage    string    `json:"pre_image"`
	LockAddress string    `json:"lock_address"`
	State       HTLCState `json:"state"`
}
