# API˵��

## �����û�

**url**: http://${ip}:9090/account/create

**����ʽ**��POST

**�������**��
```
{
	"address":"test",
	"passwd":"passwd"
}
```

**���ز���**��
```
{
    "data": "success create account",
    "msg": "succeed"
}
```

## ת��

**url**: http://${ip}:9090/account/transfer

**����ʽ**��POST

**�������**��
```
{
	"from":"account-assert-genesis-account",
	"to":"test",
	"amount":"1000",
	"passwd":"12345678"
}
```

**���ز���**��
```
{
    "data": "Transfer Success",
    "msg": "succeed"
}
```

## ��ѯ�û�

**url**: http://${ip}:9090/account/query

**����ʽ**��POST

**�������**��
```
{
	"address":"test"
}
```

**���ز���**��
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

## �����м��˻�

**url**: http://${ip}:9090/htlc/midaccount

**����ʽ**��POST

**�������**��
```
{
    "sender":"test", // hash���������ߵ�ַ
    "pre_image":"preimage", // hashԭ�����hashֵ
    "flag":"", // ����hashʱ��pre_imageΪhashֵ 
    "receiver":"receiver"
}
```

**���ز���**��
```
{
    "data": {
        "address":"test0",
        "hash":"hash"
    }
    "msg": "succeed"
}
```

## ����HTLC

**url**: http://${ip}:9090/htlc/createbyhash

**����ʽ**��POST

**�������**��
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

**���ز���**��
```
{
    "data": "79bb09d7e951cfb7b861d122a750762e171b68a31c2a04e30ce47b74e0692373",
    "msg": "succeed"
}
```

## ����HTLC

**url**: http://${ip}:9090/htlc/withdraw

**����ʽ**��POST

**�������**��
```
{
	"id":"8b382860313d403bdbc82bf9a44732208a68b536b4e653ab1935ea0238c1a3cb",
	"pre_image":"abcqq"
}
```

**���ز���**��
```
{
    "data": "Receive HTLC success.",
    "msg": "succeed"
}
```

## HTLC�˿�

**url**: http://${ip}:9090/htlc/refund

**����ʽ**��POST

**�������**��
```
{
	"id":"8b382860313d403bdbc82bf9a44732208a68b536b4e653ab1935ea0238c1a3cb",
	"pre_image":"abcqq"
}
```

**���ز���**��
```
{
    "data": "Refund Success.",
    "msg": "succeed"
}
```

## HTLC��ѯ

**url**: http://${ip}:9090/htlc/query

**����ʽ**��POST

**�������**��
```
{
	"id":"8b382860313d403bdbc82bf9a44732208a68b536b4e653ab1935ea0238c1a3cb"
}
```

**���ز���**��
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