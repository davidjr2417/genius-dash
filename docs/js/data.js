function geniusPortalInit() {
    var scriptId = "14DqVwveVm7DW84xpSQsIFeTh4ulrELBicHR-dK5Qsj9DQW-3R-ukgskA";
    
    // Call the Apps Script API run method
    //   'scriptId' is the URL parameter that states what script to run
    //   'resource' describes the run request body (with the function name
    //              to execute)
    gapi.client.script.scripts.run({
    'scriptId': scriptId,
    'resource': {
    'function': 'getUserData'
    }
    }).then(function(resp) {
    
    var result = resp.result;
    if (result.error && result.error.status) {
    // The API encountered a problem before the script
    // started executing.
    appendPre('Error calling API:');
    appendPre(JSON.stringify(result, null, 2));
    } else if (result.error) {
    // The API executed, but the script returned an error.
    
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
    
    var folderSet = result.response.result;
  console.log(result);
  console.log("result2"+result.response.result)
    }
    });
    }