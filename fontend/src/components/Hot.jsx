import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHot } from '../actions/hotActions';
import * as echarts from 'echarts';
import chalk from '../utils/chalk';
import './index.css'
import SocketService from '../utils/socket_service';

export default function Hot() {
    const hotRef = useRef(null);
    const dispatch = useDispatch();
    const [chartInstance, setChartInstance] = useState(null);
    const hotData = useSelector(state => state.hotData);
    const { loading, hotList } = hotData;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [titleFontSize, setTitleFontSize] = useState(0);
    useEffect(() => {
        initChart();
    }, []);

  
    useEffect(() => {
        getData();
        SocketService.Instance.send({
            action: 'getData',
            socketType: 'hotproductData',
            chartName: 'hotproduct',
            value: ''
        })
        return () => {
            SocketService.Instance.unRegisterCallBack('hotproductData')
        }
    }, [])

    useEffect(() => {
        updateChart();
        screenAdapter();
        window.addEventListener('resize', screenAdapter);
        return () => {
            window.removeEventListener('resize', screenAdapter)
        }
    }, [chartInstance, hotList, currentIndex])



    const initChart = () => {
        echarts.registerTheme('chalk', chalk)
        const mychart = echarts.init(hotRef.current, 'chalk');
        setChartInstance(mychart);
        const options = {
            title: {
                text: '| 热销商品销售金额占比统计',
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
                type: 'pie',
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
        mychart.setOption(options)
    }

    const updateChart = () => {
        if (hotList) {
            const legendData = hotList[currentIndex].children.map(item => {
                return item.name
            })
            const seriesData = hotList[currentIndex].children.map(item => {
                return {
                    name: item.name,
                    value: item.value,
                    children: item.children
                }
            })
            const option = {
                tooltip: {
                    show: true,
                    formatter: arg => {
                        const thirdCategory = arg.data.children
                        // 计算出所有三级分类的数值总和
                        const total = thirdCategory.reduce((pre, next) => pre + next.value, 0)
                        console.log(total)
                        let retStr = ''
                        thirdCategory.forEach(item => {
                            retStr += `
                          ${item.name}:${parseInt(item.value / total * 100) + '%'}
                          <br/>
                          `
                        })
                        return retStr
                    }
                },
                legend: {
                    data: legendData
                },
                series: [{
                    data: seriesData
                }]
            };
            chartInstance && chartInstance.setOption(option)
        }


    }

    const getData = () => {
        dispatch(getHot())
    }

    const toLeft = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        } else {
            setCurrentIndex(hotList.length - 1)
        }
    }
    const toRight = () => {
        if (currentIndex < hotList.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            setCurrentIndex(0)
        }
    }

    const screenAdapter = () => {
        const titleFontSize = hotRef.current.offsetWidth / 100 * 3.6;
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
            series: [{
                radius: titleFontSize *8,
                center: ['50%', '50%']
            }]
        };
        chartInstance && chartInstance.setOption(screenOption);
        chartInstance && chartInstance.resize();
    }
    return (
        <div className='com-container'  >
            <div className="com-chart" ref={hotRef}></div>
            <span className="iconfont arr-left" style={{ fontSize: titleFontSize }} onClick={toLeft}>&#xe6ef;</span>
            <span className="iconfont arr-right" style={{ fontSize: titleFontSize }} onClick={toRight}>&#xe6ed;</span>
            <span className="cat-name" style={{ fontSize: titleFontSize }}>{hotList && hotList[currentIndex].name}</span>
        </div>
    )
}
