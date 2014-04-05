// these are labels for the days of the week
cal_days_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// these are human-readable month name labels, in order
cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

// these are the current unavailable dates.
cal_unavailable_dates = [
  '31-03-2014',
  '07-04-2014',
  '01-04-2014',
  '02-04-2014',
  '03-04-2014',
  '04-04-2014',
  '08-04-2014',
  '09-04-2014',
  '10-04-2014',
  '11-04-2014',
  '14-04-2014',
  '15-04-2014',
  '16-04-2014',
  '17-04-2014',
  '18-04-2014',
  '29-04-2014'
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
  html += '<thead><tr>';
  for(var i = 0; i <= 6; i++ ){
    html += '<td class="calendar-header-day">';
     html += cal_days_labels[i];
    html += '</td>';
  }
  html += '</tr></thead>';

  // fill in the days
  var day = 1;
  var month = 0;

  html += '<tbody>';

  // this loop is for is weeks (rows)
  for (var week = 0; week < 52; week++) {

    if(day >= monthLength && month == 5) {
      break;
    };

    html += '<tr>';

    // this loop is for weekdays (cells)
    for (var weekDay = 0; weekDay <= 6; weekDay++) {

      if (day <= monthLength && (week > 0 || weekDay >= startingDay)) {
        var id = 'day-' + ("0" + day).slice(-2) + '-' + ("0" + (this.month + 1)).slice(-2) + '-' + this.year;
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
        var id = 'day-' + ("0" + day).slice(-2) + '-' + ("0" + (this.month + 1)).slice(-2) + '-' + this.year;
        html += '<td id="' + id + '">' + '<b class="month-label">' +
                cal_months_labels[this.month] + '</b> ' + day + '</td>';
        day++;
      } else {
        html += '<td class="empty"></td>';
      };

    };

    html += '</tr>';
  };

  html += '</tbody></table>';

  this.html = html;
};

Calendar.prototype.getHTML = function() {
  return this.html;
}

$(document).ready(function() {

  var requestedDays = [];

  $.each(cal_unavailable_dates, function() {
    // console.log(this);
    id = '#day-' + this;
    $(id).addClass('unavailable');
  });



  $('td').click(function() {
    $el = $(this);

    if (!$el.hasClass('unavailable') && !$el.hasClass('empty') && !$el.hasClass('selected')) {

      requestedDays.push($el.attr('id').slice(-10));

      if (requestedDays.length == 1) {
        var requestText = 'Request 1 day'
      } else {
        var requestText = 'Request ' + requestedDays.length + ' days'
      };

      $('.request-button').text(requestText);
      $('.sidebar').show();
      $el.addClass('selected');

    } else if ($el.hasClass('selected')) {

      requestedDays = $.grep(requestedDays, function(a){
        return a != $el.attr('id').slice(-10);
      });
      console.log(requestedDays);

      if (requestedDays.length == 0) {
        $('.sidebar').fadeOut(300);
      } else if (requestedDays.length == 1) {
        var requestText = 'Request 1 day';
      } else {
        var requestText = 'Request ' + requestedDays.length + ' days';

      };

      $('.request-button').text(requestText);
      $el.removeClass('selected');

    };
  });

  function defineCurrentDate() {

    today = new Date().format("dd-mm-yyyy");
    today = $('#day-' + today);
    today.addClass('today').prevAll().addClass('past').end().parent()
      .prevAll().remove(':not(.calendar-header)');
    today.wrapInner('<b></b>');

  };
  defineCurrentDate();

  $('.close').click(function() {
    $('.request-form').fadeOut(300);
    $('.modal-overlay').fadeOut(300);
  });

  $('.modal-overlay').click(function() {
    $('.request-form').fadeOut(300);
    $('.modal-overlay').fadeOut(300);
  });

  $('.request-button').click(function() {
    $('.request-form').hide().removeClass('dismissed').show();
    $('.modal-overlay').show();
  });

  $('.request-clear-button').click(function() {
    $('.calendar').find('.selected').removeClass('selected');
    requestedDays = [];
    $('.sidebar').fadeOut(300);
  });

  $('.request-form-submit').click(function() {

    var requestMessage = $('.request-form-message').val() + '\n\nDays requested:\n' +
                         requestedDays.join('\n');

    var data = {
        email: $('.request-form-email').val(),
        message: requestMessage
    };

    $.ajax({
        type: 'POST',
        url: '/availability/request.php',
        data: data,
        success: function(){
            $('.request-form').addClass('dismissed');
            $('.modal-overlay').fadeOut(300);
            $('.calendar').find('.selected').removeClass('selected');
            requestedDays = [];
            $('.sidebar').fadeOut(300);
            $('.request-form-confirmation').show();
            setTimeout(function() {
              $('.request-form-confirmation').fadeOut(300);
              $('.request-form-email').val('');
              $('.request-form-message').val('');
            },
            5000);
        }
    });

  });

});
