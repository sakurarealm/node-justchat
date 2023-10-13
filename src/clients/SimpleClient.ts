import EventEmitter from 'node:events';

export default class SimpleClient extends EventEmitter {
    public name: string;
    public uuid: string;
    public SID: number;

    constructor(name: string = '', uuid: string = '', SID: number = 1) {
        super();
        this.name = name;
        this.uuid = uuid;
        this.SID = SID;
    }
}
