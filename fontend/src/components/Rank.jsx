import React,{useEffect,useRef,useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import * as echarts from 'echarts'
import './index.css'
import { getRank } from '../actions/rankActions';
import chalk from '../utils/chalk'

export default function Rank() {
    const rankRef=useRef(null);
    const dispatch=useDispatch();
    const [chartInstance,setChartInstance]=useState(null);
    const rankData=useSelector(state=>state.rankData);
   const {loading,rankList}=rankData;

    useEffect(() => {
        initChart();
        geRankData();
    }, [])
    useEffect(() => {
        screenAdapter();
        window.addEventListener('resize', screenAdapter);
        return () => {
            window.removeEventListener('resize', screenAdapter)
        }
    }, [chartInstance]);

    useEffect(()=>{
        updateChart();
    },[rankList])



    const initChart=()=>{
        echarts.registerTheme('chalk', chalk)
        const mychart=echarts.init(rankRef.current);
        setChartInstance(mychart);
        const initOption={
          xAxis:{
              type:'category'
          },
          yAxis:{
              type:'value'
          },
          series:[{
              type:'bar'
          }]
        };
        mychart.setOption(initOption);
    }


    const updateChart=()=>{
        if(rankList){
            const updateOption={
                xAxis:{
                    data:rankList.map(item=>item.name)
                },
                series:[{
                    data:rankList.sort((a,b)=>b.value-a.value).map(item=>item.value)
                }]
              };
              chartInstance&&chartInstance.setOption(updateOption);
        }
     

    }
    const screenAdapter=()=>{
        const screenOption={};
        chartInstance&&chartInstance.setOption(screenOption)
    }

    const geRankData=()=>{
         dispatch(getRank());
    }
    
  return (
    <div className='com-container' >
    <div className="com-chart" ref={rankRef}></div>
</div>
  )
}
