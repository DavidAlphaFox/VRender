import { injectable } from 'inversify';
import type { ICanvas, CanvasConfigType, EnvType } from '../../../interface';
import { BaseCanvas } from '../base-canvas';
import { WxContext2d } from './context';

@injectable()
export class WxCanvas extends BaseCanvas implements ICanvas {
  static env: EnvType = 'wx';

  /**
   * 通过canvas生成一个wrap对象，初始化时不会再设置canvas的属性
   * @param params
   */
  constructor(params: CanvasConfigType) {
    super(params);
  }

  init() {
    this._context = new WxContext2d(this, this._dpr);
  }

  release(...params: any): void {
    return;
  }
}
