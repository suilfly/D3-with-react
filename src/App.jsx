import './index.js';
import D3Line from './components/d3-line.jsx';
const options = {
  width: 400,
  height: 200,
  marginLeft: 30,
  marginRight: 30,
  marginBottom: 20,
  xAxis: {
    data: ['周一', '周二', '周三', '周四', '周五'],
  },
  yAxis: {
    data: [12, 34, 100, 22, 32],
  },
  data: [
    {
      day: '周一',
      value: 12,
    },
    {
      day: '周二',
      value: 34,
    },
    {
      day: '周三',
      value: 100,
    },
    {
      day: '周四',
      value: 22,
    },
    {
      day: '周五',
      value: 32,
    },
  ],
};
export default function App() {
  return (
    <div>
      <D3Line options={options} />
    </div>
  );
}
