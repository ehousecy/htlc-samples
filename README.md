# htlc-samples

## 下载
```
$ mkdir -p $GOPATH/src/github.com/ehousecy
$ cd $GOPATH/src/github.com/ehousecy
$ git clone https://github.com/ehousecy/htlc-samples.git
```

## 部署

### 部署fabric网络并安装实例化相关链码

```
$ cd htlc-samples/htlc-fabric/deploy
$ ./byfn up
```

### 部署ethereum网络并安装相关链码

```
$ cd htlc-eth
$ bash launch.sh download
$ bash launch.sh start
```