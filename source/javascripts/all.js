//= require_tree .

var cal = new Calendar();
cal.generateHTML();
$('.calendar').html(cal.getHTML());

$(document).ready(function() {

  pageHeaderHeight = $('header').outerHeight();
  fixedElements = $('.calendar thead, .sidebar');

  $(window).scroll(function() {

    if ($(window).scrollTop() > pageHeaderHeight) {
      fixedElements.css({
        'position': 'fixed',
        'top': 0
      });
    } else {
      fixedElements.css({
        'position': 'absolute',
        'top': ''
      });
    };

  });
})
