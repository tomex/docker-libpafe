FROM node:8-jessie
COPY ./pasori.rules /tmp/pasori.rules

USER root
RUN set -ex \
    && apt update \
    && apt install -y libudev1 libudev-dev libusb-dev automake automake1.11 perl autoconf gcc-4.8 g++-4.8 \
    && cd /tmp \
    && git clone https://github.com/muojp/libpafe.git \
    && cd libpafe \
    && ./configure \
    && autoconf \
    && make clean \
    && make \
    && make install \
    && cp /tmp/pasori.rules /lib/udev/rules.d/60-libpafe.rules \
    && gpasswd -a node plugdev \
    && cd / \
    && git clone https://github.com/ky0615/node-libpafe.git node \
    && chown -R node /node \
    && chown -R node /usr/local/lib/node_modules \
    && chown -R node /usr/local/bin

USER node
RUN set -ex \
    && cd /node \
    && npm install --unsafe-perms node-gyp nan \
    && npm rebuild -g node-gyp \
    && npm install -g --unsafe-perms

USER root
RUN set -ex \
    && ldconfig \
    && udevadm control --reload-rule \
    || echo ''