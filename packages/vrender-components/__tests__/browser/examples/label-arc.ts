import { GUI } from 'lil-gui';
import { createGroup, Stage, createArc } from '@visactor/vrender';
import { createRenderer } from '../../util/render';
import { ArcLabel } from '../../../src';

const pieGenerator = () => {
  const spec: any = {
    attribute: {
      width: 800,
      height: 500,
      pickable: false,
      zIndex: 300
    },
    _uid: 14,
    type: 'group',
    name: 'pie_9',
    // children: [
    //   {
    //     attribute: {
    //       fill: '#1f77b4',
    //       x: 100,
    //       y: 100,
    //       startAngle: 0,
    //       endAngle: 1.0927278795094932,
    //       innerRadius: 0,
    //       outerRadius: 80,
    //       fillOpacity: 1
    //     },
    //     _uid: 52,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       fill: '#aec7e8',
    //       x: 100,
    //       y: 100,
    //       startAngle: 1.0927278795094932,
    //       endAngle: 2.731819698773733,
    //       innerRadius: 0,
    //       outerRadius: 80,
    //       fillOpacity: 1
    //     },
    //     _uid: 53,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       fill: '#ff7f0e',
    //       x: 100,
    //       y: 100,
    //       startAngle: 2.731819698773733,
    //       endAngle: 5.463639397547466,
    //       innerRadius: 0,
    //       outerRadius: 80,
    //       fillOpacity: 1
    //     },
    //     _uid: 54,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       fill: '#ffbb78',
    //       x: 100,
    //       y: 100,
    //       startAngle: 5.463639397547466,
    //       endAngle: 6.283185307179586,
    //       innerRadius: 0,
    //       outerRadius: 80,
    //       fillOpacity: 1
    //     },
    //     _uid: 55,
    //     type: 'arc',
    //     children: []
    //   }
    // ]
    // children: [
    //   {
    //     attribute: {
    //       visible: true,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       padAngle: 0,
    //       x: 388,
    //       y: 238,
    //       startAngle: -1.5707963267948966,
    //       endAngle: 1.357168026350791,
    //       outerRadius: 190.4,
    //       innerRadius: 0,
    //       cornerRadius: 0,
    //       fill: '#1664FF',
    //       stroke: '#1664FF',
    //       pickable: true
    //     },
    //     _uid: 15,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       visible: true,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       padAngle: 0,
    //       x: 388,
    //       y: 238,
    //       startAngle: 1.357168026350791,
    //       endAngle: 3.0988669935009723,
    //       outerRadius: 190.4,
    //       innerRadius: 0,
    //       cornerRadius: 0,
    //       fill: '#1AC6FF',
    //       stroke: '#1AC6FF',
    //       pickable: true
    //     },
    //     _uid: 16,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       visible: true,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       padAngle: 0,
    //       x: 388,
    //       y: 238,
    //       startAngle: 3.0988669935009723,
    //       endAngle: 3.609689958974673,
    //       outerRadius: 190.4,
    //       innerRadius: 0,
    //       cornerRadius: 0,
    //       fill: '#FF8A00',
    //       stroke: '#FF8A00',
    //       pickable: true
    //     },
    //     _uid: 17,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       visible: true,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       padAngle: 0,
    //       x: 388,
    //       y: 238,
    //       startAngle: 3.609689958974673,
    //       endAngle: 3.9238492243336522,
    //       outerRadius: 190.4,
    //       innerRadius: 0,
    //       cornerRadius: 0,
    //       fill: '#3CC780',
    //       stroke: '#3CC780',
    //       pickable: true
    //     },
    //     _uid: 18,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       visible: true,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       padAngle: 0,
    //       x: 388,
    //       y: 238,
    //       startAngle: 3.9238492243336522,
    //       endAngle: 4.151928850984271,
    //       outerRadius: 190.4,
    //       innerRadius: 0,
    //       cornerRadius: 0,
    //       fill: '#7442D4',
    //       stroke: '#7442D4',
    //       pickable: true
    //     },
    //     _uid: 19,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       visible: true,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       padAngle: 0,
    //       x: 388,
    //       y: 238,
    //       startAngle: 4.151928850984271,
    //       endAngle: 4.329742995177454,
    //       outerRadius: 190.4,
    //       innerRadius: 0,
    //       cornerRadius: 0,
    //       fill: '#FFC400',
    //       stroke: '#FFC400',
    //       pickable: true
    //     },
    //     _uid: 20,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       visible: true,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       padAngle: 0,
    //       x: 388,
    //       y: 238,
    //       startAngle: 4.329742995177454,
    //       endAngle: 4.492477494633405,
    //       outerRadius: 190.4,
    //       innerRadius: 0,
    //       cornerRadius: 0,
    //       fill: '#304D77',
    //       stroke: '#304D77',
    //       pickable: true
    //     },
    //     _uid: 21,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       visible: true,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       padAngle: 0,
    //       x: 388,
    //       y: 238,
    //       startAngle: 4.492477494633405,
    //       endAngle: 4.71238898038469,
    //       outerRadius: 190.4,
    //       innerRadius: 0,
    //       cornerRadius: 0,
    //       fill: '#B48DEB',
    //       stroke: '#B48DEB',
    //       pickable: true
    //     },
    //     _uid: 22,
    //     type: 'arc',
    //     children: []
    //   }
    // ]
    // children: [
    //   {
    //     attribute: {
    //       visible: true,
    //       cornerRadius: 0,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       x: 267,
    //       y: 238,
    //       startAngle: -2.617993877991494,
    //       endAngle: -0.5235987755982989,
    //       outerRadius: 161.12600000000003,
    //       innerRadius: 47.6,
    //       fill: '#1664FF',
    //       stroke: '#1664FF',
    //       pickable: true
    //     },
    //     _uid: 42,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       visible: true,
    //       cornerRadius: 0,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       x: 267,
    //       y: 238,
    //       startAngle: -0.5235987755982989,
    //       endAngle: 1.5707963267948963,
    //       outerRadius: 83.30000000000001,
    //       innerRadius: 47.6,
    //       fill: '#1AC6FF',
    //       stroke: '#1AC6FF',
    //       pickable: true
    //     },
    //     _uid: 43,
    //     type: 'arc',
    //     children: []
    //   },
    //   {
    //     attribute: {
    //       visible: true,
    //       cornerRadius: 0,
    //       lineWidth: 0,
    //       fillOpacity: 1,
    //       x: 267,
    //       y: 238,
    //       startAngle: 1.5707963267948963,
    //       endAngle: 3.6651914291880923,
    //       outerRadius: 56.882000000000005,
    //       innerRadius: 47.6,
    //       fill: '#FF8A00',
    //       stroke: '#FF8A00',
    //       pickable: true
    //     },
    //     _uid: 44,
    //     type: 'arc',
    //     children: []
    //   }
    // ]
    children: [
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#2E62F1',
          stroke: '#2E62F1',
          x: 359.5,
          y: 238,
          startAngle: -1.832595714594046,
          endAngle: -1.3089969389957472,
          outerRadius: 174.9244056767206,
          innerRadius: 0,
          pickable: true
        },
        _uid: 105,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#4F44CF',
          stroke: '#4F44CF',
          x: 359.5,
          y: 238,
          startAngle: -1.3089969389957472,
          endAngle: -0.7853981633974485,
          outerRadius: 116.50796003236482,
          innerRadius: 0,
          pickable: true
        },
        _uid: 106,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#4DC36A',
          stroke: '#4DC36A',
          x: 359.5,
          y: 238,
          startAngle: -0.7853981633974483,
          endAngle: -0.2617993877991495,
          outerRadius: 69.75215161125244,
          innerRadius: 0,
          pickable: true
        },
        _uid: 107,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#FF6341',
          stroke: '#FF6341',
          x: 359.5,
          y: 238,
          startAngle: -0.2617993877991494,
          endAngle: 0.2617993877991494,
          outerRadius: 64.2079052714386,
          innerRadius: 0,
          pickable: true
        },
        _uid: 108,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#FF8406',
          stroke: '#FF8406',
          x: 359.5,
          y: 238,
          startAngle: 0.2617993877991493,
          endAngle: 0.7853981633974481,
          outerRadius: 47.60042294494964,
          innerRadius: 0,
          pickable: true
        },
        _uid: 109,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#5AC8FA',
          stroke: '#5AC8FA',
          x: 359.5,
          y: 238,
          startAngle: 0.7853981633974481,
          endAngle: 1.3089969389957468,
          outerRadius: 42.68391001012817,
          innerRadius: 0,
          pickable: true
        },
        _uid: 110,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#003A8C',
          stroke: '#003A8C',
          x: 359.5,
          y: 238,
          startAngle: 1.3089969389957472,
          endAngle: 1.832595714594046,
          outerRadius: 24.53880218925232,
          innerRadius: 0,
          pickable: true
        },
        _uid: 111,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#98DD62',
          stroke: '#98DD62',
          x: 359.5,
          y: 238,
          startAngle: 1.832595714594046,
          endAngle: 2.3561944901923444,
          outerRadius: 20.797393185242615,
          innerRadius: 0,
          pickable: true
        },
        _uid: 112,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#07A199',
          stroke: '#07A199',
          x: 359.5,
          y: 238,
          startAngle: 2.3561944901923444,
          endAngle: 2.879793265790643,
          outerRadius: 19.381967826377565,
          innerRadius: 0,
          pickable: true
        },
        _uid: 113,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#FFCC00',
          stroke: '#FFCC00',
          x: 359.5,
          y: 238,
          startAngle: 2.8797932657906435,
          endAngle: 3.4033920413889422,
          outerRadius: 13.31776892117981,
          innerRadius: 0,
          pickable: true
        },
        _uid: 114,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#B08AE2',
          stroke: '#B08AE2',
          x: 359.5,
          y: 238,
          startAngle: 3.403392041388942,
          endAngle: 3.926990816987241,
          outerRadius: 12.487696501669921,
          innerRadius: 0,
          pickable: true
        },
        _uid: 115,
        type: 'arc',
        children: []
      },
      {
        attribute: {
          visible: true,
          cornerRadius: 0,
          lineWidth: 0,
          fillOpacity: 1,
          fill: '#87DBDD',
          stroke: '#87DBDD',
          x: 359.5,
          y: 238,
          startAngle: 3.926990816987241,
          endAngle: 4.4505895925855405,
          outerRadius: 5.705389211535645,
          innerRadius: 0,
          pickable: true
        },
        _uid: 116,
        type: 'arc',
        children: []
      }
    ]
  };
  return spec;
};

