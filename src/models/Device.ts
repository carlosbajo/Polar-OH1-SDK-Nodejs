// import Noble from '@abandonware/noble';
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

    generateConnection(): boolean {
        return false;
    }
}
