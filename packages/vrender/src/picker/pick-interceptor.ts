import type { IMatrix, IPointLike } from '@visactor/vutils';
import { pi2 } from '@visactor/vutils';
import { injectable } from 'inversify';
import { ARC3D_NUMBER_TYPE } from '../graphic/constants';
import type {
  IArc,
  IContext2d,
  IGraphic,
  IGroup,
  IPickItemInterceptorContribution,
  IPickParams,
  IPickerService,
  PickResult
} from '../interface';

// 拦截器
export const PickItemInterceptor = Symbol.for('PickItemInterceptor');

/**
 * 3d拦截器，用于渲染3d视角
 */
@injectable()
export class Canvas3DPickItemInterceptor implements IPickItemInterceptorContribution {
  // canvas?: ICanvas;
  order: number = 1;

  beforePickItem(
    graphic: IGraphic,
    pickerService: IPickerService,
    point: IPointLike,
    pickParams: IPickParams,
    params?: {
      parentMatrix: IMatrix;
    }
  ) {
    if (!graphic.in3dMode || pickParams.in3dInterceptor) {
      return null;
    }

    const context = pickerService.pickContext;
    const stage = graphic.stage;
    if (!(context && stage)) {
      return null;
    }
    pickParams.in3dInterceptor = true;

    // 使用3d模式渲染
    context.save();
    this.initCanvasCtx(context);
    context.camera = stage.camera;

    // 设置context的transform到上一个节点
    if (graphic.isContainer) {
      // hack逻辑，如果是饼图的话，需要依次绘制不同的边
      let isPie: boolean = false;
      let is3d: boolean = false;
      graphic.forEachChildren((c: IGraphic) => {
        isPie = c.numberType === ARC3D_NUMBER_TYPE;
        return !isPie;
      });
      graphic.forEachChildren((c: IGraphic) => {
        is3d = !!c.findFace;
        return !is3d;
      });

      let result: PickResult;
      if (isPie) {
        const children = graphic.getChildren() as IArc[];
        // 绘制内层
        // drawContext.hack_pieFace = 'inside';
        // drawContribution.renderGroup(graphic as IGroup, drawContext);
        // 绘制底部
        // drawContext.hack_pieFace = 'bottom';
        // drawContribution.renderGroup(graphic as IGroup, drawContext);
        // 绘制外部
        // 排序一下
        const sortedChildren = [...children];
        sortedChildren.sort((a, b) => {
          let angle1 = (a.attribute.startAngle ?? 0 + a.attribute.endAngle ?? 0) / 2;
          let angle2 = (b.attribute.startAngle ?? 0 + b.attribute.endAngle ?? 0) / 2;
          while (angle1 < 0) {
            angle1 += pi2;
          }
          while (angle2 < 0) {
            angle2 += pi2;
          }
          return angle2 - angle1;
        });
        sortedChildren.forEach(c => {
          c._next = null;
          c._prev = null;
        });
        graphic.removeAllChild();
        graphic.update();
        sortedChildren.forEach(c => {
          graphic.appendChild(c);
        });
        pickParams.hack_pieFace = 'outside';
        result = pickerService.pickGroup(graphic as IGroup, point, params.parentMatrix, pickParams);
        if (!result.graphic) {
          // 绘制内部
          pickParams.hack_pieFace = 'inside';
          result = pickerService.pickGroup(graphic as IGroup, point, params.parentMatrix, pickParams);
        }
        if (!result.graphic) {
          // 绘制顶部
          pickParams.hack_pieFace = 'top';
          result = pickerService.pickGroup(graphic as IGroup, point, params.parentMatrix, pickParams);
        }
        graphic.removeAllChild();
        children.forEach(c => {
          c._next = null;
          c._prev = null;
        });
        children.forEach(c => {
          graphic.appendChild(c);
        });
      } else if (is3d) {
        // 排序这些图元
        const children = graphic.getChildren() as IGraphic[];
        const zChildren = children.map(g => {
          const face3d = g.findFace();
          const vertices = face3d.vertices;
          // 计算每个顶点的view
          const viewdVerticesZ = vertices.map(v => {
            return context.view(v[0], v[1], v[2] + g.attribute.z ?? 0)[2];
          });
          const ave_z = viewdVerticesZ.reduce((a, b) => a + b, 0);
          return {
            ave_z,
            g
          };
        });
        zChildren.sort((a, b) => b.ave_z - a.ave_z);
        graphic.removeAllChild();
        zChildren.forEach(i => {
          i.g._next = null;
          i.g._prev = null;
        });
        graphic.update();
        zChildren.forEach(i => {
          graphic.add(i.g);
        });

        result = pickerService.pickGroup(graphic as IGroup, point, params.parentMatrix, pickParams);

        graphic.removeAllChild();
        children.forEach(g => {
          g._next = null;
          g._prev = null;
        });
        graphic.update();
        children.forEach(g => {
          graphic.add(g);
        });
      } else {
        result = pickerService.pickGroup(graphic as IGroup, point, params.parentMatrix, pickParams);
      }

      context.camera = null;
      context.restore();

      pickParams.in3dInterceptor = false;
      return result;
    }
    return null;
  }

  initCanvasCtx(context: IContext2d) {
    context.setTransformForCurrent();
  }
}
