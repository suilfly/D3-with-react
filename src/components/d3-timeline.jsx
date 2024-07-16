import '@/assets/style/timeline.scss';
import markerPointIcon from '@/assets/imgs/marker-pointer.png';
import { useEffect, useState } from 'react';
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
  const [axisWidth, setAxisWidth] = useState(0);
  const timeInfo = {
    startTimeStamp: null,
    endTimeStamp: null,
    currentRange: 5,
  };

  let axisRatioTimer = null;
  let lastRatioTime = null;

  function renderControlBtns() {
    return controlList.map(({ name, selected }) => {
      return (
        <div className="timeline-top-btn" key={name}>
          {name}
        </div>
      );
    });
  }

  function getTotalms() {
    return timeInfo.currentRange * 1000 * 60;
  }

  function updateAxis() {
    if (axisWidth >= 1193) {
      setAxisWidth(0);
      return;
    }
    const pxPerms = 1193 / getTotalms();
    let step = 0;
    if (lastRatioTime) {
      step = (Date.now() - lastRatioTime) * pxPerms;
    }

    lastRatioTime = Date.now();
    setAxisWidth(axisWidth + step);
    axisRatioTimer = requestAnimationFrame(updateAxis);
  }

  useEffect(() => {
    updateAxis();

    return () => {
      axisRatioTimer && cancelAnimationFrame(axisRatioTimer);
      axisRatioTimer = null;
    };
  });
  return (
    <div className="timeline-wrapper">
      <div className="timeline-top-wrapper">
        <div className="timeline-control-btn">{renderControlBtns()}</div>
        <div className="timeline-axis-time">
          <div
            className="timeline-inner-progress"
            style={{
              width: axisWidth + 'px',
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
