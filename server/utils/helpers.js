
const SMC = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
/**
 * 
 * @param {*} date the date to turn into SQL date format
 * @returns a string compatible with SQL date format
 */
export function sqlifyDate(date) {

    const pad = (num) => ('00'+num).slice(-2)
    const newDate = pad(date.getUTCDate()) + '-' + 
                    SMC[date.getUTCMonth()] + '-' +
                    date.getUTCFullYear()
                    
    return newDate;
}

/**
 * 
 * @param {*} date the date to turn into SQL date format
 * @returns a string compatible with SQL date format
 */
export function sqlifyDatetime(date) {
    const hrs = date.getUTCHours();

    const pad = (num) => ('00'+num).slice(-2)
    const newDate = pad(date.getUTCDate()) + '-' + 
                    SMC[date.getUTCMonth()] + '-' +
                    date.getUTCFullYear() + ' ' +
                    pad(hrs % 12 || 12) + ':' +
                    pad(date.getUTCMinutes()) + ':' +
                    pad(date.getUTCSeconds()) + ` ${hrs > 12 ? 'PM' : 'AM'}` +
                    ' +00:00'; // was previously getting passed as a local into the db (PST -> UTC conversion happened twice)
                // console.log(newDate.toString())
    return newDate;
}