import axios from 'axios';
import { RANK_LIST_FAIL, RANK_LIST_REQUEST, RANK_LIST_SUCCESS } from "../constants/rankConstants"
import SocketService from '../utils/socket_service';


export const getRank = () => async(dispatch) => {
    try {
        dispatch({ type: RANK_LIST_REQUEST });
        SocketService.Instance.registerCallBack('rankData', (msg) => {
                dispatch({
                    type: RANK_LIST_SUCCESS,
                    payload: msg
                })
            })
            // const data = await axios.get('/api/rank');
            // dispatch({
            //     type: RANK_LIST_SUCCESS,
            //     payload: data
            // })
    } catch (error) {
        dispatch({
            type: RANK_LIST_FAIL,
            payload: error
        })
    }
}