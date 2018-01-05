var DateUtil = {
  hoursInDay: 24,
  msInHour: 60*60*1000,
  minutesInHour: 60,

  // Gets start of the day hour from date object
  getStartOfDayHourFromDate : function(date) {
    var startOfDayMoment = moment(date).startOf('day');
    var startOfDayTime  = startOfDayMoment.toDate().getTime();
    return Math.floor( startOfDayTime / (1000*60*60) );
  },

  // Gets start of the day hour from date object
  getEndOfDayHourFromDate : function(date) {
    var endOfDayMoment = moment(date).endOf('day');
    var endOfDayTime  = endOfDayMoment.toDate().getTime();
    return Math.floor( endOfDayTime / (1000*60*60) );
  },

  // Returns start of day hour from timestamp
  getStartOfDayHour : function(timeStamp) {
    var m = moment(timeStamp);
    return this.getStartOfDayHourFromDate(m.toDate());
  },

  getEndOfDayHour : function(timeStamp) {
    var m = moment(timeStamp);
    return this.getEndOfDayHourFromDate(m.toDate());
  },

  convertToUTCHour : function(hour) {
    var date = new Date();
    var utcHour = hour + date.getTimezoneOffset();
    return utcHour;
  },

  convertToTimeZoneHour : function(hour) {
    var date = new Date();
    var timeZoneHour = hour - date.getTimezoneOffset();
    return timeZoneHour;
  },

  convertToTimeZoneTimeStamp : function(timeStamp) {
    var date = new Date();
    var timeZoneTimeStamp = timeStamp - date.getTimezoneOffset() * this.msInHour;
    return timeZoneTimeStamp;
  },
}
