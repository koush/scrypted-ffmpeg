import fs from 'fs';
import { default as axios } from 'axios';
import os from 'os';
import path from 'path';
import mkdirp from 'mkdirp';
import { Readable } from 'stream';
import { once } from 'events';

const packagePath = path.join(__dirname, '..');
const packageJson = require(path.join(packagePath, 'package.json'));

let platform: string = os.platform();
// todo: fix this lol
if (platform === 'linux')
    platform = 'debian';

const suffix = `${platform}-${os.arch}`;
const binaryName = `ffmpeg-${suffix}`;
const releaseVersion = 'v1.0.6';

const localBinaryPath = path.join(packagePath, `${suffix}-${releaseVersion}/ffmpeg`);

export async function installFfmpeg(): Promise<string | undefined> {
    if (fs.existsSync(localBinaryPath)) {
        console.log('ffmpeg binary exists, skipping download', localBinaryPath);
        return;
    }

    const releaseUrl = `${packageJson.repository.url}/releases/download/${releaseVersion}/${binaryName}`;
    console.log('Downloading:', releaseUrl);

    return axios.get(releaseUrl, {
        responseType: 'stream',
    })
        .then(async (response) => {
            const responseStream = response.data as Readable;
            const dir = path.dirname(localBinaryPath);
            mkdirp.sync(dir);
            const localBinaryPathTmp = localBinaryPath + '.tmp';
            const outputStream = responseStream.pipe(fs.createWriteStream(localBinaryPathTmp))
            await once(outputStream, 'finish');
            fs.chmodSync(localBinaryPathTmp, 0o0755);
            try {
                fs.unlinkSync(localBinaryPath);
            }
            catch (e) {
            }
            fs.renameSync(localBinaryPathTmp, localBinaryPath);
            console.log('ffmpeg installed to:', localBinaryPath);
            return localBinaryPath;
        })
        .catch(e => {
            const { response } = e;
            if (!response || response.status !== 404)
                throw e;
            console.warn('prebuilt ffmpeg was unavailable for your platform-architecture combination:', suffix);
            return undefined;
        });
}

export function getInstalledFfmpeg(): string | undefined {
    if (fs.existsSync(localBinaryPath))
        return localBinaryPath;
    return undefined;
}
