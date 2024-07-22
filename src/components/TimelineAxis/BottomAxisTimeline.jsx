import { getDateStringByTimestamp } from '@/utils/index';
import { useState } from 'react';

export default function BottomAxisTimeline({
  sliderRangeWidth,
  timeInfo,
  onJumpToRange,
}) {
  let left = 0;

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

  function getSliderPostion() {
    const distance = timeInfo.axisPointStartTimeStamp - timeInfo.startTimeStamp;
    const totalDistance = timeInfo.endTimeStamp - timeInfo.startTimeStamp;
    left = (1193 / totalDistance) * distance;
    return left;
  }

  function jumpToRangeHandle(e) {
    e.stopPropagation();
    const mouse = e.nativeEvent;
    const stepTimeStamp = parseInt(
      ((timeInfo.endTimeStamp - timeInfo.startTimeStamp) * mouse.offsetX) / 1193
    );
    onJumpToRange(stepTimeStamp);
  }

  return (
    <div className="timeline-range-wrapper">
      <div className="timeline-range" onClick={jumpToRangeHandle}>
        <div
          className="timeline-slider-block"
          style={{
            width: `${sliderRangeWidth}px`,
            left: `${getSliderPostion()}px`,
          }}
        ></div>
      </div>
      <div className="timeline-bottom-axis-wrapper">
        {renderBottomAxisLabels()}
      </div>
    </div>
  );
}
