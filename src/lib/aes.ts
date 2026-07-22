import { AESTraceResult, RoundKeyStep, StateMatrixStep } from '../types';

// Standard AES S-Box
export const SBOX: number[] = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

// Inverse S-Box (for Decryption)
export const INV_SBOX: number[] = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];

// Round Constants
export const RCON: number[] = [
  0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36
];

// Galois Field multiplication GF(2^8)
export function gmul(a: number, b: number): number {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if ((b & 1) !== 0) {
      p ^= a;
    }
    const hiBitSet = (a & 0x80) !== 0;
    a = (a << 1) & 0xff;
    if (hiBitSet) {
      a ^= 0x1b; // Rijndael irreducible polynomial x^8 + x^4 + x^3 + x + 1
    }
    b >>= 1;
  }
  return p & 0xff;
}

// Helper to convert string to 16-byte array (padded with zeros or spaces if needed)
export function parseInputBytes(input: string, isHex = false): number[] {
  const bytes: number[] = [];
  if (isHex) {
    const cleanHex = input.replace(/[^0-9a-fA-F]/g, '');
    for (let i = 0; i < 32; i += 2) {
      if (i < cleanHex.length) {
        bytes.push(parseInt(cleanHex.substring(i, i + 2), 16) || 0);
      } else {
        bytes.push(0);
      }
    }
  } else {
    for (let i = 0; i < 16; i++) {
      if (i < input.length) {
        bytes.push(input.charCodeAt(i));
      } else {
        bytes.push(0); // zero padding
      }
    }
  }
  return bytes.slice(0, 16);
}

// Convert 16-byte array to 4x4 matrix (Column-Major Order)
export function bytesToMatrix(bytes: number[]): number[][] {
  const matrix: number[][] = Array(4).fill(0).map(() => Array(4).fill(0));
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      matrix[row][col] = bytes[col * 4 + row] || 0;
    }
  }
  return matrix;
}

// Convert 4x4 column-major matrix back to 16-byte array
export function matrixToBytes(matrix: number[][]): number[] {
  const bytes: number[] = new Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      bytes[col * 4 + row] = matrix[row][col];
    }
  }
  return bytes;
}

