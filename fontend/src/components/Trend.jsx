import React, { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as echarts from 'echarts';
import { useDispatch, useSelector } from 'react-redux';
import { getTrend } from '../actions/trendActions';
import chalk from '../utils/chalk'
import './index.css'
import SocketService from '../utils/socket_service';
import vintage from '../utils/vintage';
import { getThemeValue } from '../utils/theme_utils';

const Trend = forwardRef((_, ref) => {
    // const trendRef = useRef(null);
    const trendRef = useRef(ref);
    const dispatch = useDispatch();
    const [chartInstance, setChartInstance] = useState(null);
    const trendData = useSelector(state => state.trendData);
    const { loading, trendList } = trendData;
    const [titleFontSize, setTitleFontSize] = useState(0);
    const [showChoice, setShowChoice] = useState(false);
    const [selectTypes, setSelectTypes] = useState([]);
    const [choiceType, setChoiceType] = useState('map')
    const themeData=useSelector(state=>state.themeData);
    useEffect(() => {
        chartInstance&&chartInstance.dispose()
       initChart();

    },[themeData]);

    useEffect(() => {
        initChart();
    }, [])
    useEffect(() => {
        getTrendData();
        SocketService.Instance.send({
            action: 'getData',
            socketType: 'trendData',
            chartName: 'trend',
            value: ''
        })
        return () => {
            SocketService.Instance.unRegisterCallBack('trendData')
        }
    }, [])


    useImperativeHandle(ref, () => ({
        screenAdapt: () => {
            screenAdapter();
        }
    }));

    useEffect(() => {
        screenAdapter();
        window.addEventListener('resize', screenAdapter);

        return () => {
            window.removeEventListener('resize', screenAdapter)
        }
    }, [chartInstance]);

    useEffect(() => {
        updateTrendData();
        if (trendList) {
            const item = trendList.type.filter(item => item.key != choiceType);
            setSelectTypes(item)
        } else {
            setSelectTypes([])
        }
    }, [chartInstance, trendList, choiceType])

    const initChart = () => {
        const  themeColor=themeData==='chalk'?chalk:vintage;
        echarts.registerTheme('chalk', themeColor)
        const mychart = echarts.init(trendRef.current, 'chalk');
        setChartInstance(mychart);
        const initOption = {
            title: {
                text: ''
            },
            grid: {
                left: '3%',
                top: '35%',
                right: '4%',
                bottom: '1%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 20,
                top: '15%',
                icon: 'circle'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false
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
        // ?????????????????????
        const colorArr1 = [
            'rgba(11, 168, 44, 0.5)',
            'rgba(44, 110, 255, 0.5)',
            'rgba(22, 242, 217, 0.5)',
            'rgba(254, 33, 30, 0.5)',
            'rgba(250, 105, 0, 0.5)'
        ]
        // ?????????????????????
        const colorArr2 = [
            'rgba(11, 168, 44, 0)',
            'rgba(44, 110, 255, 0)',
            'rgba(22, 242, 217, 0)',
            'rgba(254, 33, 30, 0)',
            'rgba(250, 105, 0, 0)'
        ];
        if (trendList && chartInstance) {
            const timeArr = trendList.common.month;
            const valueArr = trendList[choiceType].data;
            const seriesArr = valueArr.map((item, index) => {
                return {
                    name: item.name,
                    type: 'line',
                    data: item.data,
                    stack: choiceType,
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: colorArr1[index]
                            }, {
                                offset: 1,
                                color: colorArr2[index]
                            }
                        ])
                    }
                }
            })
            const legendArr = valueArr.map(item => item.name)
            const dataOption = {
                xAxis: {
                    data: timeArr
                },
                legend: {
                    data: legendArr
                },
                series: seriesArr
            };
            chartInstance.setOption(dataOption);
        }
    }

    const screenAdapter = () => {
        const fontSize = trendRef.current.offsetWidth / 100 * 3.6;
        setTitleFontSize(fontSize);
        const adapterOption = {
            legend: {
                itemWidth: fontSize,
                itemHeight: fontSize,
                itemGap: fontSize,
                textStyle: {
                    fontSize: fontSize / 2
                }
            }
        };
        chartInstance && chartInstance.setOption(adapterOption);
        chartInstance && chartInstance.resize();
    }

    const handleSelect = (type) => {
        setShowChoice(false);
        setChoiceType(type);
        updateTrendData();
    }

      
    const comStyle=useMemo(()=>{
        return {
            fontSize:titleFontSize,
            color:getThemeValue(themeData).titleColor
        }
    },[titleFontSize,themeData])

    return (
        <div className="com-container">
            <div className="title rank" style={comStyle}>
                <span>{'|' + (trendList ? trendList[choiceType].title : '')}</span>
                <span className="iconfont title-icon" style={{ fontSize: titleFontSize }} onClick={() => setShowChoice(!showChoice)}>&#xe6eb;</span>
                {showChoice && (<div className={`${themeData==='vintage'?'selec-con_fff':'select-con'}`} style={{ marginLeft: titleFontSize}}>
                    {
                        selectTypes.map(item => (
                            <div key={item.key} class="select-item"  onClick={() => handleSelect(item.key)}>
                                {item.text}
                            </div>
                        ))
                    }
                </div>)}
            </div >
            <div className="com-chart" ref={trendRef}>
            </div>
        </div >
    )
})

export default Trend
