cd $(dirname $0)

if [ ! -z "$DO_BUILD" ]
then
    docker buildx build --platform linux/amd64,linux/aarch64,linux/armhf -t koush/ffmpeg-build --push .
fi
# docker build -t koush/ffmpeg-build:windows --push -f Dockerfile.windows

OUTPUT=$PWD/outputs

for arch in amd64 aarch64 armhf
do
    docker pull --platform linux/$arch koush/ffmpeg-build
    docker run -v $OUTPUT:/docker-output -it --entrypoint /docker-output/copy-docker-output.sh koush/ffmpeg-build
    mv -f $OUTPUT/ffmpeg $OUTPUT/ffmpeg-linux-$arch
done

mv -f $OUTPUT/ffmpeg-linux-aarch64 $OUTPUT/ffmpeg-debian-arm64
mv -f $OUTPUT/ffmpeg-linux-armhf $OUTPUT/ffmpeg-debian-arm
mv -f $OUTPUT/ffmpeg-linux-amd64 $OUTPUT/ffmpeg-debian-x64
