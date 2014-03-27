// these are labels for the days of the week
cal_days_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// these are human-readable month name labels, in order
cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

// these are the current unavailable dates.
cal_unavailable_dates = [
  '14-03-2014',
  '15-03-2014',
  '16-03-2014',
  '17-03-2014',
  '18-03-2014'
];

// these are the days of the week for each month, in order
cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// this is the current date
cal_current_date = new Date();

function Calendar(month, year) {
  // this.day   = (isNaN(day) || month == null) ? cal_current_date.getDay() : day;
  this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
  this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
  this.html  = '';
}

Calendar.prototype.generateHTML = function(){

  // get first day of month
  var firstDay = new Date(this.year, this.month, 1);
  var startingDay = firstDay.getDay() - 1;

  // find number of days in month
  var monthLength = cal_days_in_month[this.month];

  // compensate for leap year
  if (this.month == 1) { // February only!
    if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
      monthLength = 29;
    }
  }

  // do the header
  var html = '<table class="calendar-table">';
  html += '<tr class="calendar-header">';
  for(var i = 0; i <= 6; i++ ){
    html += '<td class="calendar-header-day">';
     html += cal_days_labels[i];
    html += '</td>';
  }
  html += '</tr>';

  // fill in the days
  var day = 1;
  var month = 0;

  // this loop is for is weeks (rows)
  for (var week = 0; week < 52; week++) {

    if(day >= monthLength && month == 5) {
      break;
    };

    html += '<tr>';

    // this loop is for weekdays (cells)
    for (var weekDay = 0; weekDay <= 6; weekDay++) {

      var id = ("0" + day).slice(-2) + '-' + ("0" + this.month).slice(-2) + '-' + this.year;

      if (day <= monthLength && (week > 0 || weekDay >= startingDay)) {
        html += '<td id="' + id + '">' +  day + '</td>';
        day++;
      } else if (day > monthLength && month < 5) {
        month++;
        day = 1;
        this.month = this.month + 1;
        if (this.month == 12) {
          this.month = 0;
          this.year == this.year + 1;
        }
        monthLength = cal_days_in_month[this.month];
        firstDay = new Date(this.year, this.month, 1);
        startingDay = firstDay.getDay() - 1;
        html += '<td id="' + id + '">' + '<b class="month-label">' +
                cal_months_labels[this.month] + '</b> ' + day + '</td>';
        day++;
      } else {
        html += '<td class="empty-entry"></td>';
      };

    };

    html += '</tr>';
  };

  html += '</table>';

  this.html = html;
};

Calendar.prototype.getHTML = function() {
  return this.html;
}
