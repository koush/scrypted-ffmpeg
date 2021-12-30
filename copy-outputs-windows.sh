cd $(dirname $0)

# docker pull koush/ffmpeg-build:windows
OUTPUT=$PWD/outputs
docker run -v $OUTPUT:/docker-output -it --entrypoint /docker-output/copy-docker-output-windows.sh koush/ffmpeg-build:windows
