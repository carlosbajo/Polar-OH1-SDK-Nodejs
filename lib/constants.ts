export default class Constants {
    static readonly STATE_CHANGE: string = 'stateChange';
    static readonly POWERED_ON: string = 'poweredOn';
    static readonly DISCOVER: string = 'discover';

    static readonly SCAN_TIMEOUT: number = 5000;

    static readonly CHANGE_POINT_CHARACTERISTIC: number = 17;
    static readonly LISTENER_POINT_CHARACTERISTIC: number = 18;

    static readonly DATA: string = 'data';

    static readonly PPG_REQUEST: Array<any> = [
        0x02,
        0x01,
        0x00,
        0x01,
        0x82,
        0x00,
        0x01,
        0x01,
        0x16,
        0x00,
        0x02,
        0x01,
        0x08,
        0x00
    ];
}
