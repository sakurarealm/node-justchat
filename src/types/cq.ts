type cqcode =
    | 'cq:face'
    | 'cq:at'
    | 'cq:share'
    | 'cq:music'
    | 'cq:image'
    | 'cq:reply'
    | 'cq:redbag'
    | 'cq:poke'
    | 'cq:gift';
export interface CQMessage {
    function: cqcode;
}
