import { useEffect } from 'react';

const generateXTickGap = ({ length, marginLeft, marginRight, width }) => {
  const endWidth = width - marginRight;
  const startWidth = marginLeft;
  const gap = (endWidth - startWidth) / (length - 1);
  return new Array(length).fill().map((_, index) => {
    return startWidth + gap * index;
  });
};

export default function D3AxisLine({ options }) {
  const {
    marginBottom = 0,
    marginTop = 0,
    marginLeft = 0,
    marginRight = 0,
    width = 0,
    height = 0,
  } = options;
  useEffect(() => {
    const xTicks = generateXTickGap({
      width: width,
      marginLeft: marginLeft,
      marginRight: marginRight,
      length: options.xAxis.data.length,
    });
    const x = d3.scaleOrdinal(options.xAxis.data, xTicks);
    const y = d3.scaleLinear(
      [0, d3.max(options.yAxis.data)],
      [height - marginTop - marginBottom, marginBottom]
    );

    const svg = d3
      .select('.main')
      .append('svg')
      .attr('width', 400)
      .attr('height', 200)
      .attr('viewBox', [0, 0, 400, 200]);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - marginBottom})`)
      .call(d3.axisBottom(x).tickPadding(10).tickSizeInner(0).tickSizeOuter(0));

    svg
      .append('g')
      .attr('transform', `translate(${marginLeft}, 0)`)
      .call(
        d3
          .axisLeft(y)
          .tickPadding(10)
          .ticks(4)
          .tickSizeInner(0)
          .tickSizeOuter(0)
      );

    const line = d3
      .line()
      .x((d) => x(d.day))
      .y((d) => y(d.value));

    svg
      .append('path')
      .datum(options.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }, [options.xAxis]);

  return (
    <div
      style={{ width: width + 'px', height: height + 'px' }}
      className="main"
    ></div>
  );
}
