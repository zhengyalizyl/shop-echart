import axios from 'axios';
import { HOT_LIST_FAIL, HOT_LIST_REQUEST, HOT_LIST_SUCCESS } from "../constants/hotConstants"
import SocketService from '../utils/socket_service';


export const getHot = () => async(dispatch) => {
    try {
        dispatch({ type: HOT_LIST_REQUEST });
        SocketService.Instance.registerCallBack('hotproductData', (msg) => {
                dispatch({
                    type: HOT_LIST_SUCCESS,
                    payload: msg
                })
            })
            // const data = await axios.get('/api/hotproduct');
            // dispatch({
            //     type: HOT_LIST_SUCCESS,
            //     payload: data
            // })
    } catch (error) {
        dispatch({
            type: HOT_LIST_FAIL,
            payload: error
        })
    }
}