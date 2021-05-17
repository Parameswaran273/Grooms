export default function (state = {}, action) {
    switch (action.type) {
        case 'updateUserDetailsforSettings':
            state = action;
            return state;
        case 'START_LOAD':
            state = {};
            return state;
        default:
            return state;
    }
}