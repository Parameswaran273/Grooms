export default function (state = {}, action) {
    switch (action.type) {
        case 'getLoginDetails':
            state = action.payload;
            return state;
        case 'START_LOAD':
            state = {};
            return state;
        default:
            return state;
    }
}