const originData = [
  {
    id: 'AAA',
    value: 4
  },
  {
    id: 'BBB',
    value: 6
  },
  {
    id: 'CCC',
    value: 10
  },
  {
    id: 'DDD',
    value: 3
  }
];

const latestData = [
  {
    type: 'oxygen',
    value: '46.60'
    // __VCHART_DEFAULT_DATA_INDEX: 0,
    // __VCHART_DEFAULT_DATA_KEY: 'oxygen_oxygen_0',
    // __VCHART_ARC_RATIO: 0.4660000000000001,
    // __VCHART_ARC_START_ANGLE: -1.5707963267948966,
    // __VCHART_ARC_END_ANGLE: 1.357168026350791,
    // __VCHART_ARC_MIDDLE_ANGLE: -0.10681415022205276,
    // __VCHART_ARC_RADIAN: 2.9279643531456876,
    // __VCHART_ARC_QUADRANT: 1,
    // __VCHART_ARC_K: 1,
    // VGRAMMAR_DATA_ID_KEY_16: 0
  },
  {
    type: 'silicon',
    value: '27.72',
    __VCHART_DEFAULT_DATA_INDEX: 1,
    __VCHART_DEFAULT_DATA_KEY: 'silicon_silicon_0',
    __VCHART_ARC_RATIO: 0.2772,
    __VCHART_ARC_START_ANGLE: 1.357168026350791,
    __VCHART_ARC_END_ANGLE: 3.0988669935009723,
    __VCHART_ARC_MIDDLE_ANGLE: 2.2280175099258814,
    __VCHART_ARC_RADIAN: 1.7416989671501812,
    __VCHART_ARC_QUADRANT: 3,
    __VCHART_ARC_K: 0.5948497854077253,
    VGRAMMAR_DATA_ID_KEY_16: 1
  },
  {
    type: 'aluminum',
    value: '8.13',
    __VCHART_DEFAULT_DATA_INDEX: 2,
    __VCHART_DEFAULT_DATA_KEY: 'aluminum_aluminum_0',
    __VCHART_ARC_RATIO: 0.08130000000000003,
    __VCHART_ARC_START_ANGLE: 3.0988669935009723,
    __VCHART_ARC_END_ANGLE: 3.609689958974673,
    __VCHART_ARC_MIDDLE_ANGLE: 3.3542784762378224,
    __VCHART_ARC_RADIAN: 0.5108229654737005,
    __VCHART_ARC_QUADRANT: 4,
    __VCHART_ARC_K: 0.17446351931330473,
    VGRAMMAR_DATA_ID_KEY_16: 2
  },
  {
    type: 'iron',
    value: '5',
    __VCHART_DEFAULT_DATA_INDEX: 3,
    __VCHART_DEFAULT_DATA_KEY: 'iron_iron_0',
    __VCHART_ARC_RATIO: 0.05000000000000001,
    __VCHART_ARC_START_ANGLE: 3.609689958974673,
    __VCHART_ARC_END_ANGLE: 3.9238492243336522,
    __VCHART_ARC_MIDDLE_ANGLE: 3.7667695916541626,
    __VCHART_ARC_RADIAN: 0.31415926535897937,
    __VCHART_ARC_QUADRANT: 4,
    __VCHART_ARC_K: 0.1072961373390558,
    VGRAMMAR_DATA_ID_KEY_16: 3
  },
  {
    type: 'calcium',
    value: '3.63',
    __VCHART_DEFAULT_DATA_INDEX: 4,
    __VCHART_DEFAULT_DATA_KEY: 'calcium_calcium_0',
    __VCHART_ARC_RATIO: 0.036300000000000006,
    __VCHART_ARC_START_ANGLE: 3.9238492243336522,
    __VCHART_ARC_END_ANGLE: 4.151928850984271,
    __VCHART_ARC_MIDDLE_ANGLE: 4.037889037658962,
    __VCHART_ARC_RADIAN: 0.228079626650619,
    __VCHART_ARC_QUADRANT: 4,
    __VCHART_ARC_K: 0.0778969957081545,
    VGRAMMAR_DATA_ID_KEY_16: 4
  },
  {
    type: 'sodium',
    value: '2.83',
    __VCHART_DEFAULT_DATA_INDEX: 5,
    __VCHART_DEFAULT_DATA_KEY: 'sodium_sodium_0',
    __VCHART_ARC_RATIO: 0.028300000000000006,
    __VCHART_ARC_START_ANGLE: 4.151928850984271,
    __VCHART_ARC_END_ANGLE: 4.329742995177454,
    __VCHART_ARC_MIDDLE_ANGLE: 4.240835923080862,
    __VCHART_ARC_RADIAN: 0.17781414419318234,
    __VCHART_ARC_QUADRANT: 4,
    __VCHART_ARC_K: 0.06072961373390558,
    VGRAMMAR_DATA_ID_KEY_16: 5
  },
  {
    type: 'potassium',
    value: '2.59',
    __VCHART_DEFAULT_DATA_INDEX: 6,
    __VCHART_DEFAULT_DATA_KEY: 'potassium_potassium_0',
    __VCHART_ARC_RATIO: 0.025900000000000003,
    __VCHART_ARC_START_ANGLE: 4.329742995177454,
    __VCHART_ARC_END_ANGLE: 4.492477494633405,
    __VCHART_ARC_MIDDLE_ANGLE: 4.411110244905429,
    __VCHART_ARC_RADIAN: 0.1627344994559513,
    __VCHART_ARC_QUADRANT: 4,
    __VCHART_ARC_K: 0.055579399141630896,
    VGRAMMAR_DATA_ID_KEY_16: 6
  },
  {
    type: 'others',
    value: '3.5',
    __VCHART_DEFAULT_DATA_INDEX: 7,
    __VCHART_DEFAULT_DATA_KEY: 'others_others_0',
    __VCHART_ARC_RATIO: 0.035,
    __VCHART_ARC_START_ANGLE: 4.492477494633405,
    __VCHART_ARC_END_ANGLE: 4.71238898038469,
    __VCHART_ARC_MIDDLE_ANGLE: 4.602433237509048,
    __VCHART_ARC_RADIAN: 0.21991148575128555,
    __VCHART_ARC_QUADRANT: 4,
    __VCHART_ARC_K: 0.07510729613733905,
    VGRAMMAR_DATA_ID_KEY_16: 7
  }
];

