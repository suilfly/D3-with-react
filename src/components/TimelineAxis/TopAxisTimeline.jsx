import markerPointIcon from '@/assets/imgs/marker-pointer.png';
import { getDateStringByTimestamp } from '@/utils/index';

export default function TopAxisTimeline({ axisWidth, timeInfo }) {
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

  return (
    <div className="timeline-axis-time">
      <div
        className="timeline-inner-progress"
        style={{
          width: axisWidth + 'px',
        }}
      >
        <img className="timeline-marker" src={markerPointIcon} />
      </div>
      <div className="timeline-axis-label-wrapper">{renderTopAxisLabels()}</div>
    </div>
  );
}
