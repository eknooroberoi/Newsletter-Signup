const express= require("express");
const bodyParser= require("body-parser");
const request= require("request");
const https=require("https");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
//bootstap style sheet we got from remote location but custom style sheet is local.
//as images and styles.css were local/static page in local file system which we are trying to pull up.
//in order for our server to serve up static files we have to use a fun of express called static.
//inside express.static() we write the name of folder which will contain static files
//we keep all static files inside the folder public and we are providing its path
app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req,res){
  const firstName=req.body.fname;
  const lastName=req.body.lname;
  const email=req.body.email;
  //This is the sort of data that they would expect us to send to their server.
//--data '{"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}' \
//new javascript object (data)
//merge fields contain 1st and last name. it is an object
//1 object in array coz we are going to subscribe 1 person at a time
const data={
  members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
};
//convert this javascript object to JSON string
const jsonData= JSON.stringify(data);
// make request
//call back function gives response from mailchimp Server
const url="https://us10.api.mailchimp.com/3.0/lists/29815fb778"
//options is javascript object
const options = {
  method: "POST",
  auth: "eknoor:1b0e3de859313b38700bfe291022a5ba-us10"
}
const request= https.request(url, options, function(response){
  if(response.statusCode === 200){
    res.sendFile(__dirname+"/success.html");
  }
  else{
    res.sendFile(__dirname+"/failure.html");
  }

  response.on("data", function(data){
  console.log(JSON.parse(data));
});
});
//pass data to mailchimp server
request.write(jsonData);
request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
});
//3000 is local port. Heroku chooses port for u. it will be dynamic port which heroku will choose for u. process.env.PORT is dynamic port
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
//we have create a procfile. this is the file Heroku checks while launching the app
//API key
//1b0e3de859313b38700bfe291022a5ba-us10(can be from us1 to us20)

//unique id.This is your audience I.D. or also known as list I.D. and that is going to help MailChimp identify the
//list that you want to put your subscribers into.this tells we are subscribing members into the list with this id
//29815fb778
