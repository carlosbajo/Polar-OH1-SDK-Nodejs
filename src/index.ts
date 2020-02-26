import DeviceManager from './models/DeviceManager';
import Oh1 from './models/Oh1';

async function main() {
    try {
        const dmanager = new DeviceManager();
        const oh1Device: Oh1 = await dmanager.DeviceOH1();
        const result: boolean = await oh1Device.Connect();

        if (result) {
            const { hr, ppg } = await oh1Device.streamPPG();

            hr.subscribe(sample => {
                console.log(sample);
            });

            ppg.subscribe({
                next: data => {
                    console.log(data);
                }
            });
        }
    } catch (e) {
        console.log(e);
        console.log('Error ocurred');
    }
}
main();
