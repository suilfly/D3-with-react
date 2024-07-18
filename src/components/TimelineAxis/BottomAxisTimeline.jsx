import { getDateStringByTimestamp } from '@/utils/index';

export default function BottomAxisTimeline({ sliderRangeWidth, timeInfo }) {
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

  return (
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
  );
}
