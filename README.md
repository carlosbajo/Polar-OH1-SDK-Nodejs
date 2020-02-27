# Polar OH1 SDK for Nodejs

<img src="https://img.shields.io/aur/license/android-studio"/> <img src="https://img.shields.io/github/contributors/carlosbajo/Polar-OH1-SDK---Nodejs"/> <img src="https://img.shields.io/github/languages/top/carlosbajo/Polar-OH1-SDK---Nodejs"/>

# Description

The library uses Rxjs to stream the data from the band, so the library implementation it's very simple.

# Typescript example

```javascript
const { deviceManager } = require('polar-oh1-sdk');

(async function main() {
    // Device address, you can get this from some bluetooth scan
    const oh1 = await deviceManager.DeviceOH1('a0-9e-1a-23-ac-d0');
    // Connect to the device you can pass timeout to the connect function: default 5s
    // await oh1.Connect(5000)
    await oh1.Connect();
    // Stream function returns two Observable objects in this case, for oh1 hr and ppg
    const { hr, ppg } = await oh1.Stream();
    hr.subscribe(data => {});
    ppg.subscribe(data => {});
})();
```
