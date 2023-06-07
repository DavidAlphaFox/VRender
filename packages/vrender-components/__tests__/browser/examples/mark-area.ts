import GUI from 'lil-gui';
import render from '../../util/render';
import { MarkArea } from '../../../src';

export function run() {
  console.log('MarkArea');

  const guiObject = {
    name: 'MarkArea',
    labelPos: 'left',
    borderRadius: 0,
    labelDx: 0,
    labelDy: 0
  };

  const styleAttr = {
    label: {
      text: '平均值: 17.7',
      position: guiObject.labelPos,
      dx: guiObject.labelDx,
      dy: guiObject.labelDy,
      areaStyle: {
        borderRadius: guiObject.borderRadius
      }
    }
  };

  const markArea = new MarkArea({
    points: [
      {
        x: 100,
        y: 50
      },
      {
        x: 400,
        y: 100
      },
      {
        x: 200,
        y: 150
      },
      {
        x: 100,
        y: 50
      }
    ],
    ...(styleAttr as any)
  });

  const markArea2 = new MarkArea({
    points: [
      {
        x: 100,
        y: 250
      },
      {
        x: 200,
        y: 250
      },
      {
        x: 200,
        y: 450
      },
      {
        x: 100,
        y: 450
      }
    ],
    ...(styleAttr as any),
    areaStyle: {
      borderRadius: guiObject.borderRadius
    }
  });

  const markAreas = [markArea, markArea2];

  const stage = render(markAreas, 'main');

  const gui = new GUI();
  gui.add(guiObject, 'name');
  gui
    .add(guiObject, 'labelPos', [
      'left',
      'right',
      'top',
      'bottom',
      'middle',
      'insideLeft',
      'insideRight',
      'insideTop',
      'insideBottom'
    ])
    .onChange(value => {
      markAreas.forEach(markArea =>
        markArea.setAttribute('label', {
          position: value
        })
      );
    });

  gui.add(guiObject, 'labelDx').onChange(value => {
    markAreas.forEach(markArea =>
      markArea.setAttribute('label', {
        dx: value
      })
    );
  });

  gui.add(guiObject, 'labelDy').onChange(value => {
    markAreas.forEach(markArea =>
      markArea.setAttribute('label', {
        dy: value
      })
    );
  });

  gui.add(guiObject, 'borderRadius').onChange(value => {
    markAreas.forEach(markArea =>
      markArea.setAttribute('areaStyle', {
        borderRadius: value
      })
    );
  });
}
