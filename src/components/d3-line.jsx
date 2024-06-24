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
      [d3.max(options.yAxis.data), 0],
      [marginBottom, height - marginTop - marginBottom]
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
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickPadding(10)
          .tickSizeInner(0)
          .tickSizeOuter(0)
      );

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
      .append('linearGradient')
      .attr('id', '111')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', height)
      .selectAll('stop')
      .data([
        { offset: y(30) / height, color: 'blue' },
        { offset: y(30) / height, color: 'red' },
      ])
      .join('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    svg
      .append('path')
      .datum(options.data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#111)')
      .attr('stroke-width', 1.5)
      .attr('d', line)
      .on('pointermove', mousemoveHandler)
      .on('pointerleave', mouseleaveHandle);

    // 提示框tooltip
    const tooltip = svg.append('g');
    const path = tooltip
      .selectAll('path')
      .data([,])
      .join('path')
      .attr('fill', 'white')
      .attr('stroke', 'black');

    function mousemoveHandler(event) {
      const index = d3.bisectCenter(x.range(), d3.pointer(event)[0]);

      tooltip
        .style('display', 'block')
        .attr(
          'transform',
          `translate(${x.range()[index]}, ${y.invert(options.data[index].value)})`
        );

      const text = tooltip
        .selectAll('text')
        .data([,])
        .join('text')
        .call((text) =>
          text
            .selectAll('tspan')
            .data([111, 22])
            .join('tspan')
            .attr('x', 0)
            .attr('y', (_, i) => `${index * 1.1}em`)
            .attr('font-weight', (_, index) => (index ? null : 'bold'))
            .text((d) => d)
        );
    }

    function mouseleaveHandle() {
      tooltip.style('display', 'none');
    }
  }, [options.xAxis]);

  return (
    <div
      style={{ width: width + 'px', height: height + 'px' }}
      className="main"
    ></div>
  );
}
