# API说明

## 创建用户

**url**: http://${ip}:9090/account/create

**请求方式**：POST

**请求参数**：
```
{
	"address":"test",
	"passwd":"passwd"
}
```

**返回参数**：
```
{
    "data": "success create account",
    "msg": "succeed"
}
```

## 转账

**url**: http://${ip}:9090/account/transfer

**请求方式**：POST

**请求参数**：
```
{
	"from":"account-assert-genesis-account",
	"to":"test",
	"amount":"1000",
	"passwd":"12345678"
}
```

**返回参数**：
```
{
    "data": "Transfer Success",
    "msg": "succeed"
}
```

## 查询用户

**url**: http://${ip}:9090/account/query

**请求方式**：POST

**请求参数**：
```
{
	"address":"test"
}
```

**返回参数**：
```
{
    "data": {
        "address": "test",
        "amount": 1000,
        "passwd": "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18",
        "sequence": 0,
        "type": 0,
        "transfer_to": []
    },
    "msg": "succeed"
}
```

## 创建中间账户

**url**: http://${ip}:9090/htlc/midaccount

**请求方式**：POST

**请求参数**：
```
{
    "sender":"test", // hash锁定发送者地址
    "pre_image":"preimage", // hash原像或者hash值
    "flag":"", // 等于hash时，pre_image为hash值 
    "receiver":"receiver"
}
```

**返回参数**：
```
{
    "data": {
        "address":"test0",
        "hash":"hash"
    }
    "msg": "succeed"
}
```

## 创建HTLC

**url**: http://${ip}:9090/htlc/createbyhash

**请求方式**：POST

**请求参数**：
```
{
	"sender":"test",
	"receiver":"user",
	"amount":"20", 
	"ttl":"2000", 
	"hash":"6dba306801b676d7c8fc63350fa202be6b83106c2261432b876bb694b02f0ce9", 
	"passwd":"rootroot", 
	"mid_address":"test0" 
}
```

**返回参数**：
```
{
    "data": "79bb09d7e951cfb7b861d122a750762e171b68a31c2a04e30ce47b74e0692373",
    "msg": "succeed"
}
```

## 接收HTLC

**url**: http://${ip}:9090/htlc/withdraw

**请求方式**：POST

**请求参数**：
```
{
	"id":"8b382860313d403bdbc82bf9a44732208a68b536b4e653ab1935ea0238c1a3cb",
	"pre_image":"abcqq"
}
```

**返回参数**：
```
{
    "data": "Receive HTLC success.",
    "msg": "succeed"
}
```

## HTLC退款

**url**: http://${ip}:9090/htlc/refund

**请求方式**：POST

**请求参数**：
```
{
	"id":"8b382860313d403bdbc82bf9a44732208a68b536b4e653ab1935ea0238c1a3cb",
	"pre_image":"abcqq"
}
```

**返回参数**：
```
{
    "data": "Refund Success.",
    "msg": "succeed"
}
```

## HTLC查询

**url**: http://${ip}:9090/htlc/query

**请求方式**：POST

**请求参数**：
```
{
	"id":"8b382860313d403bdbc82bf9a44732208a68b536b4e653ab1935ea0238c1a3cb"
}
```

**返回参数**：
```
{
    "data": {
        "sender": "test",
        "receiver": "user",
        "amount": 20,
        "hash_value": "6dba306801b676d7c8fc63350fa202be6b83106c2261432b876bb694b02f0ce9",
        "time_lock": 1610358829,
        "pre_image": "",
        "lock_address": "test0",
        "state": 0
    },
    "msg": "succeed"
}
```