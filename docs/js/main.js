




// Client ID and API key from the Developer Console
var CLIENT_ID = '266643809945-7qk12p5fvqj3s3uopaq40cs45dul1vn0.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBM84ndf0SpFtXRg-mkiQkGi4f2aRTV2rc';
var SCRIPT_ID = '14DqVwveVm7DW84xpSQsIFeTh4ulrELBicHR-dK5Qsj9DQW-3R-ukgskA';

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
	//   console.log("initClient Function")
	auth2 = gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
	}).then(function () {
		// console.log("initClient Function Callback")
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
	if (isSignedIn) {
        var auth2 = gapi.auth2.getAuthInstance();
      var profile = auth2.currentUser.get().getBasicProfile();
   
        var email = profile.getEmail().toString();
      
        if (isSignedIn && email.indexOf('hiddengeniusproject') !== -1) {
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		initPage();
		}
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
	localStorage.clear();
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




/* General Functions */
function setStorage(itemName, dataObj){
    localStorage.setItem(itemName, JSON.stringify(dataObj));
  }
  function getStorage(itemName){
  return JSON.parse( localStorage.getItem(itemName));

  }

  
  function displayGeniusInfo(){
	var userObj= getStorage("genius-info");
		for (const property in userObj) {

	 $('[name ="' + property + '"]').html(userObj[property]);


 }

   }

   function arrToGeneralObj(arr){
	var obj = {};
	 obj.general_info={}
  
  // console.log(arr.length)
	for(var i=0;i<arr[0].length;i++){
	  
		obj[arr[0][i]]=arr[2][i]
   
	}
	return obj;
  }


  function arrToConceptObj(arr){
    var obj = {};
     obj.concepts={}
  
    var objHolder={};

    for(var i=0;i<arr.length;i++){
      if(!Number.isInteger(arr[i][0]))
        continue;
        objHolder={};
        
      for(var j=0;j<arr[i].length;j++){
          objHolder[arr[0][j]] = arr[i][j];
      
        }
      
        if (typeof obj.concepts[arr[i][1]] == "undefined") {
          obj.concepts[arr[i][1]]={};
        }
        obj.concepts[arr[i][1]][arr[i][0]] = objHolder;
   
    }
    return obj;
  }

  
  function arrToGeniusConceptObj(arr){
    var obj = {};
     obj["genius-concepts"]={}
  
    var objHolder={};

    for(var i=1;i<arr.length;i++){
      if(!Number.isInteger(arr[i][0]))
        continue;
        objHolder={};
        
      for(var j=0;j<arr[i].length;j++){
          objHolder[arr[0][j]] = arr[i][j];
		console.log(objHolder)
        }
      
       
        obj["genius-concepts"][i] = objHolder;
   
    }
    console.log(obj)
    return obj;
  }