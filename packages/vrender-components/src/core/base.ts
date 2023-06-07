/**
 * @description 组件基类
 */
import { Group, IGroupGraphicAttribute } from '@visactor/vrender';
import { merge, isPlainObject, isNil } from '@visactor/vutils';

const GROUP_ATTRIBUTES = [
  'x',
  'y',
  'dx',
  'dy',
  'scaleX',
  'scaleY',
  'angle',
  'anchor',
  'postMatrix',
  'visible',
  'clip',
  'pickable',
  'childrenPickable',
  'zIndex'
];

export abstract class AbstractComponent<T extends IGroupGraphicAttribute = IGroupGraphicAttribute> extends Group {
  declare attribute: Partial<T>;

  protected mode: '2d' | '3d';

  constructor(attributes: T, mode: '2d' | '3d' = '2d') {
    super(attributes);
    this.mode = mode;
    // 组件需要精准 bounds，所以将这个 strokeBoundsBuffer 设置为 0，否则会影响包围盒的获取
    this.setTheme({
      common: {
        strokeBoundsBuffer: 0
      }
    });
    this.attribute = attributes;
    // 这里调用渲染和事件绑定逻辑
    this.onSetStage(() => {
      this.render();
      this.bindEvents();
    });
  }

  /**
   * @override
   * 更新单个属性值
   * @param key
   * @param value
   * @param forceUpdateTag
   */
  // @ts-ignore
  setAttribute(key: keyof T, value: any, forceUpdateTag?: boolean | undefined): void {
    if (isPlainObject(this.attribute[key])) {
      merge(this.attribute[key], value);
    } else {
      this.attribute[key] = value;
    }

    // HACK: 待优化
    if (!GROUP_ATTRIBUTES.includes(key as string)) {
      this.render();
    }

    this.valid = this.isValid();
    if (!this.updateShapeAndBoundsTagSetted() && (forceUpdateTag || this.needUpdateTag(key as string))) {
      this.addUpdateShapeAndBoundsTag();
    } else {
      this.addUpdateBoundTag();
    }
    this.addUpdatePositionTag();
    this.onAttributeUpdate();
  }

  // @ts-ignore
  setAttributes(params: Partial<T>, forceUpdateTag?: boolean | undefined): void {
    const keys = Object.keys(params) as (keyof T)[];
    this._mergeAttributes(params, keys);

    // HACK: 待优化
    if (!keys.every(key => GROUP_ATTRIBUTES.includes(key as string))) {
      this.render();
    }

    this.valid = this.isValid();
    // 没有设置shape&bounds的tag
    if (!this.updateShapeAndBoundsTagSetted() && (forceUpdateTag || this.needUpdateTags(keys as string[]))) {
      this.addUpdateShapeAndBoundsTag();
    } else {
      this.addUpdateBoundTag();
    }
    this.addUpdatePositionTag();
    this.onAttributeUpdate();
  }

  protected _mergeAttributes(params: Partial<T>, keys?: (keyof T)[]) {
    if (isNil(keys)) {
      keys = Object.keys(params) as (keyof T)[];
    }
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof Partial<T>;
      if (isPlainObject(this.attribute[key])) {
        merge(this.attribute[key], params[key]);
      } else {
        this.attribute[key] = params[key];
      }
    }
  }

  protected bindEvents() {
    // please override
  }

  protected abstract render(): void;

  // 图形元素 id
  protected _getNodeId(id: string) {
    return `${this.id}-${this.name}-${id}`;
  }
}
