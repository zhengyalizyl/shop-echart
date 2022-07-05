import React,{useEffect,useRef,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import * as echarts from 'echarts';
import chalk from '../utils/chalk';
import { getMap } from '../actions/mapActions';

export default function Map() {
    const mapRef = useRef(null);
    const dispatch = useDispatch();
    const [chartInstance, setChartInstance] = useState(null);
    const mapData = useSelector(state => state.mapData);
    const { loading,mapList } =mapData;
    const [titleFontSize, setTitleFontSize] = useState(0);

    useEffect(() => {
        initChart();
        getMapData();
    }, [])
    useEffect(() => {
        screenAdapter();
        window.addEventListener('resize', screenAdapter);
        return () => {
            window.removeEventListener('resize', screenAdapter)
        }
    }, [chartInstance]);

    useEffect(() => {
        updateMapData();
       
    }, [chartInstance, mapList])

    const initChart = () => {
        echarts.registerTheme('chalk', chalk)
        const mychart = echarts.init(mapRef.current, 'chalk');
        setChartInstance(mychart);
        if(mapList){
            echarts.registerMap('china',mapList)
            const initOption = {
                geo:{
                    type:'map',
                    map:'china'
                }
            };
            mychart.setOption(initOption);
        }
     
    }

    const getMapData = () => {
        dispatch(getMap())
    }

    const updateMapData = () => {
     
        if (mapList && chartInstance) {
            const dataOption = {
         
            };
            chartInstance.setOption(dataOption);
        }
    }

    const screenAdapter = () => {
       const  fontSize = mapRef.current.offsetWidth / 100 * 3.6;
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




  return (
    <div className='com-container' >
    <div className="com-chart" ref={mapRef}></div>
</div>
  )
}
