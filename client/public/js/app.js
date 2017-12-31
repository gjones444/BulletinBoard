$(document).ready(function() {

  $('#post-forum').on('submit', function(e) {
    e.preventDefault();

    var messageWrap, nameP, messageP, editButton;
    var postForumObj = {
      name: $('#GuestName').val(),
      message: $('#text-area').val()
    }

    $.ajax({
      method: 'POST',
      url: '/api/post-message',
      dataType: 'json',
      data: JSON.stringify(postForumObj),
      contentType: 'application/json'
    }).then(function(res) {
      console.log(res)
      if (res === "null_message") {
        alert("Please Enter Message")
      }
      else {
        alert("Message Received! Click 'Messageboard' to go to 'The Forum'")
      }
      postToForum();
    });
    $('#GuestName').val("");
    $('#text-area').val("");
  });

  function postToForum() {
    $.ajax({
      method: 'GET',
      url: '/api/posts'
    }).then(function(posts) {
      // console.log(posts)
      var messageBoard = $('<div id="message-board">');
      for (var i = 0; i < posts.rows.length; i++) {
        // console.log(posts)
        var messageWrap = $('<div id="guest-div">');
        messageWrap.css({
          display: 'table',
          margin: '30px',
          border: '5px solid black',
        });
        editButton = $('<button id="editBtn" class="btn btn-danger" data-id=' + posts.rows[i].id + '>');
        editButton.css({
          padding: "0px 4px 0px 4px",
          float: 'center'
        })
        editButton.text("Edit Message");
        nameP = $('<p>');
        messageP = $('<p class="message" data-id=' + posts.rows[i].id + '>');
        nameP.text("Name: " + posts.rows[i].name);
        nameP.css({
          fontWeight: 'bold'
        })
        messageP.text("Message: " + posts.rows[i].messages);
        messageWrap.append(nameP).append(messageP).append(editButton)
        messageBoard.prepend(messageWrap);
      }
      $('#Forum-Table').append(messageBoard)

    });
  }
  postToForum();

  $(document).on('click', '#editBtn', function() {
    $('#modal-input-div').remove();
    var messageId = $(this).data('id');
    $('#update-modal').modal();
    var inputDiv = $('<div id="modal-input-div">');

    $.ajax({
      method: 'GET',
      url: '/api/posts'
    }).then(function(posts) {
      for (var i = 0; i < posts.rows.length; i++) {
        if (posts.rows[i].id == messageId) {
          var textInput = $("<textarea id='message-update-input'>");
          textInput.val(posts.rows[i].messages);
          inputDiv.append(textInput);
        }
      }
      var submitButton = $('<button>');
      submitButton.addClass('btn btn-info enter-button');
      submitButton.attr('data-id', messageId);
      submitButton.text("Enter");
      inputDiv.append("<br>").append(submitButton);
    });
    $('.changeModal').append(inputDiv);
  })
  $(document).on('click', '.enter-button', function() {
    var updatedMessage = $("#message-update-input").val();
    if (updatedMessage !== "") {
      $.ajax({
        method: 'PUT',
        url: '/api/update-message/' + $(this).data('id'),
        data: {
          message: updatedMessage
        }
      }).then(function(res) {
        postToForum();
        $('.changeModal').modal('toggle');
        window.location.reload();
        // console.log(updatedMessage)
      });
    } else {
      alert('Please Enter New Message Or Click Outside The Modal To Exit This Window')
    }

  });

});
