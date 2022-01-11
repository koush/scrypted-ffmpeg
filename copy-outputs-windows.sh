cd $(dirname $0)


if [ ! -z "$DO_BUILD" ]
then
    docker build -t koush/ffmpeg-build:windows -f Dockerfile.windows .
fi

OUTPUT=$PWD/outputs
docker run -v $OUTPUT:/docker-output -it --entrypoint /docker-output/copy-docker-output-windows.sh koush/ffmpeg-build:windows
