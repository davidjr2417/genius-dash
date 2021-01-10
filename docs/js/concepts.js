

function  getMaxKey(obj) {
  var max=0;
  for (var property in obj) {
    max = (max < parseFloat(property)) ? parseFloat(property) : max;
  }
  
  return max;
}









function submitNote(){


  //1. getElementsClassName ('noteArea')
  //2. Loop Through And Add All Notes To An Array [[Question1, Answer1]
  
  var geniusConceptsObjJSON = getStorage("genius-concepts"); 
  var geniusConcepts = geniusConceptsObjJSON["genius-concepts"]
  console.log(geniusConcepts)
  var obj = {};

  var today = new Date();
  var datetime = "" + today.getDate() + "/"
                  + (today.getMonth()+1)  + "/" 
                  + today.getFullYear() + " "  
                  + today.getHours() + ":"  
                  + today.getMinutes() + ":" 
                  + today.getSeconds();

 
 var currKey = parseInt( $(".paper-content .noteArea")[0].dataset.key);
  var geniusConceptsObjKey = obk(geniusConcepts, "concept-key", currKey);

 
 
  geniusConcepts[geniusConceptsObjKey]["date-submitted"]=datetime;
  geniusConcepts[geniusConceptsObjKey]["concept-status"]="pending";
  geniusConceptsObjJSON["genius-concepts"] = geniusConcepts;
  
setStorage("genius-conceptss", geniusConceptsObjJSON)

saveToDB(geniusConcepts[geniusConceptsObjKey])

}

function saveToDB(obj) {

  console.log("initGeniusInfo")
  console.log(JSON.stringify(obj))
  // Call the Apps Script API run method
  //   'scriptId' is the URL parameter that states what script to run
  //   'resource' describes the run request body (with the function name
  //              to execute)

  var test = gapi.client.script.scripts.run({
      'scriptId': SCRIPT_ID,
      'resource': {
          'function': 'addGeniusConceptData',
          'devMode': false,
          'parameters':JSON.stringify(obj)
      }
  }).then(function (resp) {

      //setInterval(function () { console.log(formatDate(profile2.expires_at)); }, 2000)

      var result = resp.result;
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
          // The values of this object are the script's 'errorMessage' and
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
          
          
          userObj = resp.result.response.result;
          console.log("completed")
         console.log(userObj)// setStorage("genius-info",userObj)
          

      }
  });
  
  
}