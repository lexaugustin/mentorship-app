var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    
    mongoose.connect('mongodb://localhost:27017/team_up', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema
var hackerSchema = new mongoose.Schema({
    name: String,
    portrait: String,
    skill: String,
	experience: Number,
	focus: String
});

var Hacker = mongoose.model("Hacker", hackerSchema);


var hackersArray = []

//Home page
app.get("/", function(req, res){
    res.render("home");
});


app.get("/waitinglist", function(req, res){
    //Get all Hackers from the database
    var tempArr = [] 
    var count = 0;
    
    Hacker.find({}, function(err, allHackers){
        if(err){
            console.log(err);
        } 
        
        else {
            res.render("waitingList", {hackers: allHackers});
        }
    });
});


app.post("/waitinglist", function(req, res){
    //Take data from user
    var newName = req.body.name;
    var newPortrait = req.body.portrait;
    var newSkill = req.body.skill;
    var newExperience = req.body.experience;
    var newFocus = req.body.focus;
    
    var newHacker = {name: newName, portrait: newPortrait, skill: newSkill, experience: newExperience, focus: newFocus}
    
    //Create a new campground and save to the database
    Hacker.create(newHacker, function(err, allHackers) {
        if(err){
            console.log(err);
        } else {
            //Redirect to the waiting list
            res.redirect("/waitinglist");
        }
    });
});

app.get("/waitinglist/new", function(req, res){
    res.render("newhacker");
});

app.get("/findteam", function(req, res){
    var tempArr = [] 
    var count = 0;
    var team = true;
    
    Hacker.find({}, function(err, allHackers){
        if(err){
            console.log(err);
        } 
        
        else {
            allHackers.forEach(function(person){
                tempArr.push(person);
            })
        }
        
        if (team == true) {
            for (var i = 0; i < tempArr.length; i++){
                if (tempArr[i].experience == 3 && count > 4) {
                hackersArray.push(tempArr[i]);
                }
                
                count++;
            }
        }
        
        team = false;

        res.render("team", {hackers: hackersArray});
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has started successfully");
});