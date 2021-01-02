

// Client ID and API key from the Developer Console
var CLIENT_ID = '266643809945-7qk12p5fvqj3s3uopaq40cs45dul1vn0.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBM84ndf0SpFtXRg-mkiQkGi4f2aRTV2rc';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://script.googleapis.com/$discovery/rest?version=v1", 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

function updateButtons() {
  authorizeButton = document.getElementById('authorize_button');
  signoutButton = document.getElementById('signout_button');

}
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);


}
function execute(callback) {
  gapi.client.load('drive', 'v2', function () {
    callback();
  });
}


/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  console.log("initClient Function")
  auth2 = gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    console.log("initClient Function Callback")
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    var auth2 = gapi.auth2.getAuthInstance();

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function (error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}


/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  var auth2 = gapi.auth2.getAuthInstance();
  var profile = auth2.currentUser.get().getBasicProfile();
  var email = profile.getEmail().toString();
  updateButtons();
  if (isSignedIn && email.indexOf('hiddengeniusproject') !== -1) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    printFile("1ZkElp511wOjU59K206SeJ1v2O6_90DYU");
    getDropDown("1DqQiwvog8LDZkSwgOr1BWJMUeSGmKP-F")
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    window.location.href = "./login.html";
  }
}




/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

function printFile(fileId) {
  console.log("PrintFile")

  var request = gapi.client.drive.files.get({
    'fileId': fileId,
    alt: 'media'
  });
  request.execute(function (result) {
    console.log("Executed")
    if (result.error && result.error.status) {
      // The API encountered a problem before the script
      // started executing.
      appendPre('Error calling API:');
      appendPre(JSON.stringify(result, null, 2));
      console.log("error 1")
    } else if (result.error) {
      // The API executed, but the script returned an error.
      console.log("error 2");
      console.log(result.error)
      // Extract the first (and only) set of error details.
      // The values of// this object are the script's 'errorMessage' and
      // 'errorType', and an array of stack trace elements.
      var error = result.error.details[0];
      appendPre('Script error message: ' + error.errorMessage);

      if (error.scriptStackTraceElements) {
        // There may not be a stacktrace if the script didn't start
        // executing.
        appendPre('Script error stacktrace:');
        for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
          var trace = error.scriptStackTraceElements[i];
          appendPre('\t' + trace.function + ':' + trace.lineNumber);
        }
      }
    } else {
      // The structure of the result will depend upon what the Apps
      // Script function returns. Here, the function returns an Apps
      // Script Object with String keys and values, and so the result
      // is treated as a JavaScript object (folderSet).
      //console.log("Good")
      //console.log(result.result.concepts)
      var mainConceptsArr = result.result.concepts;
      var conceptsObj = arrToConceptObj(mainConceptsArr);
      setStorage("concepts", conceptsObj)
      //var test = localStorage.getItem('concepts')
      //console.log(JSON.parse(test));

    }
  });
}
var timeoutId;

$(document).on('input propertychange change','input.noteArea , textarea.noteArea ', function() {
    
  //alert('Textarea Change');
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        // Runs 1 second (1000 ms) after the last change    
        //saveToDB();
        console.log('Success');
    }, 1000);
});

function saveToDB(){
  //1. getElementsClassName ('noteArea')
  //2. Loop Through And Add All Notes To An Array [[Question1, Answer1]
  
  
  
  
  
  //3. Create Object Or Double Array Of Data
  /*cols:

  concept-key: Based ON ID
  date-submitted: provided on sumbit button (so may be blank on updates)
  last-updated: everytime textarea updated
  genius email: from localstorage
  week: from drop down



  */

}


function submitNote(){


  //1. getElementsClassName ('noteArea')
  //2. Loop Through And Add All Notes To An Array [[Question1, Answer1]
  
  
  var obj = {};

  var today = new Date();
  var datetime = "" + today.getDate() + "/"
                  + (today.getMonth()+1)  + "/" 
                  + today.getFullYear() + " "  
                  + today.getHours() + ":"  
                  + today.getMinutes() + ":" 
                  + today.getSeconds();

  obj["date-submitted"]=datetime;
  obj["last-updated"]=datetime;
  obj["genius-email"] ="";//From GeniusInfo localStorage
  obj["concept-week"] = $("#concept-select").val().split("-")[1];
  obj["concept-key"]=$(".paper-content h4").attr("class").split(" ")[1].split("-")[1];
  obj["earned-hours"]="";
  obj["concept-status"]="pending";

  var nodes = document.querySelectorAll(".conceptKey")
  var list = [].slice.call(nodes);
var innertext = list.map(function(e) { return '"'+e.innerHTML.replace(/[\r]?[\n]/g, '\\n')+'"'; }).join(",");
var question = JSON.parse('['+innertext+']')

var nodes2 = document.querySelectorAll(".noteArea")
  var list2 = [].slice.call(nodes2);
var innertext2 = list2.map(function(e) { return '"'+e.value.replace(/[\r]?[\n]/g, '\\n')+'"'; }).join(",");
var answer = JSON.parse('['+innertext2+']')
var newarray = question.map(function(c, i) { return [ c, answer[i] ] });
obj["questions-answers"] =JSON.stringify(newarray)
  var test = JSON.parse(obj["questions-answers"]);
  test[0]=["2. I Will Apply Variables To My Personal Project By... ","Hello world ! Here's a paaper textarea tag."];
  obj["questions-answers"]  = JSON.stringify(test)
  console.log(obj)
//Add To Local Storage


}