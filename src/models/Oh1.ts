// @ts-ignore
import Noble from '@abandonware/noble';
import { Observable, Observer } from 'rxjs';
import Device from './device';
import Constants from '../constants';

export default class Oh1 extends Device {
    public deviceAddress: string;
    public connected: boolean;

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

    public streamPPG(): Promise<Observable<any>> {
        if (this.nobleDevice) {
            return new Promise(async (resolved, rejected) => {
                this.nobleDevice.connect((err: any) => {
                    if (err) return rejected(err);
                    this.nobleDevice.discoverAllServicesAndCharacteristics(
                        (
                            e: any,
                            services: Array<any>,
                            characteristics: Array<any>
                        ) => {
                            if (e) {
                                return rejected(e);
                            } else {
                                this.AllServicesAndCharacteristics(
                                    services,
                                    characteristics
                                );
                            }
                        }
                    );
                });
            });
        }
    }

    public streamHr(): Observable<string> {
        return new Observable();
    }

    public Connectd(
        scanTimeout: number = Constants.SCAN_TIMEOUT
    ): Promise<boolean> {
        Noble.on(Constants.STATE_CHANGE, this.StateChange);
        Noble.on(Constants.DISCOVER, this.DeviceDiscovered);
        return this.DeviceFound(scanTimeout);
    }

    private StateChange(state: any) {
        if (state === Constants.POWERED_ON) {
            Noble.startScanning();
        } else {
            Noble.stopScanning();
        }
    }

    private DeviceDiscovered(device: any): any {
        if (this.deviceAddress === device.address) {
            this.name = device?.advertisement?.localName;
            this.address = device.address;
            this.connectable = device.connectable;
            this.uuid = device.uuid;
            this.nobleDevice = device;
            this.connected = true;
        }
    }

    private AllServicesAndCharacteristics(
        services: Array<any>,
        characteristics: Array<any>
    ): Promise<Observable<any>> {
        characteristics[Constants.CHANGE_POINT_CHARACTERISTIC].write(
            Buffer.from(Constants.PPG_REQUEST),
            false,
            this.ErrorLogger
        );

        return new Promise((resolved, rejected) => {
            characteristics[Constants.LISTENER_POINT_CHARACTERISTIC].notify(
                true,
                (e: any) => {
                    if (e) {
                        return rejected(e);
                    } else {
                        Observable.create((observer: any) => {
                            characteristics[
                                Constants.LISTENER_POINT_CHARACTERISTIC
                            ].on(Constants.DATA, (data: any) => {});
                        });
                    }
                }
            );
        });
    }

    private ErrorLogger(e: any): void {
        console.log(e);
    }

    private DeviceFound(timeout: number): Promise<boolean> {
        return new Promise((reject, resolve) => {
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
