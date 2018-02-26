import {
  SizeStrategy,
  XsSizeStrategy,
  SmSizeStrategy,
  MdSizeStrategy,
  LgSizeStrategy,
  XlSizeStrategy
} from './size.strategy';

export class SizeStrategyFactory {
  public static createStrategy(mqAlias: string): SizeStrategy {
    if (mqAlias === 'xs') {
      return new XsSizeStrategy();
    } else if (mqAlias === 'sm') {
      return new SmSizeStrategy();
    } else if (mqAlias === 'md') {
      return new MdSizeStrategy();
    } else if (mqAlias === 'lg') {
      return new LgSizeStrategy();
    } else if (mqAlias === 'xl') {
      return new XlSizeStrategy();
    }

    return null;
  }
}
