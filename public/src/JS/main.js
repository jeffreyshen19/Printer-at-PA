function toggleChat() {
  $_Tawk.toggle();
  return false;
}

$(document).scroll(function() {
  if($(this).scrollTop() > $(window).height() * 0.1){
    $("nav").css({
      'background-color': '#2C3E50',
      'opacity': 0.8
    });
  }
  else{
    $("nav").css({
      'background': 'none',
    });
  }
});
