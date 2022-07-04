import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useDispatch, useSelector } from 'react-redux';
import { getTrend } from '../actions/trendActions';
import chalk from '../utils/chalk'

export default function Trend() {
    const trendRef = useRef(null);
    const dispatch = useDispatch();
    const [chartInstance, setChartInstance] = useState(null);
    const trendData = useSelector(state => state.trendData);
    const { loading, trendList } = trendData;

    useEffect(() => {
        initChart();
        getTrendData();
    }, [])
    useEffect(() => {
        screenAdapter();
        window.addEventListener('resize', screenAdapter);
        return () => {
            window.removeEventListener('resize', screenAdapter)
        }
    }, [chartInstance]);

    useEffect(() => {
        updateTrendData();
    }, [chartInstance, trendList])

    const initChart = () => {
        echarts.registerTheme('chalk',chalk)
        const mychart = echarts.init(trendRef.current,'chalk');
        setChartInstance(mychart);
        const initOption = {
            title: {
                text: ''
            },
            grid:{
                
            },
            xAxis: {
                type: 'category',
            },
            yAxis: {
                type: 'value'
            }
        };
        mychart.setOption(initOption);
    }

    const getTrendData = () => {
        dispatch(getTrend())
    }

    const updateTrendData = () => {
        console.log(trendList, '==========');
        if (trendList) {
            const timeArr = trendList.common.month;
            const valueArr = trendList.map.data;
            const seriesArr = valueArr.map(item => {
                return {
                    name:item.name,
                    type: 'line',
                    data: item.data,
                    stack:'map'
                }
            })
            const legendArr=valueArr.map(item=>item.name)
            const dataOption = {
                xAxis: {
                    data: timeArr
                },
                legend:{
                    data:legendArr
                },
                series:seriesArr
            };
            chartInstance.setOption(dataOption);
        }
    }

    const screenAdapter = () => {
        const adapterOption = {}
            ;
        chartInstance && chartInstance.setOption(adapterOption);
        chartInstance && chartInstance.resize();

    }

    return (
        <div className="com-container">
            <div className="com-chart"  id="a" ref={trendRef}>

            </div>
        </div>
    )
}
