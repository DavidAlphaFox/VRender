import type { IRectGraphicAttribute } from '@visactor/vrender-core';

export type Direction = 'horizontal' | 'vertical';

export type OrientType = 'top' | 'right' | 'bottom' | 'left';

export type BackgroundAttributes = {
  /**
   * 是否绘制背景层
   */
  visible: boolean;
} & Partial<IRectGraphicAttribute>;

export type IDelayType = 'debounce' | 'throttle';
