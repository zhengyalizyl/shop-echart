import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as echarts from 'echarts';
import { useDispatch, useSelector } from 'react-redux';
import { getSeller } from '../actions/sellerActions';
import './index.css'
import SocketService from '../utils/socket_service';
import chalk from '../utils/chalk';
import vintage from '../utils/vintage';

const Seller = forwardRef((_, ref) => {
    const sellerRef = useRef(ref)
    const [chartInstance, setChartInstance] = useState(null);
    const dispatch = useDispatch();
    const sellerData = useSelector(state => state.sellerData);
    const { sellerList = [], loading } = sellerData;
    const [current, setCurrent] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const timerId = useRef(null);//定时器须得独一无二的
    const themeData=useSelector(state=>state.themeData);
    useEffect(() => {
        chartInstance&&chartInstance.dispose()
       initChart();
       return () => {
        clearInterval(timerId.current)
    }
    },[themeData]);

    useImperativeHandle(ref, () => ({
        screenAdapt: () => {
            screenAdapter();
        }
    }));

    useEffect(() => {
        getData();
        SocketService.Instance.send({
            action: 'getData',
            socketType: 'sellerData',
            chartName: 'seller',
            value: ''
        })
        return () => {
            SocketService.Instance.unRegisterCallBack('sellerData')
        }
    }, [])

    useEffect(() => {
        screenAdapter();
        window.addEventListener('resize', screenAdapter);
        return () => {
            window.removeEventListener('resize', screenAdapter)
        }
    }, [chartInstance])
    const initChart = () => {
        const  themeColor=themeData==='chalk'?chalk:vintage;
        echarts.registerTheme('chalk', themeColor)
        const sellChart = echarts.init(sellerRef.current,'chalk');
        setChartInstance(sellChart);
        const initOption = {
            title: {
                text: '| 商家销售统计',
                textStyle: {
                    fontSize: 66
                },
                left: 20,
                top: 20
            },
            xAxis: {
                type: 'value',
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '6%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'category',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        width: 66,
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }
            },
            series: [{
                type: 'bar',
                barWidth: 66,
                label: {
                    show: true,
                    position: 'right',
                    textStyle: {
                        color: 'white'
                    }
                },
                itemStyle: {
                    barBorderRadius: [0, 33, 33, 0],
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 1, 0, [{
                            offset: 0,
                            color: '#5052ee'
                        }, {
                            offset: 1,
                            color: '#ab6ee5'
                        }]
                    )
                }
            }]
        }
        sellChart.setOption(initOption);

    }
    useEffect(() => {
        if (chartInstance) {
            chartInstance.on('mouseover', () => {
                clearInterval(timerId.current)
            })
            chartInstance.on('mouseout', () => {
                startInterval();
            })
        }
    }, [chartInstance, current, totalPage])

    const getData = () => {
        dispatch(getSeller())
    }
    useEffect(() => {
        updateData();
        startInterval();
    }, [sellerList, chartInstance, current, totalPage]);

    const updateData = () => {
        const sellerSortData = sellerList.sort((a, b) => a.value - b.value);
        const len = sellerSortData.length;
        setTotalPage(len % 5 === 0 ? len / 5 : len / 5 + 1);
        const start = (current - 1) * 5;
        const end = current * 5;
        const showData = sellerSortData.slice(start, end)
        const option = {
            yAxis: {
                data: showData.map(item => item.name),
            },
            series: [{
                data: showData.map(item => item.value),
            }]
        }

        chartInstance && chartInstance.setOption(option);
    }

    const startInterval = () => {
        if (timerId.current) {
            clearInterval(timerId.current);
        }

        timerId.current = setInterval(() => {
            if (current >= totalPage) {
                setCurrent(1)
            } else {
                setCurrent(current + 1);
            }
        }, 3000);
    }

    const screenAdapter = () => {
        const titleFontSize = sellerRef.current.offsetWidth / 100 * 3.6;
        const adapterOption = {
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
                    barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
                }
            }]
        }
        chartInstance && chartInstance.setOption(adapterOption);
        chartInstance && chartInstance.resize();
    }


    return (
        <div className='com-container' >
            <div className="com-chart" ref={sellerRef}></div>
        </div>
    )
})

export default Seller;
