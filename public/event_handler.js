


let isScrolling = false;
$("#chatarea").scroll(function() {

    isScrolling=true;
      clearTimeout($.data(this, 'scrollTimer'));
      $.data(this, 'scrollTimer', setTimeout(function() {
        isScrolling=false;

      }, 2000));


});










window.setInterval(function() {

  if (isScrolling == false)
  {
  var elem = document.getElementById('chatarea');
  elem.scrollTop = elem.scrollHeight;
}
//isScrolling = false;
}, 500);

var nickname = prompt("Please enter your name", "Harry Potter");
nickname=nickname.replace(/\s/g, '');


while (!nickname.length )
{
var nickname = prompt("Please enter your name", "Harry Potter");
}





  $('#m').keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    $('#sendbutton').click();
  console.log("enter pressed");
    return false;
  }
});








$(function () {
  var socket = io();
  let searchmode = false;




  window.setInterval(function() {

    if (searchmode == true)
    {
      searchmode=false;
      socket.emit('random',nickname ,function (data) {

            if (data == "exiting current chat room.. no new person found. everyone is busy"){
              searchmode = true;
            }
            else{
              $('#chatarea').append($('<div class="systembubble"  >').text(data));
            document.getElementById("sp1").style.visibility = "hidden";
            document.getElementById("random").style.visibility = "visible";
          }

      });

  }
  //isScrolling = false;
  }, 500);


$("#random").click(function(){
//socket.emit('random',nickname ,function (data) {
//      $('#chatarea').append($('<div class="bubble">').text(data));
//});
searchmode=true;


//$('#sp1').show();
document.getElementById("sp1").style.visibility = "visible";
document.getElementById("random").style.visibility = "hidden";
return false;
});

  $('form').submit(function(){

$('#chatarea').append($('<div class="bubble bubble--alt "  dir="rtl" >').text($('#m').val()));

    socket.emit('chat message',nickname + ': ' + $('#m').val(),function (data) {
      $('#chatarea').append($('<div class="systembubble" dir="rtl" > ').text(data));

  });
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    if (msg == "someone connected to u - say hi!"){
      searchmode = false;

      document.getElementById("sp1").style.visibility = "hidden";
      document.getElementById("random").style.visibility = "visible";
      $('#chatarea').append($('<div class="systembubble" dir="ltr" >').text(msg));

    }
    else if ( msg == "client has left you :( - you are open for new connections" || msg == "client disconnected - you are open for new connections"  ){
        $('#chatarea').append($('<div class="systembubble" dir="ltr" >').text(msg));

    }
    else {
    $('#chatarea').append($('<div class="bubble" dir="rtl" >').text(msg));


  }
  });
});
