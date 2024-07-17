import '@/assets/style/timeline.scss';
import markerPointIcon from '@/assets/imgs/marker-pointer.png';
import { useEffect, useState } from 'react';
import { getDateStringByTimestamp } from '@/utils/index';
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
  const [timeInfo] = useState({
    axisPointStartTimeStamp: new Date('2024-7-17 08:00:00').getTime(),
    axisPointEndTimeStamp: new Date('2024-7-17 08:10:00').getTime(),
    currentRange: 5,
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

  function renderTopAxisLabels() {
    const labelCount = 21;
    const labelSecondsInterval =
      (timeInfo.currentRange * 60) / (labelCount - 1);
    const labelWidth = 1193 / (labelCount - 1);

    return new Array(labelCount).fill().map((_, index) => {
      let timestamp =
        timeInfo.axisPointStartTimeStamp + index * labelSecondsInterval * 1000;

      if (index === 0) {
        timestamp = timeInfo.axisPointStartTimeStamp;
      }
      const label = getDateStringByTimestamp(timestamp, 'nodate');
      return (
        <div
          className="timeline-axis-label"
          style={{ width: `${labelWidth}px` }}
          key={index}
        >
          <p>{label}</p>
        </div>
      );
    });
  }

  function renderBottomAxisLabels() {
    const labelCount = 31;
    const interval =
      (timeInfo.endTimeStamp - timeInfo.startTimeStamp) / (labelCount - 1);
    const labelWidth = 1193 / (labelCount - 1);

    return new Array(labelCount).fill().map((_, index) => {
      let timestamp = timeInfo.startTimeStamp + index * interval;
      if (index === 0) {
        timestamp = timeInfo.startTimeStamp;
      }
      const label = getDateStringByTimestamp(timestamp, 'nodate-minute');
      return (
        <div
          className="timeline-axis-label"
          style={{ width: `${labelWidth}px` }}
          key={index}
        >
          <p>{label}</p>
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
          <div className="timeline-axis-label-wrapper">
            {renderTopAxisLabels()}
          </div>
        </div>
      </div>
      <div className="timeline-bottom-wrapper">
        <div className="timeline-range-wrapper">
          <div className="timeline-range">
            <div
              className="timeline-slider-block"
              style={{ width: `${sliderRangeWidth}px` }}
            ></div>
          </div>
          <div className="timeline-bottom-axis-wrapper">
            {renderBottomAxisLabels()}
          </div>
        </div>
      </div>
    </div>
  );
}
