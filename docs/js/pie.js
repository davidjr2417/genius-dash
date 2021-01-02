

//The reason this, and couple other of my canvas webapps, might be laggy is because the resolution scales up directly with the size of your display. This can be fixed by programmatically adjusting based on requested page resolution..

var demos = [

    {
        title: "",
        background: "#E5E5E5",
        dataset: {
            "Concept 1": { percentage: 16.66, color: "#FF0000", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
            "Concept 2": { percentage: 16.66, color: "#FF0000", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
            "Concept 3": { percentage: 16.66, color: "#FF0000", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
            "Concept 4": { percentage: 16.66, color: "#FF0000", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
            "Concept 5": { percentage: 16.66, color: "#FF0000", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
            "Concept 6": { percentage: 16.66, color: "#FF0000", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." }
        },
        font: "Copperplate",
        fullscreen: true,
        circleRadius: 120,
        pointerRadius: 230,
        textRadius: 190,
        pointerHeadRadii: 7,
        spacing: 10 * 200 / 300
    }
];



var settings = demos[0]


var stage;
var canvas;
var slices;
var lastCenter;

var infoPanel;
var transitionArc;
var bg;
var title;
var text;
var bar;

var demoIndex = 0;

// resize the canvas to fill browser window dynamically
function resizeCanvas() {
    if (settings.fullscreen) {
        canvas.width = document.getElementsByClassName('pie-container')[0].offsetWidth - 25;//window.innerWidth;
        canvas.height = document.getElementsByClassName('pie-container')[0].offsetHeight;//window.innerHeight;
    }
    for (var i = 0; i < stage.children.length; i++) {
        stage.children[i].x += canvas.width / 2 - lastCenter[0];
        stage.children[i].y += canvas.height / 2 - lastCenter[1];
    }
    lastCenter = [canvas.width / 2, canvas.height / 2];
}


function drawArc(graphics, color, center, radius, s, e) {
    var stroke = graphics
        .beginFill(color).moveTo(center[0], center[1])
        .arc(0, 0, radius, s, e).command;
    return stroke;
}


function distance(a, b) {
    return Math.pow(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2), .5);
}


function nextDemo() {
    demoIndex = (demoIndex + 1) % demos.length;
    settings = demos[demoIndex];
    for (var i in slices.children) {
        slices.children[i].off('mouseover', slices.children[i].mo);
        slices.children[i].off('mouseout', slices.children[i].ml);
        slices.children[i].off('click', slices.children[i].mc);
    }
    init();
    //console.debug("hi")
}



function init() {

    stage = new createjs.Stage("PieChart1");
    canvas = document.getElementById('PieChart1');
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
        arc.story = data.story;

        var stroke = drawArc(arc.graphics, data.color, center, settings.circleRadius, 0, 0);
        createjs.Tween.get(stroke)
            .to({ startAngle: currentAngle + settings.spacing / settings.circleRadius, endAngle: currentAngle + 2 * Math.PI * data.percentage / 100 }, 1000, createjs.Ease.sineInOut);
        currentAngle = currentAngle + 2 * Math.PI * data.percentage / 100;
        arc.saveEvents = function (n, a, b, c) { n.mo = a; n.ml = b; n.mc = c; }
        createjs.Tween.get(arc).wait(1000).call(
            function (event) {
                event.target.saveEvents(event.target, event.target.on("mouseover", sliceMouseOver), event.target.on("mouseout", sliceMouseOut), event.target.on("click", sliceMouseClick));
            });

        //console.log(arc);
        slices.addChild(arc);
    }
 

  //  stage.on("stagemousemove", mouseOver);

    stage.update();

}
init();


function init3() {
    settings.dataset={};
    settings.dataset= {
        "Variable2": { percentage: 16.66, color: "#FF0000", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
        "Business Entitie2s": { percentage: 16.66, color: "#00FF00", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
        "Pitch Deck2": { percentage: 16.66, color: "#FF0000", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
        "Data Collection2": { percentage: 16.66, color: "#00FF00", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
        "Polymorphism2": { percentage: 16.66, color: "#00FF00", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." },
        "Conditionals2": { percentage: 16.66, color: "#00FF00", story: "I don't really like boats because they can cause sea-sickness. However they are useful for transporting goods and fishing." }
    }
    stage = new createjs.Stage("PieChart1");
    canvas = document.getElementById('PieChart1');
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
        arc.story = data.story;

        var stroke = drawArc(arc.graphics, data.color, center, settings.circleRadius, 0, 0);
        createjs.Tween.get(stroke)
            .to({ startAngle: currentAngle + settings.spacing / settings.circleRadius, endAngle: currentAngle + 2 * Math.PI * data.percentage / 100 }, 1000, createjs.Ease.sineInOut);
        currentAngle = currentAngle + 2 * Math.PI * data.percentage / 100;
        arc.saveEvents = function (n, a, b, c) { n.mo = a; n.ml = b; n.mc = c; }
        createjs.Tween.get(arc).wait(1000).call(
            function (event) {
                event.target.saveEvents(event.target, event.target.on("mouseover", sliceMouseOver), event.target.on("mouseout", sliceMouseOut), event.target.on("click", sliceMouseClick));
            });

        //console.log(arc);
        slices.addChild(arc);
    }
 

  //  stage.on("stagemousemove", mouseOver);

    stage.update();

}





//use globalized radius below (replace 300)

function sliceMouseOver(event) {
    event.target.filters = [
        new createjs.ColorFilter(1, 1, 1, 1, 100, 100, 100, 0)
    ];
    event.target.cache(-300, -300, 600, 600);
}

function sliceMouseOut(event) {
    event.target.filters = [
        new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)
    ];
    event.target.cache(-300, -300, 600, 600);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colourIsLight(h) {

    // Counting the perceptive luminance
    // human eye favors green color...
    var rgb = hexToRgb(h);
    var a = 1 - (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return (a < 0.5);
}

function sliceMouseClick(event) {
    if (!stage.contains(infoPanel)) {
        //stage.setChildIndex( event.target, stage.getNumChildren()-1);
        infoPanel.children = [];
        bg = new createjs.Shape();
        bg.graphics.beginFill(event.target.color).drawRect(0, 0, canvas.width, canvas.height);
        infoPanel.addChild(bg);
        transitionArc = new createjs.Shape();
        transitionArc.x = canvas.width / 2;
        transitionArc.y = canvas.height / 2;
        infoPanel.parentSlice = event.target;
        var stroke = drawArc(transitionArc.graphics, "#000", [0, 0], settings.circleRadius, event.target.startAngle, event.target.endAngle);
        createjs.Tween.get(stroke)
            .to({ startAngle: 0, endAngle: 2 * Math.PI, radius: Math.max(canvas.width, canvas.height) * Math.sqrt(2) }, 1000, createjs.Ease.sineInOut);
        var backButton = new createjs.Shape().set({ x: 60, y: 60 });
        backButton.graphics.beginStroke(colourIsLight(event.target.color) ? "#000" : "#FFF").setStrokeStyle(6, 'round').drawCircle(0, 0, 40).moveTo(-15, 0).lineTo(5, 20).moveTo(-15, 0).lineTo(5, -20);

        update();


        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawCircle(0, 0, 40);
        backButton.hitArea = hit;
        backButton.color = colourIsLight(event.target.color) ? "#000" : "#FFF";
        backButton.on("mouseover", BBMouseOver);
        backButton.on("mouseout", BBMouseOut);
        backButton.on("click", BBMouseClick);
        infoPanel.addChild(backButton);
        title = new createjs.Text(event.target.title, "36px " + settings.font, backButton.color);
        title.textAlign = "center";
        title.y = 0;
        title.x = canvas.width / 2;
        infoPanel.addChild(title);
        text = new createjs.Text(event.target.story, "36px " + settings.font, backButton.color);
        text.textAlign = "center";
        text.y = 150;
        text.x = canvas.width / 2;
        text.lineWidth = canvas.width - 50;
        infoPanel.addChild(text);
        bar = new createjs.Shape();
        bar.graphics.beginStroke(colourIsLight(event.target.color) ? "#000" : "#FFF").setStrokeStyle(3, 'round').moveTo(-canvas.width / 2 + 150, 0).lineTo(canvas.width / 2 - 150, 0)
        bar.x = canvas.width / 2;
        bar.y = 125;
        infoPanel.addChild(bar);
        stage.addChild(infoPanel);
    }
}

function BBMouseOver(event) {
    event.target.filters = [
        new createjs.ColorFilter(1, 1, 1, 1, event.target.color == "#000" ? 100 : -100, event.target.color == "#000" ? 100 : -100, event.target.color == "#000" ? 100 : -100, 0)
    ];
    event.target.cache(-45, -45, 90, 90);
}

function BBMouseOut(event) {
    event.target.filters = [
        new createjs.ColorFilter(1, 1, 1, 1, 0, 0, 0, 0)
    ];
    event.target.cache(-45, -45, 90, 90);
}

function BBMouseClick(event) {
    //stage.removeChild(infoPanel);
    transitionArc = new createjs.Shape();
    transitionArc.x = canvas.width / 2;
    transitionArc.y = canvas.height / 2;
    //stage.addChild(transitionArc);
    var stroke = drawArc(transitionArc.graphics, event.target.parent.parentSlice.color, event.target.parent.parentSlice.center, Math.max(canvas.width, canvas.height) * Math.sqrt(2), 0, 2 * Math.PI);

    //var stroke = drawArc(arc.graphics, event.target.color, [0,0], 300, event.target.startAngle, event.target.endAngle);
    createjs.Tween.get(stroke)
        .to({ startAngle: event.target.parent.parentSlice.startAngle, endAngle: event.target.parent.parentSlice.endAngle, radius: settings.circleRadius }, 1000, createjs.Ease.sineInOut).call(function () { stage.removeChild(infoPanel); });
}

function update() {
    if (transitionArc && infoPanel) {
        transitionArc.x = canvas.width / 2;
        transitionArc.y = canvas.height / 2;
        bg.graphics.drawRect(0, 0, canvas.width, canvas.height);

        if (title && text && bar) {
            title.y = 30;
            title.x = canvas.width / 2;
            text.y = 150;
            text.x = canvas.width / 2;
            bar.x = canvas.width / 2;
            bar.y = 125;
        }

        infoPanel.x = infoPanel.y = 0;
        transitionArc.cache(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        transitionArc.updateCache();
        maskFilter = new createjs.AlphaMaskFilter(transitionArc.cacheCanvas);
        infoPanel.filters = [maskFilter];
        infoPanel.cache(0, 0, canvas.width, canvas.height);
        infoPanel.updateCache(0, 0, canvas.width, canvas.height);
    }
    /*for (var i=0; i<slices.children.length; i++)
      {
        slices.children[i].x = canvas.width/2;
        slices.children[i].y = canvas.height/2;
      }*/
}


