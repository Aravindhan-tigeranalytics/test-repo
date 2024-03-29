import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'nwn-baseline-lift-chart',
    templateUrl: './baseline-lift-chart.component.html',
    styleUrls: ['./baseline-lift-chart.component.css'],
})
export class BaselineLiftChartComponent implements OnInit {
    // private data = [
    //     { group: 'baseSales', baseline: '1450000', lift: '200000' },
    //     { group: 'simulatedSales', baseline: '1600000', lift: '250000' },
    // ];
    private data = [
        {
            group: 'Baseline vs Lift',
            baseline1: ['1450000', '200000'],
            baseline2: ['1600000', '250000'],
        },
    ];

    private svg: any;
    private margin = { top: 10, right: 0, bottom: 20, left: 60 };
    private boundingWidth = 186 - this.margin.left - this.margin.right;
    private boundingHeight = 400 - this.margin.top - this.margin.bottom;

    public ngOnInit() {
        this.createSvg();
        this.drawBars(this.data);
    }

    private createSvg(): void {
        this.svg = d3
            .select('#baselineLiftChart')
            .append('svg')
            // Wrapper
            .attr('width', this.boundingWidth + this.margin.left + this.margin.right)
            .attr('height', this.boundingHeight + this.margin.top + this.margin.bottom)
            // Bounds starting at 0X0 from margin left and top
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    }

