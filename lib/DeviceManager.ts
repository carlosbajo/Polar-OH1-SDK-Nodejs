import Oh1 from './Oh1';

export default class DeviceManager {
    constructor() {}

    public DeviceOH1(deviceAddress: string): Oh1 {
        return new Oh1(deviceAddress);
    }
}
