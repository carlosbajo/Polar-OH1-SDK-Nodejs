// @ts-ignore
import Constants from '../constants';

export default class Device {
    name: string;
    address: string;
    connectable: boolean;
    uuid: string;
    nobleDevice: any;

    constructor(
        name: string,
        address: string,
        connectable: boolean,
        uuid: string,
        nobleDevice: any
    ) {
        this.name = name;
        this.uuid = uuid;
        this.address = address;
        this.connectable = connectable;
        this.nobleDevice = nobleDevice;
    }

    public Connect(
        scanTimeout: number = Constants.SCAN_TIMEOUT
    ): Promise<boolean> {
        return new Promise(() => {});
    }

    disconnect(): boolean {
        return true;
    }
}
