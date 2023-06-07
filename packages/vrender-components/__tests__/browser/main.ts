import './style.css';

const LOCAL_STORAGE_KEY = 'VRENDER_COMPONENTS_DEMOS';
const specs = [
  {
    path: 'size-legend',
    name: '连续尺寸图例'
  },
  {
    path: 'color-legend',
    name: '连续颜色图例'
  },
  {
    path: 'slider',
    name: 'slider'
  },
  {
    path: 'player',
    name: 'player'
  },
  {
    path: 'discrete-legend',
    name: '离散图例'
  },
  {
    path: 'discrete-legend-v',
    name: '离散图例-垂直'
  },
  {
    path: 'tag',
    name: '标签'
  },
  {
    path: 'label-symbol',
    name: '点布局 数据标签'
  },
  {
    path: 'label-rect',
    name: 'rect 数据标签'
  },
  {
    path: 'label-line',
    name: 'line 数据标签'
  },
  {
    path: 'label-multi-mark',
    name: '混合图元 数据标签'
  },
  {
    path: 'label-smart-inverse',
    name: '标签智能反色'
  },
  {
    path: 'scrollbar',
    name: '滚动条'
  },
  {
    path: 'crosshair-line',
    name: '直线型 crosshair'
  },
  {
    path: 'crosshair-rect',
    name: '矩形 crosshair'
  },
  {
    path: 'crosshair-circle',
    name: '圆形 crosshair'
  },
  {
    path: 'crosshair-sector',
    name: '扇形 crosshair'
  },
  {
    path: 'crosshair-polygon',
    name: '多边形 crosshair'
  },
  {
    path: 'segment',
    name: '两端可带 symbol 的线'
  },
  {
    path: 'line-axis',
    name: '笛卡尔坐标轴'
  },
  {
    path: 'animate-line-axis',
    name: '带动画的笛卡尔坐标轴'
  },
  {
    path: 'circle-axis',
    name: '极坐标系坐标轴'
  },
  {
    path: 'pick-test',
    name: '拾取测试'
  },
  // {
  //   path: 'data-zoom',
  //   name: '水平 dataZoom'
  // },
  {
    path: 'data-zoom-preview-v',
    name: '水平 背景图表 dataZoom'
  },
  // {
  //   path: 'data-zoom-left',
  //   name: '垂直 左 dataZoom'
  // },
  // {
  //   path: 'data-zoom-right',
  //   name: '垂直 右 dataZoom'
  // },
  // {
  //   path: 'data-zoom-preview-h',
  //   name: '垂直 背景图表 dataZoom'
  // },
  // {
  //   path: 'data-zoom-preview-set-state',
  //   name: '改变状态 dataZoom'
  // },
  // {
  //   path: 'data-zoom-text-visible',
  //   name: '文字显示 dataZoom'
  // },
  // {
  //   path: 'data-zoom-preview-style',
  //   name: '背景图表样式 dataZoom'
  // },
  // {
  //   path: 'data-zoom-middle-handler',
  //   name: '中间手柄 dataZoom'
  // },
  {
    path: 'title',
    name: '标题'
  },
  {
    path: 'title-animation',
    name: '标题动画'
  },
  {
    path: 'debug',
    name: '调试专用'
  },
  {
    path: 'link-path',
    name: 'link-path'
  },
  {
    path: 'mark-line',
    name: 'markLine'
  },
  {
    path: 'mark-area',
    name: 'markArea'
  },
  {
    path: 'mark-point',
    name: 'markPoint'
  },
  {
    path: 'indicator',
    name: '指标卡'
  },
  {
    path: 'brush',
    name: 'brush'
  }
];

const createSidebar = (node: HTMLDivElement) => {
  const specsHtml = specs.map(entry => {
    return `<p class="menu-item" data-path="${entry.path}">${entry.name}</p>`;
  });

  node.innerHTML = `
    <div>
      <p class="sidebar-title">组件列表</p>
      <div class="menu-list">
        ${specsHtml.join('')}
      </div>
    </div>
  `;
};

const ACTIVE_ITEM_CLS = 'menu-item-active';

const handleClick = (e: { target: any }, isInit?: boolean) => {
  const triggerNode = e.target;
  const prevActiveItems = document.getElementsByClassName(ACTIVE_ITEM_CLS);

  if (prevActiveItems && prevActiveItems.length) {
    for (let i = 0; i < prevActiveItems.length; i++) {
      const element = prevActiveItems[i];

      element.classList.remove(ACTIVE_ITEM_CLS);
    }
  }

  if (triggerNode) {
    const path = triggerNode.dataset.path;

    triggerNode.classList.add(ACTIVE_ITEM_CLS);
    if (!isInit) {
      localStorage.setItem(LOCAL_STORAGE_KEY, path);
    }

    import(`./examples/${path}.ts`)
      .then(module => {
        handleRelease();
        module.run?.();
      })
      .catch(err => {
        // console.log(err);
      });
  }
};

const handleRelease = () => {
  if (window.stage) {
    window.stage.release();
  }
  if (document.getElementById('layout')) {
    (document.getElementById('layout') as HTMLCanvasElement).style.visibility = 'hidden';
  }
};

const initSidebarEvent = (node: HTMLDivElement) => {
  node.addEventListener('click', handleClick);
};

const initReleaseEvent = (node: HTMLButtonElement) => {
  node.addEventListener('click', handleRelease);
};

const run = () => {
  const sidebarNode = document.querySelector<HTMLDivElement>('#sidebar')!;
  const prevActivePath = localStorage.getItem(LOCAL_STORAGE_KEY);
  // const releaseButton = document.querySelector<HTMLButtonElement>('#header .release-button')!;

  createSidebar(sidebarNode);
  initSidebarEvent(sidebarNode);
  // initReleaseEvent(releaseButton);

  const menuItemNodes = document.getElementsByClassName('menu-item');

  handleClick(
    {
      target:
        menuItemNodes &&
        menuItemNodes.length &&
        ([...menuItemNodes].find(node => {
          return prevActivePath && node.dataset.path === prevActivePath;
        }) ||
          menuItemNodes[0])
    },
    true
  );
};

run();
