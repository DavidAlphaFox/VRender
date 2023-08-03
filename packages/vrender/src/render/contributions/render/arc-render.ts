import { abs, acos, atan2, cos, epsilon, min, pi, sin, sqrt, pi2 } from '@visactor/vutils';
import { inject, injectable, named } from 'inversify';
import { getTheme } from '../../../graphic/theme';
import { parseStroke } from '../../../common/utils';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ContributionProvider } from '../../../common/contribution-provider';
import type {
  IContext2d,
  IArc,
  IPath2D,
  IGraphicAttribute,
  IMarkAttribute,
  IThemeAttribute,
  IGradientColor,
  IArcRenderContribution,
  IDrawContext,
  IRenderService,
  IGraphicRender,
  IGraphicRenderDrawParams,
  IContributionProvider
} from '../../../interface';
import {
  cornerTangents,
  drawArcPath,
  drawPathProxy,
  fillVisible,
  intersect,
  runFill,
  runStroke,
  strokeVisible
} from './utils';
import { getConicGradientAt } from '../../../canvas/contributions/browser/conical-gradient';
import { ArcRenderContribution } from './contributions/constants';
import { BaseRenderContributionTime } from '../../../common/enums';
import { ARC_NUMBER_TYPE } from '../../../graphic/constants';
/**
 * 部分源码参考 https://github.com/d3/d3-shape/
 * Copyright 2010-2022 Mike Bostock

  Permission to use, copy, modify, and/or distribute this software for any purpose
  with or without fee is hereby granted, provided that the above copyright notice
  and this permission notice appear in all copies.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
  OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
  TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
  THIS SOFTWARE.
 */

@injectable()
export class DefaultCanvasArcRender implements IGraphicRender {
  type: 'arc';
  numberType: number = ARC_NUMBER_TYPE;

  protected _arcBeforeRenderContribitions: IArcRenderContribution[];
  protected _arcAfterRenderContribitions: IArcRenderContribution[];
  constructor(
    @inject(ContributionProvider)
    @named(ArcRenderContribution)
    protected readonly arcRenderContribitions: IContributionProvider<IArcRenderContribution>
  ) {}

