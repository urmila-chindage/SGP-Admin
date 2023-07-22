import Axios from "axios"

export const getDeviceCategoryMetric = () => {
    return Axios.get("https://sgpbackend.herokuapp.com/api/getDeviceCategory")
    .then(res => {
        return res.data;
    })

}

export const getThisMonthMetrics = () => {
    return Axios.get("https://sgpbackend.herokuapp.com/api/getThisMHits")
    .then(res => {
        return res.data;
    })
}

export const getThisWeekMetrics = () => {
    return Axios.get("https://sgpbackend.herokuapp.com/api/getLastSevenDays")
    .then(res => {
        return res.data;
    })
}