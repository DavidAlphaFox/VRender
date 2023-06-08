import { isArray } from '@visactor/vutils';
import { inject, injectable, named } from 'inversify';
import { POLYGON_NUMBER_TYPE } from '../../../graphic/polygon';
import { getTheme } from '../../../graphic/theme';
import type { IGraphicAttribute, IContext2d, IMarkAttribute, IPolygon, IThemeAttribute } from '../../../interface';
import type { IDrawContext, IRenderService } from '../../render-service';
import type { IGraphicRender, IGraphicRenderDrawParams } from './graphic-render';
import { drawPolygon, drawRoundedPolygon } from '../../../common/polygon';
import { drawPathProxy, fillVisible, runFill, runStroke, strokeVisible } from './utils';
import type { IPolygonRenderContribution } from './contributions/polygon-contribution-render';
import { PolygonRenderContribution } from './contributions/polygon-contribution-render';
import type { IContributionProvider } from '../../../common/contribution-provider';
import { ContributionProvider } from '../../../common/contribution-provider';
import { BaseRenderContributionTime } from './contributions/base-contribution-render';

@injectable()
export class DefaultCanvasPolygonRender implements IGraphicRender {
  type: 'polygon';
  numberType: number = POLYGON_NUMBER_TYPE;

  protected _polygonRenderContribitions: IPolygonRenderContribution[];

  constructor(
    @inject(ContributionProvider)
    @named(PolygonRenderContribution)
    protected readonly polygonRenderContribitions: IContributionProvider<IPolygonRenderContribution>
  ) {}

  drawShape(
    polygon: IPolygon,
    context: IContext2d,
    x: number,
    y: number,
    drawContext: IDrawContext,
    params?: IGraphicRenderDrawParams,
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
    // const polygonAttribute = graphicService.themeService.getCurrentTheme().polygonAttribute;
    const polygonAttribute = getTheme(polygon, params?.theme).polygon;
    const {
      points = polygonAttribute.points,
      fill = polygonAttribute.fill,
      stroke = polygonAttribute.stroke,
      borderRadius = polygonAttribute.borderRadius,
      fillOpacity = polygonAttribute.fillOpacity,
      background,
      strokeOpacity = polygonAttribute.strokeOpacity,
      lineWidth = polygonAttribute.lineWidth,
      opacity = polygonAttribute.opacity,
      visible = polygonAttribute.visible
    } = polygon.attribute;

    // 不绘制或者透明
    const fVisible = fillVisible(opacity, fillOpacity);
    const sVisible = strokeVisible(opacity, strokeOpacity);
    const doFill = runFill(fill);
    const doStroke = runStroke(stroke, lineWidth);

    if (!(polygon.valid && visible)) {
      return;
    }

    if (!(doFill || doStroke || background)) {
      return;
    }
    // 如果存在fillCb和strokeCb，那就不直接跳过
    if (!(fVisible || sVisible || fillCb || strokeCb || background)) {
      return;
    }
    context.beginPath();

    if ((borderRadius as number) <= 0 || (isArray(borderRadius) && (<number[]>borderRadius).every(num => num === 0))) {
      drawPolygon(context.camera ? context : context.nativeContext, points, x, y);
    } else {
      // FIXME: type
      drawRoundedPolygon(context.camera ? context : context.nativeContext, points, x, y, borderRadius);
    }
    // polygon 默认闭合
    context.closePath();

    if (!this._polygonRenderContribitions) {
      this._polygonRenderContribitions = this.polygonRenderContribitions.getContributions() || [];
      this._polygonRenderContribitions.sort((a, b) => b.order - a.order);
    }
    this._polygonRenderContribitions.forEach(c => {
      if (c.time === BaseRenderContributionTime.beforeFillStroke) {
        // c.useStyle && context.setCommonStyle(rect, rect.attribute, x, y, rectAttribute);
        c.drawShape(polygon, context, x, y, doFill, doStroke, fVisible, sVisible, polygonAttribute, fillCb, strokeCb);
      }
    });

    // shadow
    context.setShadowStyle && context.setShadowStyle(polygon, polygon.attribute, polygonAttribute);

    if (doFill) {
      if (fillCb) {
        fillCb(context, polygon.attribute, polygonAttribute);
      } else if (fillOpacity) {
        // 存在fill
        context.setCommonStyle(polygon, polygon.attribute, x, y, polygonAttribute);
        context.fill();
      }
    }
    if (doStroke) {
      if (strokeCb) {
        strokeCb(context, polygon.attribute, polygonAttribute);
      } else if (strokeOpacity) {
        // 存在stroke
        context.setStrokeStyle(polygon, polygon.attribute, x, y, polygonAttribute);
        context.stroke();
      }
    }

    this._polygonRenderContribitions.forEach(c => {
      if (c.time === BaseRenderContributionTime.afterFillStroke) {
        // c.useStyle && context.setCommonStyle(rect, rect.attribute, x, y, rectAttribute);
        c.drawShape(polygon, context, x, y, doFill, doStroke, fVisible, sVisible, polygonAttribute, fillCb, strokeCb);
      }
    });
  }

  draw(polygon: IPolygon, renderService: IRenderService, drawContext: IDrawContext, params?: IGraphicRenderDrawParams) {
    const { context } = drawContext;
    if (!context) {
      return;
    }

    context.highPerformanceSave();

    // const polygonAttribute = graphicService.themeService.getCurrentTheme().polygonAttribute;
    const polygonAttribute = getTheme(polygon, params?.theme).polygon;
    let { x = polygonAttribute.x, y = polygonAttribute.y } = polygon.attribute;

    if (!polygon.transMatrix.onlyTranslate()) {
      // 性能较差
      x = 0;
      y = 0;
      context.transformFromMatrix(polygon.transMatrix, true);
    } else {
      const point = polygon.getOffsetXY(polygonAttribute);
      x += point.x;
      y += point.y;
      context.setTransformForCurrent();
    }
    if (drawPathProxy(polygon, context, x, y, drawContext, params)) {
      context.highPerformanceRestore();
      return;
    }

    this.drawShape(polygon, context, x, y, drawContext, params);

    context.highPerformanceRestore();
  }
}
