import '@/assets/style/timeline.scss';
import { useEffect, useReducer, useState } from 'react';
import TopAxisTimeline from './TopAxisTimeline';
import BottomAxisTimeline from './BottomAxisTimeline';
import { getClassName, getDateStringByTimestamp } from '../../utils';

let triggerTimeCount = 0;
// 上一次采样点的时间
let lastTriggerTimeStamp = 0;
const initTimeInfo = {
  axisPointStartTimeStamp: new Date('2024-7-17 08:00:00').getTime(),
  axisPointEndTimeStamp: new Date('2024-7-17 08:01:00').getTime(),
  currentRange: 1,
  startTimeStamp: new Date('2024-7-17 08:00:00').getTime(),
  endTimeStamp: new Date('2024-7-17 09:00:00').getTime(),
};

function timeInfoReducer(timeInfo, action) {
  return {
    ...timeInfo,
    ...action,
  };
}

function controlBtnReducer(controlBtn, action) {
  return controlBtn.map((item, i) => {
    if (i === action.index) {
      return {
        ...item,
        ...action.obj,
      };
    }
    return item;
  });
}

export default function D3AxisTimeLine() {
  // 右侧按钮组
  const initControlBtn = [
    {
      name: '暂停',
      selected: false,
      callback: clickPauseOrPlayHandle,
    },
    {
      name: '实时',
      selected: false,
      callback: () => {},
    },
  ];
  const [controlBtn, controlBtnDispatch] = useReducer(
    controlBtnReducer,
    initControlBtn
  );

  const [axisWidth, setAxisWidth] = useState(0);
  // 如果一个state在多个event中更新，不如使用reducer,把更新的逻辑提取到组件外
  const [timeInfo, timeInfoDispatch] = useReducer(
    timeInfoReducer,
    initTimeInfo
  );
  const [sliderRangeWidth] = useState(getSliderRangeWidth());

  let axisRatioTimer = null;
  let lastRatioTime = null;

  function clickPauseOrPlayHandle(item) {
    item.selected ? playTime() : pauseTime();
  }

  function pauseTime() {
    controlBtnDispatch({
      index: 0,
      obj: {
        selected: true,
        name: '播放',
      },
    });

    clearFrameTimer();
  }

  function playTime() {
    controlBtnDispatch({
      index: 0,
      obj: {
        selected: false,
        name: '暂停',
      },
    });
    clearFrameTimer();
  }

  function clearFrameTimer() {
    axisRatioTimer && cancelAnimationFrame(axisRatioTimer);
    axisRatioTimer = null;
  }

  /**
   * 时间轴上轴宽度对应的时间
   * */
  function widthTransformToTimestamp({ width, totalTimeStamp }) {
    const timestamp = (totalTimeStamp / 1193) * width;

    return Math.ceil(timestamp + timeInfo.axisPointStartTimeStamp);
  }

  /**
   * 时间轴上轴跳转到过去某一时刻
   * @param x 点击的偏移量
   */
  function jumpToHandle(x) {
    setAxisWidth(x);
    sendTime(
      widthTransformToTimestamp({
        width: x,
        totalTimeStamp:
          timeInfo.axisPointEndTimeStamp - timeInfo.axisPointStartTimeStamp,
      })
    );
    clearTriggerTimeStamp();
    pauseTime();
  }

  function clearTriggerTimeStamp() {
    triggerTimeCount = 0;
  }

  /**
   * 时间轴下轴跳转到某范围
   * @param step 时间偏移量
   */
  function jumpToRangeHandle(step) {
    const tempStart = new Date(
      getDateStringByTimestamp(timeInfo.startTimeStamp + step, 'minute')
    ).getTime();
    const tempEnd = new Date(
      getDateStringByTimestamp(
        timeInfo.axisPointEndTimeStamp + getTotalms(),
        'minute'
      )
    ).getTime();

    timeInfoDispatch({
      axisPointStartTimeStamp:
        tempStart < timeInfo.startTimeStamp
          ? timeInfo.startTimeStamp
          : tempStart,
      axisPointEndTimeStamp:
        tempEnd > timeInfo.endTimeStamp ? timeInfo.endTimeStamp : tempEnd,
    });

    setAxisWidth(0);
    pauseTime();
  }

  function renderControlBtns() {
    return controlBtn.map(({ name, callback, selected }) => {
      return (
        <div
          className={getClassName([
            'timeline-top-btn',
            { 'btn-selected': selected },
          ])}
          key={name}
          onClick={() => callback({ selected })}
        >
          {name}
        </div>
      );
    });
  }

  function getTotalms() {
    return timeInfo.currentRange * 1000 * 60;
  }

  function sendTime(timestamp) {
    lastTriggerTimeStamp = timestamp;
    console.log(timestamp);
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
      triggerTimeCount += timeSpan;

      if (triggerTimeCount >= 5000) {
        lastTriggerTimeStamp += 5000;
        sendTime(lastTriggerTimeStamp);
        clearTriggerTimeStamp();
      }
    }

    setAxisWidth((width) => width + step);
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
      timeInfoDispatch({
        axisPointStartTimeStamp: startTime,
        axisPointEndTimeStamp: endTime,
      });
    } else {
      timeInfoDispatch({
        axisPointStartTimeStamp:
          timeInfo.endTimeStamp - timeInfo.currentRange * 1000 * 60,
        axisPointEndTimeStamp: timeInfo.endTimeStamp,
      });
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

  useEffect(() => {
    lastTriggerTimeStamp = timeInfo.axisPointStartTimeStamp;
  }, []);

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
