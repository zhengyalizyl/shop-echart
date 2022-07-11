export const themeReducer = (state = 'chalk', action) => {
    switch (action.type) {
        case 'CHANGE_THEME':
            {
                if (state === 'chalk') {
                    return 'vintage'
                } else {
                    return 'chalk'
                }
            }
        default:
            return state
    }
}