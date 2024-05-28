import { useEffect } from 'react';

export default function D3AxisLine({ options }) {
  useEffect(() => {
    const x = d3.scaleOrdinal(options.xAxis.data, [10, 95, 180, 265, 350]);
    const y = d3.scaleLinear([0, d3.max(options.yAxis.data)], [175, 10]);

    const svg = d3
      .select('.main')
      .append('svg')
      .attr('width', 400)
      .attr('height', 200)
      .attr('viewBox', [0, 0, 400, 200]);

    svg
      .append('g')
      .attr('transform', `translate(20, 180)`)
      .call(d3.axisBottom(x));

    svg
      .append('g')
      .attr('transform', `translate(30, 0)`)
      .call(d3.axisLeft(y).ticks(4));

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
    <div style={{ width: '400px', height: '200px' }} className="main"></div>
  );
}
