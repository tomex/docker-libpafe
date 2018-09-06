# Docker上でlibpafe+nodejsを使って遊んでみたレベルのサンプル

ジャンクで買ったSONYのPasori RC-S320で遊ぶために作ったプログラムを公開してみる。

## 動作確認環境

* 必須パーツ
  * RC-S320
    * [muojp版libpafe](https://github.com/muojp/libpafe)が動けばなんでもいい
* OS
  * Mac上のDocker(※docker-machineコマンドとVirtualBox必須)
  * Linux上のDocker
* その他
  * 動かなくても動かしたいと思う気持ち

## 注意事項

* `docker-compose build`は絶対に1回コケて2回目以降でビルド完了するので粘ること

## 下準備(Macのみ)

1. `docker-machine create --driver virtualbox default`で仮想マシンを作る
1. `docker-machine stop default`で一旦マシンを止める
1. VirtualBoxで仮想マシンの設定を開き、USB1.1のデバイスとしてPasoriを追加設定する
1. `docker-machine start default`で仮想マシンを立ち上げる
1. `alias docker-machine-default='eval "$(docker-machine env default)"'`とかそんなやつを`~/.zshrc`とか`~/.bash_profile`あたりに追加しておく
1. `docker-machine-default`と打って環境変数を設定する

何かしらで仮想マシンを再起動した場合には`docker-machine start default`したあとに`docker-machine-default`をするべし

## 動作環境方法

1. `git clone https://github.com/tomex/docker-libpafe.git`でプログラムを落としておく
1. `cd docker-libpafe`でカレントディレクトリを移動
1. `docker-compose build`でビルドをする 
1. `docker-compose build`で再度ビルドをする
1. ビルドに成功したら`docker-compose up -d`で起動する
1. 起動してから少しの間はPasoriがFelicaを検知しようと頑張るのでPASMOなどをかざした後に`docker-compose logs`でログを確認して楽しむ

## 何が面白いの

**自分で考えて**