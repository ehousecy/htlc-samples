package main

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

type Account struct {
	Address  string `json:"address"`
	Amount   uint64 `json:"amount"`
	Passwd   string `json:"passwd"`
	Sequence uint64 `json:"sequence"`
}
