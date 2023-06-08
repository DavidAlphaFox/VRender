import { IAABBBounds, isArray } from '@visactor/vutils';
import { injectable } from 'inversify';
import {
  IGraphicAttribute,
  IContext2d,
  IMarkAttribute,
  ISymbol,
  ISymbolGraphicAttribute,
  IThemeAttribute
} from '../../../../interface';
import { getScaledStroke } from '../../../../common/canvas-utils';
import {
  BaseRenderContributionTime,
  DefaultBaseBackgroundRenderContribution,
  DefaultBaseTextureRenderContribution,
  IBaseRenderContribution
} from './base-contribution-render';

export const SymbolRenderContribution = Symbol.for('SymbolRenderContribution');

export interface ISymbolRenderContribution extends IBaseRenderContribution {
  drawShape: (
    symbol: ISymbol,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    symbolAttribute: Required<ISymbolGraphicAttribute>,
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
  ) => void;
}

@injectable()
export class DefaultSymbolRenderContribution implements ISymbolRenderContribution {
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
  useStyle: boolean = true;
  order: number = 0;
  drawShape(
    symbol: ISymbol,
    context: IContext2d,
    x: number,
    y: number,
    doFill: boolean,
    doStroke: boolean,
    fVisible: boolean,
    sVisible: boolean,
    symbolAttribute: Required<ISymbolGraphicAttribute>,
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
      size = symbolAttribute.size,
      opacity = symbolAttribute.opacity,
      outerBorder,
      innerBorder
    } = symbol.attribute;

    const parsedPath = symbol.getParsedPath();
    // todo: 考虑使用path
    if (!parsedPath) {
      return;
    }

    if (outerBorder) {
      const { distance = symbolAttribute.outerBorder.distance } = outerBorder;
      const d = getScaledStroke(context, distance as number, context.dpr);

      context.beginPath();
      if (parsedPath.drawOffset(context, size, x, y, d) === false) {
        context.closePath();
      }

      // shadow
      context.setShadowStyle && context.setShadowStyle(symbol, symbol.attribute, symbolAttribute);

      if (strokeCb) {
        strokeCb(context, outerBorder, symbolAttribute.outerBorder);
      } else if (sVisible) {
        // 存在stroke
        const lastOpacity = (symbolAttribute.outerBorder as any).opacity;
        (symbolAttribute.outerBorder as any).opacity = opacity;
        context.setStrokeStyle(symbol, outerBorder, x, y, symbolAttribute.outerBorder as any);
        (symbolAttribute.outerBorder as any).opacity = lastOpacity;
        context.stroke();
      }
    }

    if (innerBorder) {
      const { distance = symbolAttribute.innerBorder.distance } = innerBorder;
      const d = getScaledStroke(context, distance as number, context.dpr);

      context.beginPath();
      if (parsedPath.drawOffset(context, size, x, y, -d) === false) {
        context.closePath();
      }

      // shadow
      context.setShadowStyle && context.setShadowStyle(symbol, symbol.attribute, symbolAttribute);

      if (strokeCb) {
        strokeCb(context, innerBorder, symbolAttribute.innerBorder);
      } else if (sVisible) {
        // 存在stroke
        const lastOpacity = (symbolAttribute.innerBorder as any).opacity;
        (symbolAttribute.innerBorder as any).opacity = opacity;
        context.setStrokeStyle(symbol, innerBorder, x, y, symbolAttribute.innerBorder as any);
        (symbolAttribute.innerBorder as any).opacity = lastOpacity;
        context.stroke();
      }
    }
  }
}

export class DefaultSymbolBackgroundRenderContribution
  extends DefaultBaseBackgroundRenderContribution
  implements ISymbolRenderContribution
{
  time: BaseRenderContributionTime = BaseRenderContributionTime.beforeFillStroke;
}

export class DefaultSymbolTextureRenderContribution
  extends DefaultBaseTextureRenderContribution
  implements ISymbolRenderContribution
{
  time: BaseRenderContributionTime = BaseRenderContributionTime.afterFillStroke;
}