function createContent(stage: Stage) {
  const pieSpec = pieGenerator();
  const pieGroup = createGroup(pieSpec.attribute);
  pieGroup.name = pieSpec.name;
  pieGroup.id = pieSpec._uid;
  stage.defaultLayer.add(pieGroup);
  pieSpec.children.forEach(c => {
    pieGroup.add(createArc(c.attribute));
  });

  const pieLabel = new ArcLabel({
    baseMarkGroupName: pieSpec.name,
    data: pieSpec.children.map((c, index) => {
      return {
        text: 'test122344556778891234550987665544'
        // text: latestData[index].type
        // text: originData[index].id
        // fill: c.attribute.fill,
        // line: {
        //   stroke: c.attribute.stroke
        // },
        // lineWidth: 0
        // ...latestData[index]
      };
    }),
    type: 'arc',
    // animation: false,
    animation: {
      // mode: 'same-time',
      // duration: 300,
      // easing: 'linear'
    },
    width: 800,
    height: 500,
    // position: 'outside',

    // position: 'inside',

    textStyle: {
      // angle: 0
      fontSize: 16
    },
    line: {
      line1MinLength: 30
    },
    layout: {
      // align: 'edge'
      // tangentConstraint: false
    },

    // centerOffset: 10,

    smartInvert: false,

    // coverEnable: false,
    // layout: {
    //   strategy: 'none'
    // },

    zIndex: 302
  });

  stage.defaultLayer.add(pieLabel);

  return { pie: pieGroup, label: pieLabel };
}

const stage = createRenderer('main', {
  width: 800,
  height: 500,
  viewBox: {
    x1: 0,
    y1: 0,
    x2: 800,
    y2: 500
  }
});
const { pie, label } = createContent(stage);
stage.render();
// gui
const gui = new GUI();
const guiObject = {
  name: 'Label',
  position: 'outside',
  baseMarkVisible: true,
  shapeCount: 100,
  overlap: true,
  debug() {
    label.render();
  }
};

gui.add(guiObject, 'name');
gui.add(guiObject, 'position', ['outside', 'inside']);
gui.add(guiObject, 'baseMarkVisible').onChange(value => {
  pie.forEachChildren(s => s.setAttribute('visible', !!value));
});
gui.add(guiObject, 'overlap').onChange(value => {
  label.setAttribute('overlap', {
    enable: value
  });
});

gui.add(guiObject, 'debug');