  // 绘制尾部cap
  drawArcTailCapPath(
    arc: IArc,
    context: IContext2d | IPath2D,
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
    _sa: number,
    _ea: number
  ) {
    const capAngle = _ea - _sa;
    const data = arc.getParsedAngle();
    const startAngle = data.startAngle;
    let endAngle = data.endAngle;
    endAngle = _ea;
    const deltaAngle = abs(endAngle - startAngle);
    const clockwise: boolean = endAngle > startAngle;
    let collapsedToLine: boolean = false;
    // 规范化outerRadius和innerRadius
    if (outerRadius < innerRadius) {
      const temp = outerRadius;
      outerRadius = innerRadius;
      innerRadius = temp;
    }

    const cornerRadius = arc.getParsedCornerRadius();
    // Or is it a circular or annular sector?
    const { outerDeltaAngle, innerDeltaAngle, outerStartAngle, outerEndAngle, innerEndAngle, innerStartAngle } =
      arc.getParsePadAngle(startAngle, endAngle);

    const outerCornerRadiusStart = cornerRadius;
    const outerCornerRadiusEnd = cornerRadius;
    const innerCornerRadiusEnd = cornerRadius;
    const innerCornerRadiusStart = cornerRadius;
    const maxOuterCornerRadius = Math.max(outerCornerRadiusEnd, outerCornerRadiusStart);
    const maxInnerCornerRadius = Math.max(innerCornerRadiusEnd, innerCornerRadiusStart);
    let limitedOcr = maxOuterCornerRadius;
    let limitedIcr = maxInnerCornerRadius;

    const xors = outerRadius * cos(outerStartAngle);
    const yors = outerRadius * sin(outerStartAngle);
    const xire = innerRadius * cos(innerEndAngle);
    const yire = innerRadius * sin(innerEndAngle);

    // Apply rounded corners?
    let xore: number;
    let yore: number;
    let xirs: number;
    let yirs: number;

    if (maxInnerCornerRadius > epsilon || maxOuterCornerRadius > epsilon) {
      xore = outerRadius * cos(outerEndAngle);
      yore = outerRadius * sin(outerEndAngle);
      xirs = innerRadius * cos(innerStartAngle);
      yirs = innerRadius * sin(innerStartAngle);

      // Restrict the corner radius according to the sector angle.
      if (deltaAngle < pi) {
        const oc = intersect(xors, yors, xirs, yirs, xore, yore, xire, yire);

        if (oc) {
          const ax = xors - oc[0];
          const ay = yors - oc[1];
          const bx = xore - oc[0];
          const by = yore - oc[1];
          const kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2);
          const lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);

          limitedIcr = min(maxInnerCornerRadius, (innerRadius - lc) / (kc - 1));
          limitedOcr = min(maxOuterCornerRadius, (outerRadius - lc) / (kc + 1));
        }
      }
    }

    if (limitedOcr > epsilon) {
      const cornerRadiusStart = min(outerCornerRadiusStart, limitedOcr);
      const cornerRadiusEnd = min(outerCornerRadiusEnd, limitedOcr);
      // Does the sector’s outer ring have rounded corners?
      const t0 = cornerTangents(xirs, yirs, xors, yors, outerRadius, cornerRadiusStart, Number(clockwise));
      const t1 = cornerTangents(xore, yore, xire, yire, outerRadius, cornerRadiusEnd, Number(clockwise));

      // Have the corners merged?
      if (limitedOcr < maxOuterCornerRadius && cornerRadiusStart === cornerRadiusEnd) {
        context.moveTo(cx + t0.cx + t0.x01, cy + t0.cy + t0.y01);
        context.arc(cx + t0.cx, cy + t0.cy, limitedOcr, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !clockwise);
      } else {
        const a1 = endAngle - capAngle - 0.03;
        const a2 = atan2(t1.y11, t1.x11);
        context.arc(cx, cy, outerRadius, a1, a2, !clockwise);
        cornerRadiusEnd > 0 &&
          context.arc(
            cx + t1.cx,
            cy + t1.cy,
            cornerRadiusEnd,
            atan2(t1.y11, t1.x11),
            atan2(t1.y01, t1.x01),
            !clockwise
          );
      }
    } else {
      context.moveTo(cx + xors, cy + yors);
    }
    //   else {
    //     // Or is the outer ring just a circular arc?
    //     if (!partStroke || partStroke[0]) {
    //       context.moveTo(cx + xors, cy + yors);
    //       context.arc(cx, cy, outerRadius, outerStartAngle, outerEndAngle, !clockwise);
    //     } else {
    //       // context.moveTo(cx + outerRadius * cos(outerEndAngle), cy + yore);
    //     }
    //   }
    //   // Is there no inner ring, and it’s a circular sector?
    //   // Or perhaps it’s an annular sector collapsed due to padding?
    if (!(innerRadius > epsilon) || innerDeltaAngle < 0.001) {
      context.lineTo(cx + xire, cy + yire);
      collapsedToLine = true;
    } else if (limitedIcr > epsilon) {
      const cornerRadiusStart = min(innerCornerRadiusStart, limitedIcr);
      const cornerRadiusEnd = min(innerCornerRadiusEnd, limitedIcr);
      // Does the sector’s inner ring (or point) have rounded corners?
      const t0 = cornerTangents(xire, yire, xore, yore, innerRadius, -cornerRadiusEnd, Number(clockwise));
      const t1 = cornerTangents(xors, yors, xirs, yirs, innerRadius, -cornerRadiusStart, Number(clockwise));

      context.lineTo(cx + t0.cx + t0.x01, cy + t0.cy + t0.y01);

      // Have the corners merged?
      if (limitedIcr < maxInnerCornerRadius && cornerRadiusStart === cornerRadiusEnd) {
        const arcEndAngle = atan2(t1.y01, t1.x01);
        context.arc(cx + t0.cx, cy + t0.cy, limitedIcr, atan2(t0.y01, t0.x01), arcEndAngle, !clockwise);
      } else {
        cornerRadiusEnd > 0 &&
          context.arc(
            cx + t0.cx,
            cy + t0.cy,
            cornerRadiusEnd,
            atan2(t0.y01, t0.x01),
            atan2(t0.y11, t0.x11),
            !clockwise
          );
        const a1 = atan2(t0.cy + t0.y11, t0.cx + t0.x11);
        const a2 = endAngle - capAngle - 0.03;
        context.arc(cx, cy, innerRadius, a1, a2, clockwise);
      }
    } else {
      context.lineTo(cx + innerRadius * cos(innerStartAngle), cy + innerRadius * sin(innerStartAngle));
    }

    return collapsedToLine;
  }

  drawShape(
    arc: IArc,
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
    // const arcAttribute = graphicService.themeService.getCurrentTheme().arcAttribute;
    const arcAttribute = getTheme(arc, params?.theme).arc;
    const {
      fill = arcAttribute.fill,
      background,
      stroke = arcAttribute.stroke,
      opacity = arcAttribute.opacity,
      fillOpacity = arcAttribute.fillOpacity,
      lineWidth = arcAttribute.lineWidth,
      strokeOpacity = arcAttribute.strokeOpacity,
      visible = arcAttribute.visible,
      x: originX = arcAttribute.x,
      y: originY = arcAttribute.y
    } = arc.attribute;
    // 不绘制或者透明
    const fVisible = fillVisible(opacity, fillOpacity, fill);
    const sVisible = strokeVisible(opacity, strokeOpacity);
    const doFill = runFill(fill, background);
    const doStroke = runStroke(stroke, lineWidth);

    if (!(arc.valid && visible)) {
      return;
    }

    if (!(doFill || doStroke)) {
      return;
    }

    // 如果存在fillCb和strokeCb，以及background那就不直接跳过
    if (!(fVisible || sVisible || fillCb || strokeCb || background)) {
      return;
    }

    const {
      outerRadius = arcAttribute.outerRadius,
      innerRadius = arcAttribute.innerRadius,
      cap = arcAttribute.cap,
      forceShowCap = arcAttribute.forceShowCap
    } = arc.attribute;
    let beforeRenderContribitionsRuned = false;
    const { isFullStroke, stroke: arrayStroke } = parseStroke(stroke);
    if (doFill || isFullStroke) {
      context.beginPath();
      // if (arc.shouldUpdateShape()) {
      //   // 更新shape
      //   arc.cache = new Path2D(context);
      //   this.drawArcPath(arc, arc.cache, x, y, outerRadius, innerRadius);
      //   arc.clearUpdateShapeTag();
      // } else {
      //   if (arc.cache) {
      //     renderCommandList(arc.cache.commandList, context);
      //   }
      // }
      // 测试后，cache对于重绘性能提升不大，但是在首屏有一定性能损耗，因此arc不再使用cache
      drawArcPath(arc, context, x, y, outerRadius, innerRadius);

      if (!this._arcBeforeRenderContribitions) {
        this._arcBeforeRenderContribitions = [];
        this._arcAfterRenderContribitions = [];
        const contributions = this.arcRenderContribitions.getContributions() || [];
        contributions.sort((a, b) => b.order - a.order);
        contributions.forEach(c => {
          if (c.time === BaseRenderContributionTime.beforeFillStroke) {
            this._arcBeforeRenderContribitions.push(c);
          } else {
            this._arcAfterRenderContribitions.push(c);
          }
        });
      }
      beforeRenderContribitionsRuned = true;
      this._arcBeforeRenderContribitions.forEach(c => {
        c.drawShape(
          arc,
          context,
          x,
          y,
          doFill,
          doStroke,
          fVisible,
          sVisible,
          arcAttribute,
          drawContext,
          fillCb,
          strokeCb
        );
      });

      // shadow
      context.setShadowStyle && context.setShadowStyle(arc, arc.attribute, arcAttribute);

      if (doFill) {
        if (fillCb) {
          fillCb(context, arc.attribute, arcAttribute);
        } else if (fVisible) {
          context.setCommonStyle(arc, arc.attribute, originX - x, originY - y, arcAttribute);
          context.fill();
        }
      }

      if (doStroke && isFullStroke) {
        if (strokeCb) {
          strokeCb(context, arc.attribute, arcAttribute);
        } else if (sVisible) {
          context.setStrokeStyle(arc, arc.attribute, originX - x, originY - y, arcAttribute);
          context.stroke();
        }
      }
    }

    // 需要局部渲染描边的时候
    if (!isFullStroke && doStroke) {
      context.beginPath();
      const collapsedToLine = drawArcPath(arc, context, x, y, outerRadius, innerRadius, arrayStroke);

      if (!beforeRenderContribitionsRuned) {
        if (!this._arcBeforeRenderContribitions) {
          this._arcBeforeRenderContribitions = [];
          this._arcAfterRenderContribitions = [];
          const contributions = this.arcRenderContribitions.getContributions() || [];
          contributions.sort((a, b) => b.order - a.order);
          contributions.forEach(c => {
            if (c.time === BaseRenderContributionTime.beforeFillStroke) {
              this._arcBeforeRenderContribitions.push(c);
            } else {
              this._arcAfterRenderContribitions.push(c);
            }
          });
        }
        beforeRenderContribitionsRuned = true;
        this._arcBeforeRenderContribitions.forEach(c => {
          c.drawShape(
            arc,
            context,
            x,
            y,
            doFill,
            doStroke,
            fVisible,
            sVisible,
            arcAttribute,
            drawContext,
            fillCb,
            strokeCb
          );
        });
      }

      if (strokeCb) {
        strokeCb(context, arc.attribute, arcAttribute);
      } else if (sVisible) {
        context.setStrokeStyle(arc, arc.attribute, x, y, arcAttribute);
        context.stroke();
      }
    }

    // 绘制cap
    if (cap && forceShowCap) {
      const { startAngle: sa, endAngle: ea } = arc.getParsedAngle();
      const deltaAngle = abs(ea - sa);
      if (deltaAngle >= pi2 - epsilon) {
        context.beginPath();
        const capWidth = Math.abs(outerRadius - innerRadius) / 2;
        // 以外边界长度为准
        const capAngle = capWidth / outerRadius;
        const { endAngle = arcAttribute.endAngle, fill = arcAttribute.fill } = arc.attribute;
        const startAngle = endAngle;
        this.drawArcTailCapPath(arc, context, x, y, outerRadius, innerRadius, startAngle, startAngle + capAngle);

        if (!beforeRenderContribitionsRuned) {
          if (!this._arcBeforeRenderContribitions) {
            this._arcBeforeRenderContribitions = [];
            this._arcAfterRenderContribitions = [];
            const contributions = this.arcRenderContribitions.getContributions() || [];
            contributions.sort((a, b) => b.order - a.order);
            contributions.forEach(c => {
              if (c.time === BaseRenderContributionTime.beforeFillStroke) {
                this._arcBeforeRenderContribitions.push(c);
              } else {
                this._arcAfterRenderContribitions.push(c);
              }
            });
          }
          beforeRenderContribitionsRuned = true;
          this._arcBeforeRenderContribitions.forEach(c => {
            c.drawShape(
              arc,
              context,
              x,
              y,
              doFill,
              doStroke,
              fVisible,
              sVisible,
              arcAttribute,
              drawContext,
              fillCb,
              strokeCb
            );
          });
        }

        if (doFill) {
          // 获取渐变色最后一个颜色
          const color = fill;
          if ((color as IGradientColor).gradient === 'conical') {
            const lastColor = getConicGradientAt(0, 0, endAngle, color as any);
            if (fillCb) {
              // fillCb(context, arc.attribute, arcAttribute);
            } else if (fillVisible) {
              // context.closePath();
              context.setCommonStyle(arc, arc.attribute, x, y, arcAttribute);
              context.fillStyle = lastColor as string;
              context.fill();
            }
          }
        }
        if (doStroke) {
          if (strokeCb) {
            // fillCb(context, arc.attribute, arcAttribute);
          } else if (sVisible) {
            context.setStrokeStyle(arc, arc.attribute, x, y, arcAttribute);
            // context.strokeStyle = 'red';
            context.stroke();
          }
        }
      }
    }

    this._arcAfterRenderContribitions.forEach(c => {
      c.drawShape(
        arc,
        context,
        x,
        y,
        doFill,
        doStroke,
        fVisible,
        sVisible,
        arcAttribute,
        drawContext,
        fillCb,
        strokeCb
      );
    });
  }

  draw(arc: IArc, renderService: IRenderService, drawContext: IDrawContext, params?: IGraphicRenderDrawParams) {
    const { context } = drawContext;
    if (!context) {
      return;
    }

    // const arcAttribute = graphicService.themeService.getCurrentTheme().arcAttribute;
    const arcAttribute = getTheme(arc, params?.theme).arc;

    context.highPerformanceSave();

    let { x = arcAttribute.x, y = arcAttribute.y } = arc.attribute;
    if (!arc.transMatrix.onlyTranslate()) {
      // 性能较差
      x = 0;
      y = 0;
      context.transformFromMatrix(arc.transMatrix, true);
    } else {
      const point = arc.getOffsetXY(arcAttribute);
      x += point.x;
      y += point.y;
      // 当前context有rotate/scale，重置matrix
      context.setTransformForCurrent();
    }

    if (drawPathProxy(arc, context, x, y, drawContext, params)) {
      context.highPerformanceRestore();
      return;
    }

    this.drawShape(arc, context, x, y, drawContext, params);

    context.highPerformanceRestore();
  }
}
