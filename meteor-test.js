Messages = new Meteor.Collection('messages')

if (Meteor.isClient) {

  Accounts.ui.config({
     passwordSignupFields: 'USERNAME_AND_EMAIL'
  });
  ////////// Helpers for in-place editing //////////
  
  // Returns an event_map key for attaching "ok/cancel" events to
  // a text input (given by selector)
  var okcancel_events = function (selector) {
    return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
  };
  
  // Creates an event handler for interpreting "escape", "return", and "blur"
  // on a text field and calling "ok" or "cancel" callbacks.
  var make_okcancel_handler = function (options) {
    var ok = options.ok || function () {};
    var cancel = options.cancel || function () {};
  
    return function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);
      } else if (evt.type === "keyup" && evt.which === 13) {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else {
          evt.preventDefault()
          cancel.call(this, evt);
        }
      }
    };
  };

  Template.entry.events = {}

  Template.entry.events[okcancel_events('#messageBox')] = make_okcancel_handler({
    ok: function (text, event) {
      // var nameEntry = document.getElementById('name')
      // if(nameEntry.value !== ""){
        var timeStamp = Date.now() / 1000
        Messages.insert({name: Meteor.user().username, message: text, time: timeStamp})
        event.target.value = ""
      // }
    }
  })

  Template.messages.messages = function() {
    return Messages.find({}, {sort: {time: -1} })
  }
}




// This code not even necessary because server is not doing anything
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
