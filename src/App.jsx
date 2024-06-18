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
  data: [],
};

options.data = options.xAxis.data.map((x, i) => ({
  day: x,
  value: options.yAxis.data[i],
}));
export default function App() {
  return (
    <div>
      <D3Line options={options} />
    </div>
  );
}
