// @ts-ignore
import Noble from '@abandonware/noble';
// @ts-ignore
import now from 'nano-time';
import { Observable, Observer } from 'rxjs';
import Device from './device';
import HexHelper from './HexHelper';
import Constants from '../constants';

interface StreamPPG {
    ppg: Observable<any>;
    hr: Observable<any>;
}

export default class Oh1 extends Device {
    deviceAddress: string;
    connected: boolean;

    constructor(
        deviceAddress: string = 'a0-9e-1a-23-ac-d0',
        name: string = 'oh1',
        address: string = 'address',
        connectable: boolean = false,
        uuid: string = 'uui',
        nobleDevice: any = null
    ) {
        super(name, address, connectable, uuid, nobleDevice);
        this.deviceAddress = deviceAddress;
        this.connected = false;
    }

    public streamPPG(): Promise<StreamPPG> {
        return new Promise((resolve, rejected) => {
            if (this.nobleDevice) {
                this.nobleDevice.connect((e: any) => {
                    if (e) {
                        return rejected(e);
                    }
                    this.nobleDevice.discoverAllServicesAndCharacteristics(
                        (
                            e: any,
                            services: Array<any>,
                            characteristics: Array<any>
                        ) => {
                            if (e) {
                                return rejected(e);
                            }
                            characteristics[17].write(
                                Buffer.from(Constants.PPG_REQUEST),
                                false,
                                this.ErrorLogger
                            );

                            let observer1: any = null;
                            let observer2: any = null;
                            characteristics[18].notify(true, () => {
                                observer1 = Observable.create(
                                    (observer: any) => {
                                        characteristics[18].on(
                                            'data',
                                            (data: any) => {
                                                let counter = 0;
                                                let sampler = [];
                                                const len = data.length;
                                                for (
                                                    let i = 10;
                                                    i < len;
                                                    i += 3
                                                ) {
                                                    const tcomplement = parseInt(
                                                        `${HexHelper.ToHex(
                                                            data[i + 2]
                                                        )}${HexHelper.ToHex(
                                                            data[i + 1]
                                                        )}${HexHelper.ToHex(
                                                            data[i]
                                                        )}`,
                                                        16
                                                    )
                                                        .toString(2)
                                                        .split('')
                                                        .map(x =>
                                                            x == '0' ? '1' : '0'
                                                        );
                                                    tcomplement.push('1');
                                                    const decimal = parseInt(
                                                        tcomplement.join(''),
                                                        2
                                                    );
                                                    switch (counter) {
                                                        case 0:
                                                            if (
                                                                decimal > 10000
                                                            ) {
                                                                sampler[0] = decimal;
                                                            }
                                                            counter++;
                                                            break;
                                                        case 1:
                                                            if (
                                                                decimal > 10000
                                                            ) {
                                                                sampler[1] = decimal;
                                                            }
                                                            counter++;
                                                            break;

                                                        case 2:
                                                            if (
                                                                decimal > 10000
                                                            ) {
                                                                sampler[2] = decimal;
                                                            }
                                                            counter++;
                                                            break;

                                                        case 3:
                                                            if (
                                                                decimal > 10000
                                                            ) {
                                                                sampler[3] = decimal;
                                                            }
                                                            if (
                                                                sampler[0] &&
                                                                sampler[1] &&
                                                                sampler[2] &&
                                                                sampler[3]
                                                            ) {
                                                                observer.next({
                                                                    PPG: sampler,
                                                                    ACLR:
                                                                        data[2],
                                                                    timestamp: Number(
                                                                        now()
                                                                    )
                                                                });
                                                            }
                                                            counter = 0;
                                                            break;
                                                    }
                                                }
                                            }
                                        );
                                    }
                                );
                            });
                            characteristics[10].notify(true, (e: any) => {
                                if (e) {
                                    return rejected(e);
                                }

                                observer2 = Observable.create(
                                    (observer: any) => {
                                        characteristics[10].on(
                                            'data',
                                            (data: any) => {
                                                observer.next(data[1]);
                                            }
                                        );
                                    }
                                );
                                return resolve({
                                    ppg: observer1,
                                    hr: observer2
                                });
                            });
                        }
                    );
                });
            } else {
                rejected(new Error('No se encontro dispositivo'));
            }
        });
    }

    public streamHr(): Observable<string> {
        return new Observable();
    }

    public Connect(
        scanTimeout: number = Constants.SCAN_TIMEOUT
    ): Promise<boolean> {
        Noble.on(Constants.STATE_CHANGE, this.StateChange);
        Noble.on(Constants.DISCOVER, (device: any) =>
            this.DeviceDiscovered(device, this)
        );
        return this.DeviceFound(scanTimeout);
    }

    private StateChange(state: any) {
        if (state === Constants.POWERED_ON) {
            Noble.startScanning();
        } else {
            Noble.stopScanning();
        }
    }

    private DeviceDiscovered(device: any, that: any): any {
        if (that.deviceAddress?.trim() == device.address?.trim()) {
            that.name = device?.advertisement?.localName;
            that.address = device.address;
            that.connectable = device.connectable;
            that.uuid = device.uuid;
            that.nobleDevice = device;
            that.connected = true;
        }
    }

    private ErrorLogger(e: any): void {
        console.log(e);
    }

    private DeviceFound(timeout: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.connected) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }, timeout);
        });
    }

    public disconnect(): boolean {
        return true;
    }
}
