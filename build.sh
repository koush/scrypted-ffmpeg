cd $(dirname $0)
cd ffmpeg-build-script
SKIPINSTALL=yes ./build-ffmpeg --build --enable-gpl-and-non-free
