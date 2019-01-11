import {
    ADD_CALENDAR_EVENT,
    DELETE_CALENDAR_EVENT
} from '../Constants';

import { initialState } from '../InitState';

export const CalendarEventReducers = (state = initialState.calendarEvent, action) => {
    switch (action.type) {
    case ADD_CALENDAR_EVENT:
        return {
            ...state,
            data: action.data,
            empty: false
        };
    case DELETE_CALENDAR_EVENT:
        return {
            ...state,
            data: {},
            empty: true
        };
    default:
        return state
    }
};