package main

type Account struct {
	Address  string `json:"address"`
	Amount   uint64 `json:"amount"`
	Passwd   string `json:"passwd"`
	Sequence uint64 `json:"sequence"`
}
