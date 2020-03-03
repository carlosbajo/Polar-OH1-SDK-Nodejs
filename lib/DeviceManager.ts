import Oh1 from './Oh1';

export default class DeviceManager {
    constructor() {}

    public DeviceOH1(deviceAddress: string = 'a0-9e-1a-23-ac-d0'): Oh1 {
        return new Oh1(deviceAddress);
    }
}
