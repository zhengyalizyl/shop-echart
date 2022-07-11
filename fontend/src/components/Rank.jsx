import React, { useEffect, useMemo, useRef, useState, useImperativeHandle,forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as echarts from 'echarts'
import './index.css'
import { getRank } from '../actions/rankActions';
import chalk from '../utils/chalk'
import SocketService from '../utils/socket_service';
import vintage from '../utils/vintage';

const Rank = forwardRef((_, ref) => {
    const rankRef = useRef(ref);
    // const rankRef = ref;
    const dispatch = useDispatch();
    const [chartInstance, setChartInstance] = useState(null);
    const rankData = useSelector(state => state.rankData);
    const { loading, rankList } = rankData;
    const [count, setCount] = useState(0);
    const timerId = useRef(null);//定时器须得独一无二的
    const themeData=useSelector(state=>state.themeData);
    useEffect(() => {
        chartInstance&&chartInstance.dispose()
       initChart();
       return () => {
        clearInterval(timerId.current)
    }
    },[themeData]);

    useEffect(() => {
        screenAdapter();
        window.addEventListener('resize', screenAdapter);

        return () => {
            window.removeEventListener('resize', screenAdapter)
        }
    }, [chartInstance]);


    useImperativeHandle(ref, () => ({
        screenAdapt: () => {
            screenAdapter();
        }
    }));

    useEffect(() => {
        geRankData();
        SocketService.Instance.send({
            action: 'getData',
            socketType: 'rankData',
            chartName: 'rank',
            value: ''
        })
        return () => {
            SocketService.Instance.unRegisterCallBack('rankData')
        }
    }, [])


    const getStartValue = useMemo(() => {
        return count
    }, [count])

    const getEndVAlue = useMemo(() => {
        return count + 9
    }, [count])

    useEffect(() => {
        updateChart();
        startInterval();
    }, [rankList, count,chartInstance])

    useEffect(() => {
        if (chartInstance) {
            chartInstance.on('mouseover', () => {
                clearInterval(timerId.current)
            })
            chartInstance.on('mouseout', () => {
                startInterval();
            })
        }
    }, [chartInstance, count])

    const startInterval = () => {
        timerId.current && clearInterval(timerId.current);
        timerId.current = setInterval(() => {
            if (getEndVAlue > rankList.length - 1) {
                setCount(0)
            } else {
                setCount(count + 1)
            }
        }, 2000)

    }

    const initChart = () => {
        console.log(themeData)
        const  themeColor=themeData==='chalk'?chalk:vintage;
        echarts.registerTheme('chalk', themeColor)
        const mychart = echarts.init(rankRef.current, 'chalk');
        setChartInstance(mychart);
        const initOption = {
            title: {
                text: '| 地区销售排行',
                left: 20,
                top: 20
            },
            tooltip: {
                show: true
            },
            dataZoom: {
                show: false,
                startValue: getStartValue,
                endValue: getEndVAlue,
            },
            grid: {
                top: '40%',
                left: '5%',
                right: '5%',
                bottom: '5%',
                containerLabel: true
            },
            xAxis: {
                type: 'category',
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                type: 'bar'
            }]
        };
        mychart.setOption(initOption);
    }


    const updateChart = () => {
        const colorArr = [
            ['#0BA82C', '#4FF778'],
            ['#2E72BF', '#23E5E5'],
            ['#5052EE', '#AB6EE5']
        ]
        if (rankList) {
            const updateOption = {
                xAxis: {
                    data: rankList.map(item => item.name)
                },
                dataZoom: {
                    startValue: getStartValue,
                    endValue: getEndVAlue,
                },
                series: [{
                    data: rankList.sort((a, b) => b.value - a.value).map(item => item.value),
                    itemStyle: {
                        color: (item) => {
                            let targetColorArr = null
                            if (item.value > 300) {
                                targetColorArr = colorArr[0]
                            } else if (item.value > 200) {
                                targetColorArr = colorArr[1]
                            } else {
                                targetColorArr = colorArr[2]
                            }
                            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: targetColorArr[0]
                                },
                                {
                                    offset: 1,
                                    color: targetColorArr[1]
                                }
                            ])
                        }
                    }
                }]
            };
            chartInstance && chartInstance.setOption(updateOption);
        }


    }
    const screenAdapter = () => {
        const titleFontSize = rankRef.current.offsetWidth / 100 * 3.6;
        const screenOption = {
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
            series: [{
                barWidth: titleFontSize,
                itemStyle: {
                    barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]

                }
            }]
        };
        chartInstance && chartInstance.setOption(screenOption);
        chartInstance && chartInstance.resize();
    }

    const geRankData = () => {
        dispatch(getRank());
    }

    return (
        <div className='com-container' >
            <div className="com-chart" ref={rankRef}></div>
        </div>
    )
})

export default Rank;
