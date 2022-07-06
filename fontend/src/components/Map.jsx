import React,{useEffect,useRef,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import * as echarts from 'echarts';
import chalk from '../utils/chalk';
import { getMap } from '../actions/mapActions';
import axios from 'axios';
import { getProvinceMapInfo } from '../utils/map_utils'; 
import './index.css'

export default function Map() {
    const mapRef = useRef(null);
    const dispatch = useDispatch();
    const [chartInstance, setChartInstance] = useState(null);
    const mapData = useSelector(state => state.mapData);
    const { loading,mapList } =mapData;
    const [titleFontSize, setTitleFontSize] = useState(0);
    const [mapDatas,setMapDatas]=useState('')

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

    const initChart =async () => {
        echarts.registerTheme('chalk', chalk)
        const mychart = echarts.init(mapRef.current, 'chalk');
        setChartInstance(mychart);
         const data = await axios.get('http://localhost:3000/map/china.json');
            echarts.registerMap('china',data)
            const initOption = {
                title:{
                    text:'| 商家分布',
                    left:20,
                    top:20
                },

                geo:{
                    type:'map',
                    map:'china',
                    top:'5%',
                    bottom:'5%',
                    itemStyle:{
                        areaColor:'#2e72bf',
                        borderColor:'#333'
                    }
                },
                legend:{
                    left:'5%',
                    bottom:'5%',
                    orient:'veritcal'
                }
            };
            mychart.setOption(initOption);
            mychart.on('click',async (item)=>{
               const provinceInfo= getProvinceMapInfo(item.name);
               const url='http://localhost:3000'+provinceInfo.path;
               let province='';
               if(!mapDatas[provinceInfo.key]){
                 province= await axios.get(url);
                setMapDatas({...mapDatas,[provinceInfo.key]:province})
               }else{
                   province=mapDatas[provinceInfo.key]
               }
              echarts.registerMap(provinceInfo.key,province)
                const changeOption={
                    geo:{
                        map:provinceInfo.key
                    }
                }
                mychart.setOption(changeOption) 
            })
      
    }

    const getMapData = () => {
        dispatch(getMap())
    }

    const updateMapData = () => {
        if (mapList && chartInstance) {
            const legendArr=mapList.map(item=>item.name)
            const seriesArr=mapList.map((item)=>{
                //如果在地图中显示数据，需要在散点的图表中增加一个配置,coordinateSystem:geo
                return {
                    type:'effectScatter',
                    rippleEffect: {
                        scale: 5, // 设置涟漪动画的缩放比例
                        brushType:'stroke'
                    },
                    name:item.name,
                    data:item.children,
                    coordinateSystem:'geo'
                }
            })
            const dataOption = {
               series:seriesArr,
               legend:{
                   data:legendArr
               }
            };
            chartInstance.setOption(dataOption);
        }
    }

    const screenAdapter = () => {
       const  fontSize = mapRef.current.offsetWidth / 100 * 3.6;
       setTitleFontSize(fontSize);
        const adapterOption = {
            title:{
             textStyle:{
                 fontSize
             }
            },
            legend: {
                itemWidth: fontSize/2,
                itemHeight: fontSize/2,
                itemGap: fontSize/2,
                textStyle: {
                  fontSize: fontSize / 2
                }
              }
        };
        chartInstance && chartInstance.setOption(adapterOption);
        chartInstance && chartInstance.resize();

    }

const reverMap=()=>{
    const reverOption={
        geo:{
            map:'china'
        }
    }
    chartInstance.setOption(reverOption)
}


  return (

    <div className='com-container' onClick={reverMap} >
    <div className="com-chart" ref={mapRef}></div>
</div>
  )
}
