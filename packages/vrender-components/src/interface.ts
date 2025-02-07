import type { ICustomPath2D, IGraphicAttribute, IRectGraphicAttribute } from '@visactor/vrender-core';
import type { TextContent } from './core/type';

export type Direction = 'horizontal' | 'vertical';

export type OrientType = 'top' | 'right' | 'bottom' | 'left';

export type BackgroundAttributes = {
  /**
   * 是否绘制背景层
   */
  visible: boolean;
  /**
   * 自定义路径
   * @since 0.19.19
   */
  customShape?: (
    text: Pick<TextContent, 'text'>,
    attrs: Partial<IGraphicAttribute>,
    path: ICustomPath2D
  ) => ICustomPath2D;
} & Partial<IRectGraphicAttribute>;

export type IDelayType = 'debounce' | 'throttle';

export interface ComponentOptions {
  /** skip default attributes of component */
  skipDefault?: boolean;
  /** the mode of component, only axis support 3d mode now */
  mode?: '2d' | '3d';
}
