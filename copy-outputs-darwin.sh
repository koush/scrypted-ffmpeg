cd $(dirname $0)

./build.sh
arch=$(arch)
if [ "$arch" == "i386" ]
then
    arch="x64"
fi

cp ffmpeg-build-script/workspace/bin/ffmpeg outputs/ffmpeg-darwin-$arch
