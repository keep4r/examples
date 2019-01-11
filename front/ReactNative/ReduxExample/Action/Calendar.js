import {
    ADD_CALENDAR_EVENT,
    DELETE_CALENDAR_EVENT
} from '../Constants';

export const addCalendarEvent = data => {
    return {
        type: ADD_CALENDAR_EVENT,
        data
    }
}

export const deleteCaledarEvent = () => {
    return {
        type: DELETE_CALENDAR_EVENT
    }
}