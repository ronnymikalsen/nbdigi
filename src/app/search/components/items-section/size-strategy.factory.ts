import {
  SizeStrategy,
  XsSizeStrategy,
  SmSizeStrategy,
  MdSizeStrategy,
  LgSizeStrategy,
  XlSizeStrategy
} from './size.strategy';
import { ObservableMedia } from '@angular/flex-layout';

export class SizeStrategyFactory {
  public static createStrategy(media: ObservableMedia): SizeStrategy {
    if (media.isActive('xs')) {
      return new XsSizeStrategy();
    } else if (media.isActive('sm')) {
      return new SmSizeStrategy();
    } else if (media.isActive('md')) {
      return new MdSizeStrategy();
    } else if (media.isActive('lg')) {
      return new LgSizeStrategy();
    } else if (media.isActive('xl')) {
      return new XlSizeStrategy();
    }

    return null;
  }
}
