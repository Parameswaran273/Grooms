export default function (state = {}, action) {
    switch (action.type) {
        case 'getDashChange':
            state = JSON.parse(action.payload);
            return state;
        case 'START_LOAD':
            state = {};
            return state;
        default:
            return state;
    }
}