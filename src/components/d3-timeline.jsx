import '@/assets/style/timeline.scss';
import markerPointIcon from '@/assets/imgs/marker-pointer.png';
import { useState } from 'react';
const controlBtn = [
  {
    name: '暂停',
    selected: true,
  },
  {
    name: '回放',
    selected: false,
  },
  {
    name: '实时',
    selected: true,
  },
];

export default function D3AxisTimeLine() {
  const [controlList, setControlList] = useState(controlBtn);
  const currentDate = new Date();
  let currentRange = 'one-hour';
  function renderControlBtns() {
    return controlList.map(({ name, selected }) => {
      return <div className="timeline-top-btn">{name}</div>;
    });
  }
  return (
    <div className="timeline-wrapper">
      <div className="timeline-top-wrapper">
        <div className="timeline-control-btn">{renderControlBtns()}</div>
        <div className="timeline-axis-time">
          <div
            className="timeline-inner-progress"
            style={{
              width: '100px',
            }}
          >
            <img className="timeline-marker" src={markerPointIcon} />
          </div>
        </div>
      </div>
      <div className="timeline-bottom-wrapper"></div>
    </div>
  );
}
