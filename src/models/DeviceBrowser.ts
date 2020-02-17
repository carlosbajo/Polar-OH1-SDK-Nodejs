// @ts-ignore
import Noble from '@abandonware/noble';
import Device from './device';
import Constants from '../constants';

export default class DeviceBrowser {
    devices: Array<Device>;

    constructor() {
        this.devices = [];
    }

    public ConnectToDevice(
        deviceAddress: string = 'a0-9e-1a-23-ac-d0',
        scanTimeout: number = Constants.SCAN_TIMEOUT
    ): Promise<Device> {
        let deviceFound: Device;
        Noble.on(Constants.STATE_CHANGE, (state: any) => {
            if (state === Constants.POWERED_ON) {
                Noble.startScanning();
            } else {
                Noble.stopScanning();
            }
        });

        Noble.on(Constants.DISCOVER, (device: any) => {
            if (deviceAddress === device.address) {
                deviceFound = new Device(
                    device?.advertisement?.localName,
                    device.address,
                    device.connectable,
                    device.uuid,
                    device
                );
            }
        });

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Noble.stopScanning();
                if (deviceFound === null) {
                    reject(new Error('Devices not found!'));
                } else {
                    resolve(deviceFound);
                }
            }, scanTimeout);
        });
    }

    public ScanDevices(
        scanTimeout: number = Constants.SCAN_TIMEOUT
    ): Promise<Array<Device>> {
        Noble.on(Constants.STATE_CHANGE, (state: any) => {
            if (state === Constants.POWERED_ON) {
                Noble.startScanning();
            } else {
                Noble.stopScanning();
            }
        });

        Noble.on(Constants.DISCOVER, (device: any) => {
            this.devices.push(device);
        });

        return new Promise(resolve => {
            setTimeout(() => {
                Noble.stopScanning();
                resolve(this.devices);
            }, scanTimeout);
        });
    }

    public GetDevices(): Array<Device> {
        return this.devices;
    }

    public KillBrowser(): boolean {
        this.devices.forEach((device: Device) => {
            console.log(device.name, 'KILLED');
        });
        return true;
    }
}
