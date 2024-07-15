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
  const option = options || {
    width: 400,
    height: 200,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    xAxis: {
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
    data: [
      {
        name: 'Mon',
        value: 820,
      },
      {
        name: 'Tue',
        value: 932,
      },
      {
        name: 'Wed',
        value: 901,
      },
      {
        name: 'Thu',
        value: 934,
      },
      {
        name: 'Fri',
        value: 1290,
      },
      {
        name: 'Sat',
        value: 1330,
      },
      {
        name: 'Sun',
        value: 1320,
      },
    ],
  };
  const {
    marginBottom = 10,
    marginTop = 10,
    marginLeft = 10,
    marginRight = 10,
    width = 400,
    height = 200,
  } = option;

  useEffect(() => {
    const xTicks = generateXTickGap({
      width: width,
      marginLeft: marginLeft,
      marginRight: marginRight,
      length: option.xAxis.data.length,
    });
    let [minValue, maxValue] = d3.extent(option.data, (d) => d.value);
    minValue = minValue < 0 ? minValue : 0;

    const x = d3.scaleOrdinal(option.xAxis.data, xTicks);
    const y = d3
      .scaleLinear()
      .domain([maxValue, minValue])
      .nice()
      .rangeRound([marginBottom, height - marginTop - marginBottom]);

    const svg = d3
      .select('.main')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - marginBottom - 10})`)
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
      .call(d3.axisLeft(y).tickPadding(0).tickSizeInner(0).tickSizeOuter(0));

    const line = d3
      .line()
      .x((d) => x(d.name))
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
        { offset: y(860) / height, color: 'blue' },
        { offset: y(860) / height, color: 'red' },
      ])
      .join('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    svg
      .append('path')
      .datum(option.data)
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
          `translate(${x.range()[index]}, ${y.invert(option.data[index].value)})`
        );

      tooltip
        .selectAll('text')
        .data([,])
        .join('text')
        .call((text) =>
          text
            .selectAll('tspan')
            .data([option.data[index].value])
            .join('tspan')
            .attr('x', 0)
            .attr('y', (_, i) => `${i * 1.1}em`)
            .attr('font-weight', (_, index) => (index ? null : 'bold'))
            .text((d) => d)
        );
    }

    function mouseleaveHandle() {
      tooltip.style('display', 'none');
    }
  }, [option.xAxis]);

  return (
    <div
      style={{ width: width + 'px', height: height + 'px' }}
      className="main"
    ></div>
  );
}