    private drawBars(data: any[]): void {
        const boundingHeight = this.boundingHeight;
        // Maxim value in the data to find the maximum bound dynamically
        const maximumValueInData = Math.max(
            ...data.map((d) => {
                const v1 = parseInt(d.baseline1[0]) + parseInt(d.baseline1[1]);
                const v2 = parseInt(d.baseline2[0]) + parseInt(d.baseline2[1]);
                return v1 >= v2 ? v1 : v2;
            }),
        );

        // List of groups
        const groups = data.map((d) => d.group);
        // List of subgroups
        const subGroups = ['baseline1', 'baseline2'];

        // Add X Axis
        const xScale = d3.scaleBand().domain(groups).range([0, this.boundingWidth]).padding(0.2);
        const xAxisGenerator = d3.axisBottom(xScale);
        this.svg
            .append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(0, ${this.boundingHeight})`)
            .call(xAxisGenerator)
            .call(d3.axisBottom(xScale).tickSizeOuter(0));

        // Add Y Axis - Dollar Value
        const yScale = d3
            .scaleLinear()
            .domain([0, maximumValueInData + maximumValueInData / 10])
            .range([this.boundingHeight, 0])
            // To make sure the axis starts and ends on round numbers
            .nice();
        const yAxisGenerator = d3.axisLeft(yScale);
        this.svg
            .append('g')
            .attr('class', 'yAxis')
            .call(yAxisGenerator)
            .call(d3.axisLeft(yScale).tickFormat(d3.format('$.2s')));

        // Another scale for subgroup position?
        const xSubgroup = d3
            .scaleBand()
            .domain(subGroups)
            .range([0, xScale.bandwidth()])
            .paddingInner(0.2)
            .paddingOuter(2.3);

        // color palette = one color per subgroup
        const color = d3.scaleOrdinal().domain(subGroups).range(['#7DD3FC', '#0284C7']);

        // Show the bars
        this.svg
            .append('g')
            .selectAll('g')
            // Enter in data = loop group per group
            .data(data)
            .join('g')
            .attr('class', 'group')
            .attr('transform', (d: any) => `translate(${xScale(d.group)}, 0)`)
            .attr('groupType', (d: any) => `${d.group}`)
            .attr('mainX', (d: any) => `${xScale(d.group)}`)
            .selectAll('rect')
            .data(function (d: any) {
                return subGroups.map(function (key) {
                    return { key: key, value1: d[key][0], value2: d[key][1] };
                });
            })
            .join('rect')
            .attr('id', 'base')
            .attr('x', (d: any) => xSubgroup(d.key))
            .attr('y', (d: any) => yScale(d.value1))
            .attr('width', xSubgroup.bandwidth())
            .attr('height', (d: any) => this.boundingHeight - yScale(d.value1))
            .attr('fill', (d: any) => color(d.key))
            .on('mouseover', mouseover)
            .on('mouseleave', mouseleave);

        // Stacked
        this.svg
            .append('g')
            .selectAll('g')
            // Enter in data = loop group per group
            .data(data)
            .join('g')
            .attr('class', 'group')
            .attr('transform', (d: any) => `translate(${xScale(d.group)}, 0)`)
            .attr('groupType', (d: any) => `${d.group}`)
            .attr('mainX', (d: any) => `${xScale(d.group)}`)
            .selectAll('rect')
            .data(function (d: any) {
                return subGroups.map(function (key) {
                    return { key: key, value1: d[key][0], value2: d[key][1] };
                });
            })
            .join('rect')
            .attr('id', 'lift')
            .attr('x', (d: any) => xSubgroup(d.key))
            .attr('y', (d: any) => yScale(d.value2) + yScale(d.value1) - this.boundingHeight)
            .attr('width', xSubgroup.bandwidth())
            .attr('height', (d: any) => this.boundingHeight - yScale(d.value2))
            .attr('fill', '#E0F2FE')
            .on('mouseover', mouseover)
            .on('mouseleave', mouseleave);

        const chart = this.svg;
        // Event handlers
        function mouseover(datum: any, index: any, nodes: any) {
            console.log({ datum, index, nodes });

            const xGroupPosition = parseFloat(d3.select(datum.target.parentNode).attr('mainX'));

            const xSubGroupPosition = parseFloat(d3.select(datum.target).attr('x'));
            const midPoint = xSubgroup.bandwidth() / 2;

            // Calculate optimal co-ordinates for Indicator
            const xPositionForIndicator = xGroupPosition + xSubGroupPosition + midPoint;

            // Calculate optimal co-ordinates for tooltip
            const xPositionForTooltip = xGroupPosition + xSubGroupPosition + midPoint - 62;
            const yPositionForTooltip = parseFloat(d3.select(datum.target).attr('y')) - 80;

            // Create a line
            chart
                .append('line')
                .attr('id', 'indicatorLine')
                .attr('x1', xPositionForIndicator)
                .attr('x2', xPositionForIndicator)
                .attr('y1', '0')
                .attr('y2', boundingHeight);

            // Create a blip
            chart
                .append('circle')
                .attr('id', 'indicatorBlip')
                .attr('cx', xPositionForIndicator)
                .attr('cy', parseFloat(d3.select(datum.target).attr('y')))
                .attr('r', '3')
                .attr('stroke', '#A1A1AA')
                .attr('stroke-width', '1')
                .attr('fill', '#E4E4E7');

            // Update the tooltip
            d3.select('#baseline-tooltip')
                .style('opacity', '1')
                .style('left', xPositionForTooltip + 'px')
                .style('top', yPositionForTooltip + 'px');
            if (d3.select(datum.target).attr('id') === 'base') {
                d3.select('#baseline-tooltip').select('#base').text(d3.format('$.2s')(index.value1));
            } else {
                d3.select('#baseline-tooltip').select('#base').text(d3.format('$.2s')(index.value2));
            }
            d3.select('#baseline-tooltip')
                .select('#baseColor')
                .style('background-color', d3.select(datum.target).attr('fill'));
            d3.select('#baseline-tooltip').select('#group').text(d3.select(datum.target.parentNode).attr('groupType'));
        }

        function mouseleave(datum: any, index: any, nodes: any) {
            // Update the tooltip
            d3.select('#baseline-tooltip').style('opacity', '0');
            chart.selectAll('#indicatorLine').remove();
            chart.selectAll('#indicatorBlip').remove();
        }
    }
}
