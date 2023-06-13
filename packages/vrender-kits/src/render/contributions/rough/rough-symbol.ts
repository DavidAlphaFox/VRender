import { inject, injectable } from 'inversify';
import type {
  IGraphicRender,
  IRenderService,
  ISymbol,
  IGraphicAttribute,
  IContext2d,
  IGraphic,
  IMarkAttribute,
  IThemeAttribute,
  IDrawContext,
  IGraphicRenderDrawParams
} from '@visactor/vrender';
import { SYMBOL_NUMBER_TYPE, DefaultCanvasSymbolRender, getTheme, CustomPath2D } from '@visactor/vrender';
import rough from 'roughjs';
import { defaultRouthThemeSpec } from './config';

@injectable()
export class RoughCanvasSymbolRender implements IGraphicRender {
  type: 'symbol';
  numberType: number;
  style: 'rough' = 'rough';

  constructor(
    @inject(DefaultCanvasSymbolRender)
    public readonly canvasRenderer: IGraphicRender
  ) {
    this.type = 'symbol';
    this.numberType = SYMBOL_NUMBER_TYPE;
  }

  draw(symbol: ISymbol, renderService: IRenderService, drawContext: IDrawContext, params?: IGraphicRenderDrawParams) {
    const { context } = drawContext;
    if (!context) {
      return;
    }
    // 获取到原生canvas
    const canvas = context.canvas.nativeCanvas;
    const rc = rough.canvas(canvas);

    context.highPerformanceSave();

    // const rectAttribute = graphicService.themeService.getCurrentTheme().rectAttribute;
    const symbolAttribute = getTheme(symbol).symbol;
    let { x = symbolAttribute.x, y = symbolAttribute.y } = symbol.attribute;
    if (!symbol.transMatrix.onlyTranslate()) {
      // 性能较差
      x = 0;
      y = 0;
      context.transformFromMatrix(symbol.transMatrix, true);
    } else {
      const { dx = symbolAttribute.dx, dy = symbolAttribute.dy } = symbol.attribute;
      x += dx;
      y += dy;
      // 当前context有rotate/scale，重置matrix
      context.setTransformForCurrent();
    }

    const parsedPath = symbol.getParsedPath();
    // todo: 考虑使用path
    if (!parsedPath) {
      return;
    }

    const {
      fill = symbolAttribute.fill,
      stroke = symbolAttribute.stroke,
      fillColor = symbolAttribute.fill,
      strokeColor = symbolAttribute.stroke,
      size = symbolAttribute.size,
      lineWidth = symbolAttribute.lineWidth,
      maxRandomnessOffset = defaultRouthThemeSpec.maxRandomnessOffset,
      roughness = defaultRouthThemeSpec.roughness,
      bowing = defaultRouthThemeSpec.bowing,
      curveFitting = defaultRouthThemeSpec.curveFitting,
      curveTightness = defaultRouthThemeSpec.curveTightness,
      curveStepCount = defaultRouthThemeSpec.curveStepCount,
      fillStyle = defaultRouthThemeSpec.fillStyle,
      fillWeight = defaultRouthThemeSpec.fillWeight,
      hachureAngle = defaultRouthThemeSpec.hachureAngle,
      hachureGap = defaultRouthThemeSpec.hachureGap,
      simplification = defaultRouthThemeSpec.simplification,
      dashOffset = defaultRouthThemeSpec.dashOffset,
      dashGap = defaultRouthThemeSpec.dashGap,
      zigzagOffset = defaultRouthThemeSpec.zigzagOffset,
      seed = defaultRouthThemeSpec.seed,
      fillLineDash = defaultRouthThemeSpec.fillLineDash,
      fillLineDashOffset = defaultRouthThemeSpec.fillLineDashOffset,
      disableMultiStroke = defaultRouthThemeSpec.disableMultiStroke,
      disableMultiStrokeFill = defaultRouthThemeSpec.disableMultiStrokeFill,
      preserveVertices = defaultRouthThemeSpec.preserveVertices,
      fixedDecimalPlaceDigits = defaultRouthThemeSpec.fixedDecimalPlaceDigits
    } = symbol.attribute as any;

    const customPath = new CustomPath2D();
    if (parsedPath.draw(customPath, size, x, y)) {
      customPath.closePath();
    }

    rc.path(customPath.toString(), {
      fill: fill ? (fillColor as string) : undefined,
      stroke: stroke ? (strokeColor as string) : undefined,
      strokeWidth: lineWidth,
      maxRandomnessOffset,
      roughness,
      bowing,
      curveFitting,
      curveTightness,
      curveStepCount,
      fillStyle,
      fillWeight,
      hachureAngle,
      hachureGap,
      simplification,
      dashOffset,
      dashGap,
      zigzagOffset,
      seed,
      fillLineDash,
      fillLineDashOffset,
      disableMultiStroke,
      disableMultiStrokeFill,
      preserveVertices,
      fixedDecimalPlaceDigits
    });

    context.highPerformanceRestore();
  }

  drawShape(
    graphic: IGraphic,
    ctx: IContext2d,
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
  ): void {
    if (this.canvasRenderer.drawShape) {
      return this.canvasRenderer.drawShape(graphic, ctx, x, y, drawContext, params, fillCb, strokeCb);
    }
  }
}
