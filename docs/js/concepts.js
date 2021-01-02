//Feature 0 - Convert JSON Array To Obj and Storage
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

  function setStorage(itemName, dataObj){
    localStorage.setItem(itemName, JSON.stringify(dataObj));
  }
  function getStorage(itemName){
  return JSON.parse( localStorage.getItem(itemName));

  }



  
//Feature 1 & 2 -  Add Items To Drop Down (Show Curren Week)
function getDropDown(fileId){
  
  

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
      updateDropDown();
      
    }
  })


}

function updateDropDown(){
 
 
 
  
  var conceptsObj = getStorage("concepts");
  

  var generalObj = getStorage("general_info");
  for (var i=1;i<=getMaxKey(conceptsObj.concepts);i++ ){
  
    var o = new Option("Week " + i,"week-" + i );
   
    $("#concept-select").append(o);
  }
 
  
}
function updateConceptsPie(e){


var allConceptsObj = getStorage("concepts");

var selectedWeekNumArr = e.value.split("-");


var conceptsObj =  allConceptsObj.concepts[selectedWeekNumArr[1]]

  var pieData = createPieDataSet(conceptsObj)
init2(pieData)
}

function createPieDataSet(obj){
  // console.log(obj)
  var dataset={};
  var dataHolder={}
  for (var property in obj) {
    
  dataset[obj[property]["concept-title"]] = {};

  dataset[obj[property]["concept-title"]].percentage = (1/Object.keys(obj).length)*100; 

  
  if(obj["concept-status"]=="complete")
   dataset[obj[property]["concept-title"]].color = "#00FF00";
  else
  dataset[obj[property]["concept-title"]].color = "#FF0000";
 
  dataset[obj[property]["concept-title"]].story= obj[property]["concept-description"];
  dataset[obj[property]["concept-title"]]["key-id"]= obj[property]["key-id"];
   }

  // console.log(dataset);
   return dataset;
  }


function init2(objData) {
  
settings.dataset = objData;
settings.spacing = 10 * 200 / 300;
  stage.removeAllChildren();
  stage = new createjs.Stage("PieChart1");
  canvas = document.getElementById('PieChart1');
  canvas.innerHTML="";
  window.addEventListener('resize', resizeCanvas, false);

  canvas.style.background = settings.background;

  createjs.Ticker.setFPS(60);

  stage.enableMouseOver();

  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", update);
  lastCenter = [canvas.width / 2, canvas.height / 2];
  resizeCanvas();

  slices = new createjs.Container();
  infoPanel = new createjs.Container();

  var title = new createjs.Text(settings.title, "72px " + settings.font, colourIsLight(settings.background) ? "#000" : "#FFF");
  title.x = canvas.width / 4;
  title.y = 100;
  title.textAlign = "center";
  stage.addChild(title)
  stage.addChild(slices);



  var currentAngle = 0;
  for (var entry in settings.dataset) {
      var data = settings.dataset[entry];
      // console.log(data)
      if (data.percentage == 100)
          settings.spacing = 0;
      var arc = new createjs.Shape();
      arc.x = canvas.width / 2;
      arc.y = canvas.height / 2;
      var cAngle = currentAngle + Math.PI * data.percentage / 100;
      var center = [settings.spacing * (Math.cos(cAngle)), settings.spacing * Math.sin(cAngle)]
      var label = new createjs.Text(entry, "20px " + settings.font, colourIsLight(settings.background) ? "#000" : "#FFF");
      label.x = arc.x + settings.textRadius * Math.cos(cAngle);
      label.y = arc.y + settings.textRadius * (Math.abs(Math.sin(cAngle)) > .7 ? (Math.sin(cAngle) < 0 ? Math.sin(cAngle) + .2 : Math.sin(cAngle) - .2) : Math.sin(cAngle));

      label.textAlign = "center";
      var line = new createjs.Shape();

      stage.addChild(label);
      //The following are properties added to the Shape objects so it "remembers" important details about its associated graphics object, and details about the Slice data

      arc.color = data.color;
      arc.startAngle = currentAngle + settings.spacing / settings.circleRadius;
      arc.endAngle = currentAngle + 2 * Math.PI * data.percentage / 100;
      arc.center = center;
      arc.title = entry;
      // arc.addEventListener("click", alert("a"), false)
      arc.story = data.story;
      arc["key-id"]=data["key-id"];
      var stroke = drawArc(arc.graphics, data.color, center, settings.circleRadius, 0, 0);
      createjs.Tween.get(stroke)
          .to({ startAngle: currentAngle + settings.spacing / settings.circleRadius, endAngle: currentAngle + 2 * Math.PI * data.percentage / 100 }, 1000, createjs.Ease.sineInOut);
      currentAngle = currentAngle + 2 * Math.PI * data.percentage / 100;
      arc.saveEvents = function (n, a, b, c) { n.mo = a; n.ml = b; n.mc = c; }
      createjs.Tween.get(arc).wait(1000).call(
          function (event) {
              event.target.saveEvents(event.target, event.target.on("mouseover", sliceMouseOver), event.target.on("mouseout", sliceMouseOut), event.target.on("click", sliceMouseClick)), event.
              target.on("click", getSliders);
          });

      //console.log(arc);
      slices.addChild(arc);
      
  }


//  stage.on("stagemousemove", mouseOver);

  stage.update();

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


function  getMaxKey(obj) {
  var max=0;
  for (var property in obj) {
    max = (max < parseFloat(property)) ? parseFloat(property) : max;
  }
  
  return max;
}




//     //Feature 3 - Create Elements For Image Slideshow
//     1. Based on Clicked / Initial Concepts Show Resource Slideshow
//     2. Onlclick Show Resources



function getSliders(e) {
  var conceptsObjJSON = getStorage("concepts");
  // var generalObj = getStorage("general_info");

  // 1. Get Key-Id
  var currKey = e.target["key-id"];
  var conceptsObj = conceptsObjJSON.concepts;
console.log(conceptsObj)
  for (var property in conceptsObj) {
    if (conceptsObj[property][currKey]) {
      var resources = conceptsObj[property][currKey]["concept-resources"];
     
     console.log(resources)
      var arr = JSON.parse(resources)
      $("#carousel-inner").html("")
      var active = "active";
      for(var i=0; i<arr.length; i++){
       
        console.log(arr[i][2])
        if(i>0)
          active ="";
        $("#carousel-inner").append(
          '<div class="video-container item '+active+'">'+
       '<div class="youtube-video" id="'+arr[i][2] +'"></div>'+
       ' <div class="carousel-caption">Video '+i+'</div> </div>'
          )
      

      }

      var questions = conceptsObj[property][currKey]["concept-questions"];
     
     
      var arr2 = JSON.parse(questions)
      console.log(questions);


      $(".notes-outer-container").html("")
    
      for(var i=0; i<arr2.length; i++){
       
      
        $(".notes-outer-container").append(
          ' <div class="col-12 col-lg-6">'+
          '<div class="paper">'+
            '<div class="paper-content">'+
             ' <h4 class="conceptKey conceptKey-'+currKey+'">'+
                (i+1) +". "+arr2[i]+
                ' </h4> '+
             

              '<textarea class="noteArea">Hello world !&#10;Here\'s a paaper textarea tag.</textarea>'+
            '</div>'+
            '</div>'+

            '</div>'
          )
          
      

     }
      
    }



  }
  onYouTubeIframeAPIReady()



}