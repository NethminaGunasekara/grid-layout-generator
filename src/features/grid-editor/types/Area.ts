import SelfAlignment from "./SelfAlignment";

export default interface Area {
  id: string;
  rowStart: number;
  columnStart: number;
  rowEnd: number;
  columnEnd: number;
  alignSelf?: SelfAlignment;
  justifySelf?: SelfAlignment;
  backgroundColor: string;
}
