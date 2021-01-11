# API说明

## 创建用户

**url**: http://${ip}:9090/account/create

**请求方式**：POST

**请求参数**：
```
{
	"address":"chenmx",
	"passwd":"rootroot",
	"flag":""
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
	"to":"chenmx",
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
	"address":"chenmx"
}
```

**返回参数**：
```
{
    "data": {
        "address": "chenmx",
        "amount": 1000,
        "passwd": "0242c0436daa4c241ca8a793764b7dfb50c223121bb844cf49be670a3af4dd18",
        "sequence": 0
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
	"sender":"chenmx", // hash锁定发送者地址
    "pre_image":"abc", // hash原像或者hash值
    "flag":"", // 等于hash时，pre_image为hash值 
}
```

**返回参数**：
```
{
    "data": "address", //中间账户地址
    "msg": "succeed"
}
```

## 创建HTLC(原像)

**url**: http://${ip}:9090/htlc/create

**请求方式**：POST

**请求参数**：
```
{
	"sender":"chenmx", // 发送者账户
	"receiver":"lijie", // 接收者账户
	"amount":"20", // 转账金额
	"ttl":"2000", // 有效时间
	"pre_image":"abcqq", // hash原像
	"passwd":"rootroot", // 发送者账户密码
	"mid_address":"chenmx0" // 中间账户地址
}
```

**返回参数**：
```
{
    "data": "8b382860313d403bdbc82bf9a44732208a68b536b4e653ab1935ea0238c1a3cb",
    "msg": "succeed"
}
```

## 创建HTLC(Hash值)

**url**: http://${ip}:9090/htlc/createbyhash

**请求方式**：POST

**请求参数**：
```
{
	"sender":"chenmx",
	"receiver":"lijie",
	"amount":"20", 
	"ttl":"2000", 
	"hash":"6dba306801b676d7c8fc63350fa202be6b83106c2261432b876bb694b02f0ce9", 
	"passwd":"rootroot", 
	"mid_address":"chenmx0" 
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

**url**: http://${ip}:9090/htlc/receive

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
        "sender": "chenmx",
        "receiver": "zhoujunjie",
        "amount": 20,
        "hash_value": "6dba306801b676d7c8fc63350fa202be6b83106c2261432b876bb694b02f0ce9",
        "time_lock": 1610358829,
        "pre_image": "",
        "lock_address": "chenmx0",
        "state": 0
    },
    "msg": "succeed"
}
```