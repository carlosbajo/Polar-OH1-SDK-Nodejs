# Polar OH1 SDK for Nodejs

<img src="https://img.shields.io/aur/license/android-studio"/> <img src="https://img.shields.io/github/contributors/carlosbajo/Polar-OH1-SDK---Nodejs"/> <img src="https://img.shields.io/github/languages/top/carlosbajo/Polar-OH1-SDK---Nodejs"/>

# Description

The library uses Rxjs to stream the data from the band, so the library implementation it's very simple.

# Typescript example

```Typescript
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
```
