export interface SizeStrategy {
  getSize(): number;
}

export class XsSizeStrategy implements SizeStrategy {
  getSize() {
    return 4;
  }
}

export class SmSizeStrategy implements SizeStrategy {
  getSize() {
    return 10;
  }
}

export class MdSizeStrategy implements SizeStrategy {
  getSize() {
    return 16;
  }
}

export class LgSizeStrategy implements SizeStrategy {
  getSize() {
    return 20;
  }
}

export class XlSizeStrategy implements SizeStrategy {
  getSize() {
    return 20;
  }
}
