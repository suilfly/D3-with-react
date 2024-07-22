import '@/assets/style/timeline.scss';
import { useEffect, useState } from 'react';
import TopAxisTimeline from './TopAxisTimeline';
import BottomAxisTimeline from './BottomAxisTimeline';
import { getClassName, getDateStringByTimestamp } from '../../utils';

export default function D3AxisTimeLine() {
  const [controlBtn, setControlBtn] = useState([
    {
      name: '暂停',
      selected: false,
      callback: clickPauseOrPlayHandle,
    },
    {
      name: '回放',
      selected: false,
      callback: () => {},
    },
    {
      name: '实时',
      selected: false,
      callback: () => {},
    },
  ]);
  const [controlList] = useState(controlBtn);
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

  function clickPauseOrPlayHandle() {
    controlBtn[0].selected ? playTime() : pauseTime();
  }

  function pauseTime() {
    controlBtn[0].selected = true;
    controlBtn[0].name = '播放';
    setControlBtn([...controlBtn]);
    clearFrameTimer();
  }

  function playTime() {
    controlBtn[0].selected = false;
    controlBtn[0].name = '暂停';
    setControlBtn([...controlBtn]);
    clearFrameTimer();
  }

  function clearFrameTimer() {
    axisRatioTimer && cancelAnimationFrame(axisRatioTimer);
    axisRatioTimer = null;
  }

  /**
   * 时间轴上轴跳转到过去某一时刻
   * @param x 点击的偏移量
   */
  function jumpToHandle(x) {
    setAxisWidth(x);
    pauseTime();
  }

  /**
   * 时间轴下轴跳转到某范围
   * @param step 时间偏移量
   */
  function jumpToRangeHandle(step) {
    const tempStart = timeInfo.startTimeStamp + step;
    const tempEnd = timeInfo.axisPointEndTimeStamp + getTotalms();
    timeInfo.axisPointStartTimeStamp = new Date(
      getDateStringByTimestamp(tempStart, 'minute')
    ).getTime();
    timeInfo.axisPointEndTimeStamp = new Date(
      getDateStringByTimestamp(tempEnd, 'minute')
    ).getTime();

    setTimeInfo({ ...timeInfo });
    setAxisWidth(0);
    pauseTime();
  }

  function renderControlBtns() {
    return controlList.map(({ name, callback, selected }) => {
      return (
        <div
          className={getClassName([
            'timeline-top-btn',
            { 'btn-selected': selected },
          ])}
          key={name}
          onClick={callback}
        >
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
    if (!controlBtn[0].selected) {
      updateAxis();
    }

    return () => {
      clearFrameTimer();
    };
  }, [axisWidth, controlBtn]);
  return (
    <div className="timeline-wrapper">
      <div className="timeline-top-wrapper">
        <div className="timeline-control-btn">{renderControlBtns()}</div>
        <TopAxisTimeline
          axisWidth={axisWidth}
          timeInfo={timeInfo}
          onJumpTo={jumpToHandle}
        />
      </div>
      <div className="timeline-bottom-wrapper">
        <BottomAxisTimeline
          sliderRangeWidth={sliderRangeWidth}
          timeInfo={timeInfo}
          onJumpToRange={jumpToRangeHandle}
        />
      </div>
    </div>
  );
}
