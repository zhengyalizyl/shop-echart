import { TREND_LIST_FAIL, TREND_LIST_REQUEST, TREND_LIST_SUCCESS } from "../constants/trendConstants"

export const trendReducer = (state = {}, action) => {
    switch (action.type) {
        case TREND_LIST_REQUEST:
            return {
                loading: true,
            }
        case TREND_LIST_SUCCESS:
            return {
                loading: false,
                trendList: action.payload
            }
        case TREND_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}