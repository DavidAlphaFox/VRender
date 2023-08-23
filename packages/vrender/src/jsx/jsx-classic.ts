import { isArray, isString } from '@visactor/vutils';
import { graphicCreator } from '../graphic';
import { REACT_TO_CANOPUS_EVENTS } from './graphicType';

export function jsx(type: string | any, config: Record<string, any>, ...children: any) {
  const { key, attribute, ...props } = config || {};

  let c = type;
  if (isString(type)) {
    c = graphicCreator[type];
  }

  let childrenList = [];
  if (children.length) {
    childrenList = children.length === 1 ? children[0] : children;
  }

  const g = c.prototype.type ? new c(attribute) : c(config);
  if (childrenList && isArray(childrenList)) {
    childrenList.forEach((c: any) => {
      c && g.add(c);
    });
  } else {
    childrenList && g.add(childrenList);
  }

  Object.keys(props).forEach(k => {
    const en = REACT_TO_CANOPUS_EVENTS[k];
    if (en) {
      g.on(en, props[k]);
    }
  });
  return g;
}

export class Fragment {
  children: any[] = [];
  add(g: any) {
    this.children.push(g);
  }
}
