import { MAP_LIST_FAIL, MAP_LIST_REQUEST, MAP_LIST_SUCCESS } from "../constants/mapConstants"

export const mapReducer = (state = {}, action) => {
    switch (action.type) {
        case MAP_LIST_REQUEST:
            return {
                loading: true,
            }
        case MAP_LIST_SUCCESS:
            return {
                loading: false,
                mapList: action.payload
            }
        case MAP_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}