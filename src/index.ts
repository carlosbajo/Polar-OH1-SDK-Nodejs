import DeviceBrowser from './models/DeviceBrowser';

async function main() {
    const deviceBrowser = new DeviceBrowser();
    const device = await deviceBrowser.ConnectToDevice();
}
main();
