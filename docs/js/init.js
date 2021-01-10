function initGeniusInfo() {

    console.log("initGeniusInfo")
    // Call the Apps Script API run method
    //   'scriptId' is the URL parameter that states what script to run
    //   'resource' describes the run request body (with the function name
    //              to execute)

    var test = gapi.client.script.scripts.run({
        'scriptId': SCRIPT_ID,
        'resource': {
            'function': 'getUserData',
            'devMode': false
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
            
            
            userObj = result.response.result;
            setStorage("genius-info",userObj)
            

        }
    });
    
    
}
//Feature 1 & 2 -  Add Items To Drop Down (Show Curren Week)
function initGeneralInfo(fileId){
  
  

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
        // is treated as a JavaScript object
        var generalInfoArr = result.result.general_info;
  
        setStorage("general_info", arrToGeneralObj(generalInfoArr))
      //  updateDropDown();
        
      }
    })
  
  
  }
  


  function initConceptInfo(fileId) {
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


  function initGeniusConceptInfo(fileId) {
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
        var mainConceptsArr = result.result["genius-concepts"];
        var conceptsObj = arrToGeniusConceptObj(mainConceptsArr);
        setStorage("genius-concepts", conceptsObj)
        //var test = localStorage.getItem('concepts')
        //console.log(JSON.parse(test));
  
      }
    });
  }



