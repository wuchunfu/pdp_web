import moment from "moment";

function getDateList(count, long) {
    let time = new Date().setMinutes(0);
    time = time - 24*60*60*1000;
    let categoryData = [];
    for (let i = 0; i<= count; i++) {
        categoryData.push(moment(time).format('YYYY-MM-DD'));
        time -= long;
    }
    categoryData.reverse()
    return categoryData;
}

export default getDateList;