import React, { useMemo, useRef, useState, useEffect } from 'react'
import Hot from '../components/Hot';
import Seller from '../components/Seller';
import Trend from '../components/Trend';
import Map from '../components/Map';
import SocketService from '../utils/socket_service';
import { getThemeValue } from '../utils/theme_utils'
import Rank from '../components/Rank';
import Stock from '../components/Stock';
import { useSelector, useDispatch } from 'react-redux';
import {getTheme} from '../actions/themeActions'


export default function ScreenPage() {
  const trendRef = useRef(null)
  const sellerRef = useRef(null)
  const rankRef = useRef(null)
  const stockRef = useRef(null)
  const mapRef = useRef(null)
  const hotRef = useRef(null)
  // const [theme, setTheme] = useState('chalk');
  const currentRef=useRef(null)
  const dispatch = useDispatch();
  const themeData=useSelector(state=>state.themeData)
  const [fullScreenStatus, setFullScreenStatus] = useState({
    trend: false,
    seller: false,
    map: false,
    rank: false,
    hot: false,
    stock: false
  })

  useEffect(() => {
    // 注册接收到数据的回调函数
    SocketService.Instance.registerCallBack('fullScreen', recvData)
    SocketService.Instance.registerCallBack('themeChange', recvThemeChange)
    return () => {
      SocketService.Instance.unRegisterCallBack('fullScreen')
      SocketService.Instance.unRegisterCallBack('themeChange')
    }

  }, [])
  const headerSrc = useMemo(() => {
    return '/img/' + getThemeValue(themeData).headerBorderSrc
  }, [themeData]);
  const logoSrc = useMemo(() => {
    return '/img/' + getThemeValue(themeData).logoSrc
  }, [themeData]);
  const themeSrc = useMemo(() => {
    return '/img/' + getThemeValue(themeData).logoSrc
  }, [themeData]);
  const containerStyle = useMemo(() => {
    return {
      backgroundColor: getThemeValue(themeData).backgroundColor,
      color: getThemeValue(themeData).titleColor
    }
  }, [themeData])


  useEffect(() => { })

  const handleChangeTheme = () => {
    // 修改VueX中数据
    // this.$store.commit('changeTheme')
    SocketService.Instance.send({
      action: 'themeChange',
      socketType: 'themeChange',
      chartName: '',
      value: ''
    })
  }

  const changeSize = (chartName, refName) => {
    // 1.改变fullScreenStatus的数据
    const targetValue = !fullScreenStatus[chartName];

    // 2.需要调用每一个图表组件的screenAdapter的方法
    // refName.current.screenAdapt();//这里的组件需要更新
    currentRef.current=refName;
    SocketService.Instance.send({
      action: 'fullScreen',
      socketType: 'fullScreen',
      chartName: chartName,
      value: targetValue
    })
  }
  // 接收到全屏数据之后的处理
  const recvData = (data) => {
    // 取出是哪一个图表需要进行切换
    const chartName = data.chartName
    // 取出, 切换成什么状态
    const targetValue = data.value
    setFullScreenStatus({
      ...fullScreenStatus,
      [chartName] : targetValue
    })
    currentRef.current.current.screenAdapt();
  }
  const recvThemeChange = () => {
    dispatch(getTheme())
  }


  return (
    <div className="screen-container" style={containerStyle}>
      <header className="screen-header">
        <div>
          <img src={headerSrc} alt="" />
        </div>
        <span className="logo">
          <img src={logoSrc} alt="" />
        </span>
        <span className="title">电商平台实时监控系统</span>
        <div className="title-right">
          <img src={themeSrc} className="qiehuan" onClick={handleChangeTheme} />
          <span className="datetime">2049-01-01 00:00:00</span>
        </div>
      </header>
      <div className="screen-body">
        <section className="screen-left">
          <div id="left-top" className={fullScreenStatus.trend ? 'fullscreen' : ''}>
            {/* <!-- 销量趋势图表 --> */}
            <Trend ref={trendRef}></Trend>
            <div className="resize">
              {/* <!-- icon-compress-alt --> */}
              <span onClick={() => changeSize('trend', trendRef)} className={`iconfont ${fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt'}`}></span>
            </div>
          </div>
          <div id="left-bottom" className={fullScreenStatus.seller ? 'fullscreen' : ''}>
            {/* //   <!-- 商家销售金额图表 --> */}
            <Seller ref={sellerRef}></Seller>
            <div className="resize">
              {/* <!-- icon-compress-alt --> */}
              <span onClick={() => changeSize('seller', sellerRef)} className={`iconfont ${fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt'}`}></span>
            </div>
          </div>
        </section>
        <section className="screen-middle">
          <div id="middle-top" className={fullScreenStatus.map ? 'fullscreen' : ''}>
            {/* <!-- 商家分布图表 --> */}
            <Map ref={mapRef}></Map>
            <div className="resize">
              {/* <!-- icon-compress-alt --> */}
              <span onClick={() => changeSize('map', mapRef)} className={`iconfont ${fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt'}`}></span>
            </div>
          </div>
          <div id="middle-bottom" className={fullScreenStatus.rank ? 'fullscreen' : ''}>
            {/* //   <!-- 地区销量排行图表 --> */}
            <Rank ref={rankRef}></Rank>
            <div className="resize">
              {/* <!-- icon-compress-alt --> */}
              <span onClick={() => changeSize('rank', rankRef)} className={`iconfont ${fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt'}`}></span>
            </div>
          </div>
        </section>
        <section className="screen-right">
          <div id="right-top" className={fullScreenStatus.hot ? 'fullscreen' : ''}>
            {/* <!-- 热销商品占比图表 --> */}
            <Hot ref={hotRef}></Hot>
            <div className="resize">
              {/* <!-- icon-compress-alt --> */}
              <span onClick={() => changeSize('hot', hotRef)} className={`iconfont ${fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt'}`}></span>
            </div>
          </div>
          <div id="right-bottom" className={fullScreenStatus.stock ? 'fullscreen' : ''}>
            {/* <!-- 库存销量分析图表 --> */}
            <Stock ref={stockRef}></Stock>
            <div className="resize">
              {/* <!-- icon-compress-alt --> */}
              <span onClick={() => changeSize('stock', stockRef)} className={`iconfont ${fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt'}`}></span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
