export default class HexHelper {
    public static ToHex(val: any): string {
        if (val) {
            return String(val.toString(16)).padStart(2, '0');
        }
        return '';
    }
}
