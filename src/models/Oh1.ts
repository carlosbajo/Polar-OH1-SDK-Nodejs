import { Observable } from 'rxjs';
import Device from './device';

class Oh1 extends Device {
    constructor(
        name: string,
        address: string,
        connectable: boolean,
        uuid: string,
        nobleDevice: any
    ) {
        super(name, address, connectable, uuid, nobleDevice);
    }

    streamPpg(): Observable<string> {
        return new Observable();
    }
}
