/**
 * @description 指标卡组件
 */
import type { IGroup, INode, IText } from '@visactor/vrender-core';
import { merge, isValid, array, isValidNumber, get } from '@visactor/vutils';
import { AbstractComponent } from '../core/base';
import { measureTextSize } from '../util';
import type { IndicatorAttributes, IndicatorItemSpec } from './type';
import { DEFAULT_INDICATOR_THEME } from './config';

export class Indicator extends AbstractComponent<Required<IndicatorAttributes>> {
  name = 'indicator';

  private _title?: IText;
  private _content?: IText | IText[];

  protected render() {
    const { visible, title, content, size, limitRatio = Infinity } = this.attribute as IndicatorAttributes;

    const limit = Math.min(size.width, size.height) * limitRatio;

    const group = this.createOrUpdateChild('indicator-container', { x: 0, y: 0, zIndex: 1 }, 'group') as IGroup;

    // 指标卡全部隐藏
    if (visible !== true) {
      group && group.hideAll();
      return;
    }

    if (isValid(title)) {
      if (title.visible !== false) {
        const titleStyle = merge({}, get(DEFAULT_INDICATOR_THEME, 'title.style'), title.style);
        this._title = group.createOrUpdateChild(
          'indicator-title',
          {
            ...titleStyle,
            /**
             * 加入以下逻辑：如果没有声明lineHeight，默认 lineHeight 等于 fontSize
             * 因为如果不声明 vrender 底层会默认给文本加上 2px 的高度，会影响布局计算
             * 注意：在autoFit改变fontsize时，lineHeight也要同步修改
             */
            lineHeight: isValid(titleStyle.lineHeight) ? titleStyle.lineHeight : titleStyle.fontSize,
            visible: title.visible,
            x: 0,
            y: 0
          },
          'text'
        ) as IText;

        // auto-fit
        if (title.autoFit && isValidNumber(limit)) {
          this._setAutoFit(limit, this._title, title);
        }

        //auto-limit
        if (title.autoLimit && isValidNumber(limitRatio)) {
          this._title.setAttribute('maxLineWidth', limit);
        }
      } else {
        /**
         * indicator部分隐藏
         * 例如title隐藏了，content还保留。直接设置visible:false 计算group.AABBounts是错的，影响上下居中。
         * 这里把隐藏的nodes删除后，group.AABBounts计算才正确。
         */
        const titleNode = group.find(node => node.name === 'indicator-title', false);
        titleNode && group.removeChild(titleNode as INode);
        this._title = undefined;
      }
    }

    const titleHeight = this._title ? this._title.AABBBounds.height() : 0;

    if (isValid(content)) {
      const titleSpace = this._title ? (title?.space ? title.space : 0) : 0;
      const contents: IndicatorItemSpec[] = array(content);
      const contentComponents: IText[] = [];
      let lastContentHeight = 0;
      contents.forEach((contentItem, i) => {
        if (contentItem.visible !== false) {
          const contentStyle = merge({}, get(DEFAULT_INDICATOR_THEME, 'content.style'), contentItem.style);
          const contentComponent = group.createOrUpdateChild(
            'indicator-content-' + i,
            {
              ...contentStyle,
              lineHeight: isValid(contentStyle.lineHeight) ? contentStyle.lineHeight : contentStyle.fontSize,
              visible: contentItem.visible,
              x: 0,
              y: titleHeight + titleSpace + lastContentHeight
            },
            'text'
          ) as IText;

          // auto-fit
          if (contentItem.autoFit && isValidNumber(limit)) {
            this._setAutoFit(limit, contentComponent, contentItem);
          }

          //auto-limit
          if (contentItem.autoLimit && isValidNumber(limitRatio)) {
            contentComponent.setAttribute('maxLineWidth', limit);
          }

          contentComponents.push(contentComponent);
          const contentSpace = contentItem?.space ? contentItem.space : 0;
          lastContentHeight += contentComponent.AABBBounds.height() + contentSpace;
        } else {
          /**
           * indicator部分隐藏
           */
          const contentItemNode = group.find(node => node.name === 'indicator-content-' + i, false);
          contentItemNode && group.removeChild(contentItemNode as INode);
        }
      });
      this._content = contentComponents;
    }

    const totalHeight = group?.AABBBounds.height() ?? 0;
    group.setAttribute('y', size.height / 2 - totalHeight / 2);
    group.setAttribute('x', size.width / 2);
  }

  private _setAutoFit(limit: number, indicatorItem: IText, indicatorItemSpec: IndicatorItemSpec) {
    const originWidth = measureTextSize(indicatorItemSpec.style?.text ?? '', indicatorItemSpec.style ?? {}).width;
    if (originWidth > 0) {
      const ratio = (limit * (indicatorItemSpec.fitPercent ?? 0.5)) / originWidth;
      const fontSize = Math.floor((indicatorItemSpec.style?.fontSize ?? 20) * ratio);
      indicatorItem.setAttribute('fontSize', fontSize);
      indicatorItem.setAttribute(
        'lineHeight',
        isValid(indicatorItemSpec.style.lineHeight) ? indicatorItemSpec.style.lineHeight : fontSize
      );
    }
  }
}
