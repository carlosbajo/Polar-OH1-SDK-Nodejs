import DeviceManager from './models/DeviceManager';

async function main() {
    try {
        const dmanager = new DeviceManager();
        const oh1Device = await dmanager.DeviceOH1();
        await oh1Device.Connect();
    } catch (e) {
        console.log('Error ocurred');
    }
}
main();
