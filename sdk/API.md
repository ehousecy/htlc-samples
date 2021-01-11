# API˵��

## �����û�

**url**: http://${ip}:9090/account/create

**����ʽ**��POST

**�������**��
```
{
	"address":"chenmx",
	"passwd":"rootroot",
	"flag":""
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
	"to":"chenmx",
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
	"address":"chenmx"
}
```

**���ز���**��
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

## �����м��˻�

**url**: http://${ip}:9090/htlc/midaccount

**����ʽ**��POST

**�������**��
```
{
	"sender":"chenmx", // hash���������ߵ�ַ
    "pre_image":"abc", // hashԭ�����hashֵ
    "flag":"", // ����hashʱ��pre_imageΪhashֵ 
}
```

**���ز���**��
```
{
    "data": "address", //�м��˻���ַ
    "msg": "succeed"
}
```

## ����HTLC(ԭ��)

**url**: http://${ip}:9090/htlc/create

**����ʽ**��POST

**�������**��
```
{
	"sender":"chenmx", // �������˻�
	"receiver":"lijie", // �������˻�
	"amount":"20", // ת�˽��
	"ttl":"2000", // ��Чʱ��
	"pre_image":"abcqq", // hashԭ��
	"passwd":"rootroot", // �������˻�����
	"mid_address":"chenmx0" // �м��˻���ַ
}
```

**���ز���**��
```
{
    "data": "8b382860313d403bdbc82bf9a44732208a68b536b4e653ab1935ea0238c1a3cb",
    "msg": "succeed"
}
```

## ����HTLC(Hashֵ)

**url**: http://${ip}:9090/htlc/createbyhash

**����ʽ**��POST

**�������**��
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

**���ز���**��
```
{
    "data": "79bb09d7e951cfb7b861d122a750762e171b68a31c2a04e30ce47b74e0692373",
    "msg": "succeed"
}
```

## ����HTLC

**url**: http://${ip}:9090/htlc/receive

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