import D3AxisLine from '../components/d3-line';
import D3AxisTimeLine from '../components/TimelineAxis/d3-timeline';

export const leftNavList = [
  {
    name: '组件',
    key: 'components',
    children: [
      {
        name: '折线图',
        key: '',
        component: <D3AxisLine />,
      },
      {
        name: '时间轴',
        key: 'components/time-line',
        component: <D3AxisTimeLine />,
      },
    ],
  },
];
