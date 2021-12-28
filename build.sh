cd $(dirname $0)
cd ffmpeg-build-script
SKIPINSTALL=true ./build-ffmpeg --build --enable-gpl-and-non-free
