import fs from 'fs';
import { default as axios } from 'axios';
import os from 'os';
import path from 'path';

const packagePath = path.join(__dirname, '..');
const packageJson = require(path.join(packagePath, 'package.json'));

let platform: string = os.platform();
// todo: fix this lol
if (platform === 'linux')
    platform = 'debian';

const suffix = `${platform}-${os.arch}`;
const binaryName = `ffmpeg-${suffix}`;
const releaseVersion = 'v1.0.6';

const localBinaryPath = path.join(packagePath, `${binaryName}-${releaseVersion}`);

export async function installFfmpeg(): Promise<string|undefined> {
    if (fs.existsSync(localBinaryPath)) {
        console.log('ffmpeg binary exists, skipping download', localBinaryPath);
        return;
    }

    const releaseUrl = `${packageJson.repository.url}/releases/download/${releaseVersion}/${binaryName}`;
    console.log('Downloading:', releaseUrl);

    return axios.get(releaseUrl, {
        responseType: 'arraybuffer',
    })
    .then(response => {
        const localBinaryPathTmp = localBinaryPath + '.tmp';
        fs.writeFileSync(localBinaryPathTmp, Buffer.from(response.data));
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

export function getInstalledFfmpeg(): string|undefined {
    if (fs.existsSync(localBinaryPath))
        return localBinaryPath;
    return undefined;
}
