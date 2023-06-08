import { IAABBBounds, isArray } from '@visactor/vutils';
import { injectable } from 'inversify';
import {
  IGraphicAttribute,
  IContext2d,
  IMarkAttribute,
  IRect,
  IRectGraphicAttribute,
  IThemeAttribute
} from '../../../../interface';
import { createRectPath, getScaledStroke } from '../../../../common';
import {
  BaseRenderContributionTime,
  DefaultBaseBackgroundRenderContribution,
  DefaultBaseTextureRenderContribution,
  IBaseRenderContribution
} from './base-contribution-render';

export const RectRenderContribution = Symbol.for('RectRenderContribution');

export interface IRectRenderContribution extends IBaseRenderContribution {
  drawShape: (
    rect: IRect,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    rectAttribute: Required<IRectGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    doFillOrStroke?: { doFill: boolean; doStroke: boolean }
  ) => void;
}

@injectable()
export class DefaultRectRenderContribution implements IRectRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle: boolean = true;
  order: number = 0;
  drawShape(
    rect: IRect,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    rectAttribute: Required<IRectGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean
  ) {
    const {
      width = rectAttribute.width,
      height = rectAttribute.height,
      borderRadius = rectAttribute.borderRadius,
      opacity = rectAttribute.opacity,
      outerBorder,
      innerBorder
    } = rect.attribute;

    if (outerBorder) {
      const { distance = rectAttribute.outerBorder.distance } = outerBorder;
      const d = getScaledStroke(context, distance as number, context.dpr);
      const nextX = x - d;
      const nextY = y - d;
      const dw = d * 2;
      if (borderRadius === 0 || (isArray(borderRadius) && (<number[]>borderRadius).every(num => num === 0))) {
        // 不需要处理圆角
        context.beginPath();
        context.rect(nextX, nextY, width + dw, height + dw);
      } else {
        context.beginPath();

        // 测试后，cache对于重绘性能提升不大，但是在首屏有一定性能损耗，因此rect不再使用cache
        createRectPath(context, nextX, nextY, width + dw, height + dw, borderRadius);
      }

      // shadow
      context.setShadowStyle && context.setShadowStyle(rect, rect.attribute, rectAttribute);

      if (strokeCb) {
        strokeCb(context, outerBorder, rectAttribute.outerBorder);
      } else if (sVisible) {
        // 存在stroke
        const lastOpacity = (rectAttribute.outerBorder as any).opacity;
        (rectAttribute.outerBorder as any).opacity = opacity;
        context.setStrokeStyle(rect, outerBorder, x, y, rectAttribute.outerBorder as any);
        (rectAttribute.outerBorder as any).opacity = lastOpacity;
        context.stroke();
      }
    }

    if (innerBorder) {
      const { distance = rectAttribute.innerBorder.distance } = innerBorder;
      const d = getScaledStroke(context, distance as number, context.dpr);
      const nextX = x + d;
      const nextY = y + d;
      const dw = d * 2;
      if (borderRadius === 0 || (isArray(borderRadius) && (<number[]>borderRadius).every(num => num === 0))) {
        // 不需要处理圆角
        context.beginPath();
        context.rect(nextX, nextY, width - dw, height - dw);
      } else {
        context.beginPath();

        // 测试后，cache对于重绘性能提升不大，但是在首屏有一定性能损耗，因此rect不再使用cache
        createRectPath(context, nextX, nextY, width - dw, height - dw, borderRadius);
      }

      // shadow
      context.setShadowStyle && context.setShadowStyle(rect, rect.attribute, rectAttribute);

      if (strokeCb) {
        strokeCb(context, innerBorder, rectAttribute.innerBorder);
      } else if (sVisible) {
        // 存在stroke
        const lastOpacity = (rectAttribute.innerBorder as any).opacity;
        (rectAttribute.innerBorder as any).opacity = opacity;
        context.setStrokeStyle(rect, innerBorder, x, y, rectAttribute.innerBorder as any);
        (rectAttribute.innerBorder as any).opacity = lastOpacity;
        context.stroke();
      }
    }
  }
}

@injectable()
export class DefaultRectBackgroundRenderContribution
  extends DefaultBaseBackgroundRenderContribution
  implements IRectRenderContribution
{
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
}

@injectable()
export class DefaultRectTextureRenderContribution
  extends DefaultBaseTextureRenderContribution
  implements IRectRenderContribution
{
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
}

@injectable()
export class SplitRectBeforeRenderContribution implements IRectRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
  useStyle: boolean = true;
  order: number = 0;
  drawShape(
    group: IRect,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IRectGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    doFillOrStroke?: { doFill: boolean; doStroke: boolean }
  ) {
    const { stroke = groupAttribute.stroke } = group.attribute as any;

    // 数组且存在为false的项目，那就不绘制
    if (Array.isArray(stroke) && stroke.some(s => s === false)) {
      doFillOrStroke.doStroke = false;
    }
  }
}

@injectable()
export class SplitRectAfterRenderContribution implements IRectRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle: boolean = true;
  order: number = 0;
  drawShape(
    rect: IRect,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    groupAttribute: Required<IRectGraphicAttribute>,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean
  ) {
    const {
      width = groupAttribute.width,
      height = groupAttribute.height,
      stroke = groupAttribute.stroke
    } = rect.attribute as any;

    // 不是数组
    if (!(Array.isArray(stroke) && stroke.some(s => s === false))) {
      return;
    }

    context.setStrokeStyle(rect, rect.attribute, x, y, groupAttribute);
    // 单独处理每条边界，目前不考虑圆角
    context.beginPath();
    context.moveTo(x, y);
    // top
    if (stroke[0]) {
      context.lineTo(x + width, y);
    } else {
      context.moveTo(x + width, y);
    }
    // right
    if (stroke[1]) {
      context.lineTo(x + width, y + height);
    } else {
      context.moveTo(x + width, y + height);
    }
    // bottom
    if (stroke[2]) {
      context.lineTo(x, y + height);
    } else {
      context.moveTo(x, y + height);
    }
    // left
    if (stroke[3]) {
      // 没有close path是，起点和终点不连续，需要调整y保证不出现缺口
      const adjustY = stroke[0] ? y - context.lineWidth / 2 : y;
      context.lineTo(x, adjustY);
    } else {
      context.moveTo(x, y);
    }

    context.stroke();
  }
}
