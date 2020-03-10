module.exports = {
    now: function (callback) {
        const request = require('request');
        const key = 'cb3641281fb3b38092104313fdc5f18e'
        const location ='37.566206,127.02928809999999'
        const url = `https://api.darksky.net/forecast/${key}/${location}?units=auto`

        request({
            url: url , json: true
        }, (error, response) => {
            callback(response.body.currently);
        })
    }
}
