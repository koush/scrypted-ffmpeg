cd $(dirname $0)
for arch in linux/amd64 linux/aarch64 linux/armhf
do
    docker pull --platform $arch koush/ffmpeg-build
    OUTPUT=$PWD/docker-outputs/$arch
    mkdir -p $OUTPUT
    cp $PWD/docker-outputs/copy-docker-output.sh $OUTPUT
    docker run -v $OUTPUT:/docker-output -it --entrypoint /docker-output/copy-docker-output.sh koush/ffmpeg-build
done