// Convert byte array to hex string formatted
export function bytesToHex(bytes: number[], uppercase = true): string {
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function bytesToHexFormatted(bytes: number[]): string {
  return bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

export function bytesToAscii(bytes: number[]): string {
  return bytes.map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('');
}

// Deep clone 4x4 matrix
export function cloneMatrix(matrix: number[][]): number[][] {
  return matrix.map(row => [...row]);
}

// Key Expansion Algorithm
export function expandKey(keyBytes: number[]): RoundKeyStep[] {
  // 44 words of 4 bytes each
  const w: number[][] = Array(44).fill(0).map(() => [0, 0, 0, 0]);

  // First 4 words are the key itself
  for (let i = 0; i < 4; i++) {
    w[i] = [keyBytes[i * 4], keyBytes[i * 4 + 1], keyBytes[i * 4 + 2], keyBytes[i * 4 + 3]];
  }

  const roundKeySteps: RoundKeyStep[] = [];

  // First Round Key 0
  const rk0Words = [w[0], w[1], w[2], w[3]];
  roundKeySteps.push({
    round: 0,
    words: rk0Words,
    roundKeyMatrix: bytesToMatrix(rk0Words.flat())
  });

  for (let i = 4; i < 44; i++) {
    let temp = [...w[i - 1]];

    let tempWordBefore: number[] | undefined;
    let rotWord: number[] | undefined;
    let subWord: number[] | undefined;
    let rconVal: number[] | undefined;
    let rconXorResult: number[] | undefined;

    if (i % 4 === 0) {
      tempWordBefore = [...temp];
      // RotWord: cyclic left shift
      rotWord = [temp[1], temp[2], temp[3], temp[0]];
      // SubWord: S-Box substitution
      subWord = rotWord.map(b => SBOX[b]);
      // Rcon XOR
      const rconIndex = Math.floor(i / 4);
      rconVal = [RCON[rconIndex], 0x00, 0x00, 0x00];
      rconXorResult = [
        subWord[0] ^ rconVal[0],
        subWord[1] ^ rconVal[1],
        subWord[2] ^ rconVal[2],
        subWord[3] ^ rconVal[3]
      ];
      temp = rconXorResult;
    }

    w[i] = [
      w[i - 4][0] ^ temp[0],
      w[i - 4][1] ^ temp[1],
      w[i - 4][2] ^ temp[2],
      w[i - 4][3] ^ temp[3]
    ];

    if (i % 4 === 3) {
      const rNum = Math.floor(i / 4);
      const roundWords = [w[i - 3], w[i - 2], w[i - 1], w[i]];
      roundKeySteps.push({
        round: rNum,
        words: roundWords,
        tempWordBefore,
        rotWord,
        subWord,
        rcon: rconVal,
        rconXorResult,
        roundKeyMatrix: bytesToMatrix(roundWords.flat())
      });
    }
  }

  return roundKeySteps;
}

// AES-128 Encryption Simulator & Tracer
export function runAESTrace(plaintextBytes: number[], keyBytes: number[]): AESTraceResult {
  const roundKeySteps = expandKey(keyBytes);
  const steps: StateMatrixStep[] = [];
  let stepIdx = 0;

  let state = bytesToMatrix(plaintextBytes);

  // Step 0: Initial State
  steps.push({
    round: 0,
    stepIndex: stepIdx++,
    operation: 'initial',
    title: 'Initial Plaintext State Matrix',
    description: 'The 16-byte plaintext input is loaded into a 4x4 byte matrix in column-major order.',
    mathDetail: `Input: ${bytesToHexFormatted(plaintextBytes)}`,
    state: cloneMatrix(state),
    roundKey: roundKeySteps[0].roundKeyMatrix
  });

  // Step 1: AddRoundKey (Round 0)
  const rk0 = roundKeySteps[0].roundKeyMatrix;
  const prevState0 = cloneMatrix(state);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      state[r][c] ^= rk0[r][c];
    }
  }

  steps.push({
    round: 0,
    stepIndex: stepIdx++,
    operation: 'addRoundKey',
    title: 'Round 0: Initial AddRoundKey',
    description: 'Each byte of the 4x4 State matrix is combined with the corresponding byte of the Round 0 Key using bitwise XOR (⊕).',
    mathDetail: 'State[r,c] = State[r,c] ⊕ Key_0[r,c]',
    state: cloneMatrix(state),
    prevState: prevState0,
    roundKey: rk0
  });

  // Rounds 1 to 9
  for (let r = 1; r <= 9; r++) {
    const currentRoundKey = roundKeySteps[r].roundKeyMatrix;

    // 1. SubBytes
    const prevSub = cloneMatrix(state);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        state[row][col] = SBOX[state[row][col]];
      }
    }
    steps.push({
      round: r,
      stepIndex: stepIdx++,
      operation: 'subBytes',
      title: `Round ${r}: SubBytes Transformation`,
      description: 'Non-linear byte substitution where each byte is replaced with another byte according to the AES S-Box lookup table.',
      mathDetail: 'State[r,c] = SBox[State[r,c]]',
      state: cloneMatrix(state),
      prevState: prevSub,
      roundKey: currentRoundKey
    });

    // 2. ShiftRows
    const prevShift = cloneMatrix(state);
    const shifted = cloneMatrix(state);
    // Row 0: no shift
    // Row 1: left shift 1
    shifted[1][0] = state[1][1];
    shifted[1][1] = state[1][2];
    shifted[1][2] = state[1][3];
    shifted[1][3] = state[1][0];
    // Row 2: left shift 2
    shifted[2][0] = state[2][2];
    shifted[2][1] = state[2][3];
    shifted[2][2] = state[2][0];
    shifted[2][3] = state[2][1];
    // Row 3: left shift 3
    shifted[3][0] = state[3][3];
    shifted[3][1] = state[3][0];
    shifted[3][2] = state[3][1];
    shifted[3][3] = state[3][2];
    state = shifted;

    steps.push({
      round: r,
      stepIndex: stepIdx++,
      operation: 'shiftRows',
      title: `Round ${r}: ShiftRows Transformation`,
      description: 'The bytes in each row of the State matrix are cyclically shifted to the left by row index offsets (0, 1, 2, 3 positions).',
      mathDetail: 'Row 0: no shift | Row 1: <<1 | Row 2: <<2 | Row 3: <<3',
      state: cloneMatrix(state),
      prevState: prevShift,
      roundKey: currentRoundKey,
      highlightRows: [1, 2, 3]
    });

    // 3. MixColumns
    const prevMix = cloneMatrix(state);
    const mixed = cloneMatrix(state);
    for (let c = 0; c < 4; c++) {
      const s0 = state[0][c];
      const s1 = state[1][c];
      const s2 = state[2][c];
      const s3 = state[3][c];

      mixed[0][c] = gmul(s0, 2) ^ gmul(s1, 3) ^ s2 ^ s3;
      mixed[1][c] = s0 ^ gmul(s1, 2) ^ gmul(s2, 3) ^ s3;
      mixed[2][c] = s0 ^ s1 ^ gmul(s2, 2) ^ gmul(s3, 3);
      mixed[3][c] = gmul(s0, 3) ^ s1 ^ s2 ^ gmul(s3, 2);
    }
    state = mixed;

    steps.push({
      round: r,
      stepIndex: stepIdx++,
      operation: 'mixColumns',
      title: `Round ${r}: MixColumns Transformation`,
      description: 'Each column of the State matrix is multiplied by a fixed polynomial matrix in Galois Field GF(2^8) to scramble data vertically.',
      mathDetail: 'C\' = [2 3 1 1; 1 2 3 1; 1 1 2 3; 3 1 1 2] × C in GF(2^8)',
      state: cloneMatrix(state),
      prevState: prevMix,
      roundKey: currentRoundKey
    });

    // 4. AddRoundKey
    const prevAddKey = cloneMatrix(state);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        state[row][col] ^= currentRoundKey[row][col];
      }
    }

    steps.push({
      round: r,
      stepIndex: stepIdx++,
      operation: 'addRoundKey',
      title: `Round ${r}: AddRoundKey Transformation`,
      description: `State is XORed with the Round ${r} key generated during key expansion.`,
      mathDetail: `State[r,c] = State[r,c] ⊕ Key_${r}[r,c]`,
      state: cloneMatrix(state),
      prevState: prevAddKey,
      roundKey: currentRoundKey
    });
  }

  // Round 10 (Final Round - No MixColumns!)
  const r10Key = roundKeySteps[10].roundKeyMatrix;

  // 1. SubBytes (Round 10)
  const prevSub10 = cloneMatrix(state);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      state[row][col] = SBOX[state[row][col]];
    }
  }
  steps.push({
    round: 10,
    stepIndex: stepIdx++,
    operation: 'subBytes',
    title: 'Round 10: Final SubBytes Transformation',
    description: 'Final substitution round using the S-Box table.',
    mathDetail: 'State[r,c] = SBox[State[r,c]]',
    state: cloneMatrix(state),
    prevState: prevSub10,
    roundKey: r10Key
  });

  // 2. ShiftRows (Round 10)
  const prevShift10 = cloneMatrix(state);
  const shifted10 = cloneMatrix(state);
  shifted10[1][0] = state[1][1]; shifted10[1][1] = state[1][2]; shifted10[1][2] = state[1][3]; shifted10[1][3] = state[1][0];
  shifted10[2][0] = state[2][2]; shifted10[2][1] = state[2][3]; shifted10[2][2] = state[2][0]; shifted10[2][3] = state[2][1];
  shifted10[3][0] = state[3][3]; shifted10[3][1] = state[3][0]; shifted10[3][2] = state[3][1]; shifted10[3][3] = state[3][2];
  state = shifted10;

  steps.push({
    round: 10,
    stepIndex: stepIdx++,
    operation: 'shiftRows',
    title: 'Round 10: Final ShiftRows Transformation',
    description: 'Final cyclic row shift prior to the last key addition.',
    mathDetail: 'Row 0: 0 | Row 1: <<1 | Row 2: <<2 | Row 3: <<3',
    state: cloneMatrix(state),
    prevState: prevShift10,
    roundKey: r10Key,
    highlightRows: [1, 2, 3]
  });

  // 3. AddRoundKey (Round 10 - Final)
  const prevAddKey10 = cloneMatrix(state);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      state[row][col] ^= r10Key[row][col];
    }
  }

  steps.push({
    round: 10,
    stepIndex: stepIdx++,
    operation: 'finalCiphertext',
    title: 'Final Ciphertext Output (Round 10 AddRoundKey)',
    description: 'The final 16-byte state matrix is extracted column-by-column to yield the complete AES ciphertext.',
    mathDetail: `Ciphertext Hex: ${bytesToHexFormatted(matrixToBytes(state))}`,
    state: cloneMatrix(state),
    prevState: prevAddKey10,
    roundKey: r10Key
  });

  const ciphertextBytes = matrixToBytes(state);

  return {
    plaintextHex: bytesToHex(plaintextBytes),
    keyHex: bytesToHex(keyBytes),
    ciphertextHex: bytesToHex(ciphertextBytes),
    steps,
    roundKeys: roundKeySteps
  };
}

// Preset Example Datasets
export const PRESET_EXAMPLES = [
  {
    id: 'hello-world',
    name: 'Hello World!',
    plaintext: 'HELLO WORLD 2026',
    key: 'AES SECRET KEY!!',
    description: 'Standard 16-character ASCII text string test.'
  },
  {
    id: 'nist-official',
    name: 'NIST Standard Test Vector',
    plaintext: '32 43 f6 a8 88 5a 30 8d 31 31 98 a2 e0 37 07 34',
    key: '2b 7e 15 16 28 ae d2 a6 ab f7 15 88 09 cf 4f 3c',
    description: 'Official test vector from NIST FIPS 197 specification.'
  },
  {
    id: 'crypto-2026',
    name: 'Cybersecurity 101',
    plaintext: 'AES Visualization',
    key: 'MasterKeyAES128!',
    description: 'Sample educational encryption walkthrough.'
  },
  {
    id: 'zero-vector',
    name: 'All Zeros Vector',
    plaintext: '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00',
    key: '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00',
    description: 'Zero plaintext and key to test algorithm mechanics.'
  }
];
