import axios from 'axios';
import { MAP_LIST_FAIL, MAP_LIST_REQUEST, MAP_LIST_SUCCESS } from "../constants/mapConstants"
import SocketService from '../utils/socket_service';


export const getMap = () => async(dispatch) => {
    try {
        dispatch({ type: MAP_LIST_REQUEST });
        SocketService.Instance.registerCallBack('mapData', (msg) => {
                dispatch({
                    type: MAP_LIST_SUCCESS,
                    payload: msg
                })
            })
            // const data = await axios.get('/api/map');
            // dispatch({
            //     type: MAP_LIST_SUCCESS,
            //     payload: data
            // })
    } catch (error) {
        dispatch({
            type: MAP_LIST_FAIL,
            payload: error
        })
    }
}