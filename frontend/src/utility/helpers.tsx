

export const SMC = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

/**
 * 
 * @param {*} date the date to turn into SQL date format
 * @returns a string compatible with SQL date format
 */
export function sqlifyDatetime(date: Date) {
    const hrs = date.getUTCHours();

    const pad = (num: number) => ('00'+num).slice(-2)
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

export function deltaTime(date: any, epochs: any = null, mini = false) {
    const someDate = new Date(date)
    const epochThen = someDate.getTime();

    const now = new Date()
    const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())
    const epochNow = nowUTC;
    const msDiff = epochNow - epochThen
    // console.log(someDate.toString(), now.toString())

    const secDiff = epochs
        ? epochs[1] - epochs[0]
        : Math.floor(msDiff / 1000)

    // if (secDiff >= 172800 * 3) return someDate.toString().substring(4, 10)

    if (secDiff < 5) return `just now`
    // seconds territory (0 - 59 seconds)
    if (secDiff < 60) return `${secDiff}${mini ? 's' : ' seconds ago'}`
    // minutes territory (1 - 59 min / 60 - 3541 seconds)
    if (secDiff < 120) return mini ? '1m' : '1 minute ago'
    if (secDiff < 3600) return `${Math.floor(secDiff / 60)}${mini ? 'm' : ' minutes ago'}`
    // hours territory (1 - 23 hours / 3600 - 82801 seconds)
    if (secDiff < 7200) return mini ? '1h' : '1 hour ago'
    if (secDiff < 86400) return `${Math.floor(secDiff / 3600)}${mini ? 'h' : ' hours ago'}`
    // days territory
    if (secDiff < 172800) return mini ? '1d' : '1 day ago'
    if (secDiff >= 172800) return `${Math.floor(secDiff / 86400)}${mini ? 'd' : ' days ago'}`

}