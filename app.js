//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");

const url="mongodb+srv://NewUser:@Sahil821@@cluster0.yoqqt.mongodb.net/blogdata?retryWrites=true&w=majority"

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const db=mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once("open",()=>{
  console.log("connected successfully to atlas mongodb server......")
})

const blogdataSchema=new mongoose.Schema({
   posttitle:String,
   postbody:String
})

const blogdata=new mongoose.model("blogdata",blogdataSchema)

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

blogdata.find({},function(err,result){
  if(!result){
    new blogdata({
      posttitle:"Home",
      postbody:homeStartingContent
    }).save()
  }
})

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var post=[];

//below variale store the data about post globally.
var postglobaldata=[

  {
    posttitle:"Home",
    postbody:homeStartingContent
  }

];

app.get("/",(req,res)=>{

   blogdata.find({},function(err,results){
     if(err)
     console.log(err)
     else{
       console.log(results)
      res.render("home",{postglobaldatas:results})
     }
   })
      
//  res.render("home",{postglobaldatas:postglobaldata})

})

app.get("/post/:parameters",(req,res)=>{

        let name=_.lowerCase(req.params.parameters);
        blogdata.findOne({posttitle:name},function(err,result){

          if(err)
          console.log(err)
          else{
              if(result)
             res.render("post",{comeposttitle:_.capitalize(result.posttitle),comepostbody :result.postbody})
          }

        })


      //this code work with array 
      /*  post.push(req.params.parameters)

        postglobaldata.forEach(element=>{
           
          let str1=element.posttitle;

           if(_.lowerCase(str1)==_.lowerCase(req.params.parameters)){

                res.render("post",{comeposttitle:element.posttitle,comepostbody:element.postbody})
                
           }

        }) */
         

})

app.get("/about",(req,res)=>{
  
     res.render("about",{aboutcontent:aboutContent})

})


app.get("/contact",(req,res)=>{

         res.render("contact",{contactcontent:contactContent})

})

app.get("/compose",function(req,res){
 
   res.render("compose");

})

app.post("/compose",(req,res)=>{

       let postdata={
             
            posttitle:req.body.posts,
            postbody:req.body.postbody

       }
      
       const data=new blogdata({
         posttitle:req.body.posts,
         postbody:req.body.postbody
       })
       data.save();
       


       postglobaldata.push(postdata);
       console.log(postglobaldata);
       res.redirect("/");

})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
