import '@/assets/style/timeline.scss';
import markerPointIcon from '@/assets/imgs/marker-pointer.png';
import { useEffect, useState } from 'react';
import { getDateStringByTimestamp } from '@/utils/index';
import TopAxisTimeline from './TopAxisTimeline';
import BottomAxisTimeline from './BottomAxisTimeline';
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
  const [timeInfo, setTimeInfo] = useState({
    axisPointStartTimeStamp: new Date('2024-7-17 08:00:00').getTime(),
    axisPointEndTimeStamp: new Date('2024-7-17 08:10:00').getTime(),
    currentRange: 1,
    startTimeStamp: new Date('2024-7-17 08:00:00').getTime(),
    endTimeStamp: new Date('2024-7-17 09:00:00').getTime(),
  });
  const [sliderRangeWidth] = useState(getSliderRangeWidth());

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
      updateAxisPointTime();
      return;
    }
    const pxPerms = 1193 / getTotalms();
    let step = 0;
    const timeSpan = Date.now() - lastRatioTime;

    if (lastRatioTime) {
      step = timeSpan * pxPerms;
    }

    setAxisWidth(axisWidth + step);
    lastRatioTime = Date.now();
    axisRatioTimer = requestAnimationFrame(updateAxis);
  }

  function getSliderRangeWidth() {
    const pxPerms = 1193 / (timeInfo.endTimeStamp - timeInfo.startTimeStamp);
    return pxPerms * getTotalms();
  }

  function updateAxisPointTime() {
    const startTime =
      timeInfo.axisPointStartTimeStamp + timeInfo.currentRange * 1000 * 60;
    const endTime =
      timeInfo.axisPointEndTimeStamp + timeInfo.currentRange * 1000 * 60;
    if (endTime <= timeInfo.endTimeStamp) {
      setTimeInfo(
        Object.assign(timeInfo, {
          axisPointStartTimeStamp: startTime,
          axisPointEndTimeStamp: endTime,
        })
      );
    } else {
      setTimeInfo(
        Object.assign(timeInfo, {
          axisPointStartTimeStamp:
            timeInfo.endTimeStamp - timeInfo.currentRange * 1000 * 60,
          axisPointEndTimeStamp: timeInfo.endTimeStamp,
        })
      );
    }
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
        <TopAxisTimeline axisWidth={axisWidth} timeInfo={timeInfo} />
      </div>
      <div className="timeline-bottom-wrapper">
        <BottomAxisTimeline
          sliderRangeWidth={sliderRangeWidth}
          timeInfo={timeInfo}
        />
      </div>
    </div>
  );
}
