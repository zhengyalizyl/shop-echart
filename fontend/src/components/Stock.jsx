import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStock } from '../actions/stockActions';
import * as echarts from 'echarts';
import chalk from '../utils/chalk';
import './index.css'

export default function Stock() {
    const stockRef = useRef(null);
    const dispatch = useDispatch();
    const [chartInstance, setChartInstance] = useState(null);
    const stockData = useSelector(state => state.stockData);
    const { loading, stockList } = stockData;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [titleFontSize, setTitleFontSize] = useState(0);
    const timerId = useRef(null)
    useEffect(() => {
        getData();
        initChart();
        return () => {
            clearInterval(timerId)
        }
    }, []);

    useEffect(() => {
        startInterval();
        updateChart();
        screenAdapter();
        window.addEventListener('resize', screenAdapter);
        return () => {
            window.removeEventListener('resize', screenAdapter)
        }
    }, [chartInstance, stockList, currentIndex])

    useEffect(()=>{
        if (chartInstance) {
            chartInstance.on('mouseover', () => {
                clearInterval(timerId.current)
            })
            chartInstance.on('mouseout', () => {
                startInterval();
            })
        }
    },[chartInstance,currentIndex])

    const startInterval = () => {
        if (timerId.current) {
            clearInterval(timerId.current)
        }
        timerId.current = setInterval(() => {
            currentIndex === 0 && setCurrentIndex(currentIndex + 5)
            currentIndex === 5 && setCurrentIndex(0)
        }, 2000)

    }

    

    const initChart = () => {
        echarts.registerTheme('chalk', chalk)
        const mychart = echarts.init(stockRef.current, 'chalk');
        setChartInstance(mychart);
        const options = {
            title: {
                text: '| 库存销售量',
                left: 20,
                top: 20
            },
            legend: {
                top: '10%',
                icon: 'circle'
            },
            tooptip: {
                show: true
            },
            series: [{
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true
                    },
                    labelLine: {
                        show: false
                    }
                }

            }]
        };
        mychart.setOption(options);
    }

    const updateChart = () => {
        if (stockList) {
            const centerArr = [
                ['18%', '40%'],
                ['50%', '40%'],
                ['82%', '40%'],
                ['34%', '75%'],
                ['66%', '75%']
            ]
            const colorArr = [
                ['#4FF778', '#0BA82C'],
                ['#E5DD45', '#E8B11C'],
                ['#E8821C', '#E55445'],
                ['#5052EE', '#AB6EE5'],
                ['#23E5E5', '#2E72BF']
            ];
            const seriesData = stockList.slice(currentIndex, currentIndex + 5).map((item, index) => {
                return {
                    type: 'pie',
                    name: item.name,
                    value: item.stock,
                    radius: [110, 100],
                    hoverAnimation: false, // 关闭鼠标移入到饼图时的动画效果
                    labelLine: {
                      show: false // 隐藏指示线
                    },
                    center: centerArr[index],
                    data: [{
                        name: item.name + '\n' + item.sales,
                        value: item.sales,
                        itemStyle:{
                            color:new echarts.graphic.LinearGradient(0,1,0,0,[
                                {
                                    offset:0,
                                    color:colorArr[index][0]
                                },
                                {
                                    offset:1,
                                    color:colorArr[index][1]
                                }
                            ])
                        }
                    }, {
                        value: item.stock,
                        itemStyle: {
                            color: '#333843'
                        }
                    }]
                }
            })
            const option = {
                tooltip: {
                    show: true,
                },
                series: seriesData
            };
            chartInstance && chartInstance.setOption(option)
        }


    }

    const getData = () => {
        dispatch(getStock())
    }

    const screenAdapter = () => {
        const titleFontSize = stockRef.current.offsetWidth / 100 * 3.6;
        const innerRadius = titleFontSize * 2
        const outterRadius = innerRadius * 1.125
        setTitleFontSize(titleFontSize)
        const screenOption = {
            legend: {
                temWidth: titleFontSize / 2,
                itemHeight: titleFontSize / 2,
                itemGap: titleFontSize / 2,
                textStyle: {
                    fontSize: titleFontSize / 2
                }
            },
            title: {
                textStyle: {
                    fontSize: titleFontSize
                },
            },
            tooltip: {
                axisPointer: {
                    lineStyle: {
                        width: titleFontSize,
                    }
                }
            },
            series: [
                {
                    type: 'pie',
                    radius: [outterRadius, innerRadius],
                    label: {
                        fontSize: titleFontSize / 2
                    }
                },
                {
                    type: 'pie',
                    radius: [outterRadius, innerRadius],
                    label: {
                        fontSize: titleFontSize / 2
                    }
                },
                {
                    type: 'pie',
                    radius: [outterRadius, innerRadius],
                    label: {
                        fontSize: titleFontSize / 2
                    }
                },
                {
                    type: 'pie',
                    radius: [outterRadius, innerRadius],
                    label: {
                        fontSize: titleFontSize / 2
                    }
                },
                {
                    type: 'pie',
                    radius: [outterRadius, innerRadius],
                    label: {
                        fontSize: titleFontSize / 2
                    }
                }

            ]
        };
        chartInstance && chartInstance.setOption(screenOption);
        chartInstance && chartInstance.resize();
    }
    return (
        <div className='com-container'  >
            <div className="com-chart" ref={stockRef}></div>
        </div>
    )
}
