export interface SizeStrategy {
  getSize(rows: number): number;
}

export class XsSizeStrategy implements SizeStrategy {
  getSize(rows: number) {
    return 6 * rows / 2;
  }
}

export class SmSizeStrategy implements SizeStrategy {
  getSize(rows: number) {
    return 10 * rows / 2;
  }
}

export class MdSizeStrategy implements SizeStrategy {
  getSize(rows: number) {
    return 10 * rows / 2;
  }
}

export class LgSizeStrategy implements SizeStrategy {
  getSize(rows: number) {
    return 16 * rows / 2;
  }
}

export class XlSizeStrategy implements SizeStrategy {
  getSize(rows: number) {
    return 20 * rows / 2;
  }
}
