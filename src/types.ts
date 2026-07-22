export type NavigationTab = 'home' | 'basics' | 'visualization' | 'documentation' | 'login';

export type AESMode = 'encrypt' | 'decrypt';

export type DisplayFormat = 'hex' | 'dec' | 'ascii' | 'binary';

export interface StateMatrixStep {
  round: number; // 0 to 10
  stepIndex: number; // overall index in the trace
  operation: 'initial' | 'addRoundKey' | 'subBytes' | 'shiftRows' | 'mixColumns' | 'finalCiphertext';
  title: string;
  description: string;
  mathDetail: string;
  state: number[][]; // 4x4 matrix of byte values (column-major standard order)
  prevState?: number[][];
  roundKey: number[][]; // 4x4 round key matrix
  highlightRows?: number[];
  highlightCols?: number[];
  activeCell?: [number, number];
}

export interface RoundKeyStep {
  round: number;
  words: number[][]; // 4 words of 4 bytes each
  tempWordBefore?: number[];
  rotWord?: number[];
  subWord?: number[];
  rcon?: number[];
  rconXorResult?: number[];
  roundKeyMatrix: number[][]; // 4x4 column-major format
}

export interface AESTraceResult {
  plaintextHex: string;
  keyHex: string;
  ciphertextHex: string;
  steps: StateMatrixStep[];
  roundKeys: RoundKeyStep[];
}

export interface PresetExample {
  id: string;
  name: string;
  plaintext: string;
  key: string;
  description: string;
}
