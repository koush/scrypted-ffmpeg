# -v $PWD/build/linux/$ARCH:/ffmpeg-build-script/workspace/
FROM debian:buster

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y \
    subversion \
    ragel \
    curl \
    texinfo \
    g++ \
    bison \
    flex \
    cvs \
    yasm \
    automake \
    libtool \
    autoconf \
    gcc \
    cmake \
    git \
    make \
    pkg-config \
    zlib1g-dev \
    unzip \
    pax \
    nasm \
    gperf \
    autogen \
    bzip2 \
    autoconf-archive \
    p7zip-full \
    meson \
    clang \
    python \
    python3-setuptools \
    wget \
    ed

RUN apt-get -y install build-essential curl

COPY ffmpeg-build-script /ffmpeg-build-script
COPY build.sh /build.sh

WORKDIR /ffmpeg-build-script

COPY packages packages
RUN rm -f packages/*.done

RUN /build.sh

FROM debian

RUN mkdir -p /workspace
COPY --from=0 /ffmpeg-build-script/workspace/bin/ffmpeg /workspace/ffmpeg
