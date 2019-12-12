


export default class StringUtils {

    /*
        * 参数说明：
        * number：要格式化的数字
        * decimals：保留几位小数
        * dec_point：小数点符号
        * thousands_sep：千分位符号
        * */
    static formatMoney = (number, decimals=2, dec_point='.', thousands_sep=',')=>{
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = [],
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.ceil(n * k) / k;
            };

        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    static formatDate = (timeStr)=> {
        let timeStamp = Date.parse(timeStr.replace(/-/gi, "/"));
        let minute = 1000 * 60;
        let hour = minute * 60;
        let day = hour * 24;
        let month = day * 30;
        let now = new Date().getTime();
        let diffValue = now - timeStamp;
        if (diffValue < 0) {
            return;
        }
        let monthC = diffValue / month;
        let weekC = diffValue / (7 * day);
        let dayC = diffValue / day;
        let hourC = diffValue / hour;
        let minC = diffValue / minute;
        let result = "";

        if (monthC >= 1) {
            result = parseInt(monthC+'') + "月前";
        } else if (weekC >= 1) {
            result = parseInt(weekC+'') + "周前";
        } else if (dayC >= 1) {
            result = parseInt(dayC+'') + "天前";
        } else if (hourC >= 1) {
            result = parseInt(hourC+'') + "小时前";
        } else if (minC >= 1) {
            result = parseInt(minC+'') + "分钟前";
        } else {
            result = "刚刚";
        }

        return result;
    }
}
