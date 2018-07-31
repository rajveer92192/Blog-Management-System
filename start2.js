var mc = require('mongodb').MongoClient;
var url ="mongodb://localhost:27017/mongoblogTEST";
var ur2 ="mongodb://localhost:27017/mongoblogPOSTTEST";

var exp = require('express');
var app = exp();
var http = require('http');

var path = require('path');
var fs = require('fs');
var server = http.createServer(app);
const fse = require('fs-extra');

var gmailSend = require("gmail-send")
({
user:"rajveer92192@gmail.com",
pass:"ddalqrgailyerypl",
to:"harshit744@gmail.com",
subject:"Verification Pin",
text:"YOUR VERIFY PIN IS 92192"
});

console.log("Server Running at Port 9090");
server.listen(9090);

app.use(exp.static('\public'));

app.get('/', function (req, res)
{
   res.sendFile( __dirname + "/" + "home.html" );
});


app.get("/in",function(req,res)
{
 gmailSend({});
 mc.connect(url,function(err,db)
 {
 var dbo = db.db("mongoblogTEST");

 var myob = { uid:req.query.uid, fname:req.query.fname , lname:req.query.lname , uname:req.query.uname , id:req.query.id , pass:req.query.pass , cpass:req.query.cpass,blogno:req.query.uid};
  if(myob.cpass == myob.pass)
 {

   dbo.collection("blogs").insert(myob,function(err,result)
   {
      if(err) throw err;
   	  res.redirect("profilepic.html");
      console.log("======================================================================");
      console.log("Record Inserted Details");
      console.log(result);
   	  db.close();
   });
  }
     else
     {
   	  console.log("Password Does not Match");
   	  res.send("Password Does not Match TRY AGAIN");
     }
});

});

app.get("/emailverify",function(req,res)
{

});

app.get("/login",function(req,res)
{
  mc.connect(url,function(err,db)
{
  var dbo = db.db("mongoblogTEST");
  var myob = { uname:req.query.uname, pass:req.query.pass };

   var query = {uname : myob.uname};
   dbo.collection("blogs").find(query).toArray(function(err,result)
   {
	  if(err)
    {
      throw err;
    }
	  else
	 {
		   if(result.length >0)
			 {
				 if( result[0].pass == myob.pass)
				 {

          res.redirect("myacc.html");
         }
				 else
				 {
					 res.send("USER AND PASSWORD DOES NOT MATCHED");
				 }
			 }
			 else
			 {
				 res.send("USER DOES NOT EXIST !!!!!");
			 }
       console.log("=================================================================================");
       console.log("Login Details");
	     console.log( result);
	 }

});
});
});

app.post("/pic",function(req,res)
{

});

app.get("/my",function(req,res)
{
  mc.connect(url,function(err,db)
 {
  var dbo = db.db("mongoblogPOSTTEST");

  dbo.collection("myblogposts").find("61").toArray(function(err,result)
  {
    if(err)
    {
      throw err;
    }
    else
    {
      console.log(result);
    }
  });

 });



});



app.get("/setting",function(req,res)
{
  gmailSend({});
  mc.connect(url,function(err,db)
{
  var dbo = db.db("mongoblogTEST");
  var myob = { uid:req.query.uid };

   var query = {uid : myob.uid};
   dbo.collection("blogs").find(query).toArray(function(err,result)
   {
      if(err)
      {
       throw err;
      }
    else
    {
      var myob1 = { fname:req.query.fname , lname:req.query.lname , uname:req.query.uname , id:req.query.id , pass:req.query.pass , cpass:req.query.cpass };
       if(result[0].uid == myob.uid)
       {
           dbo.collection("blogs").update({'uid':myob.uid},{$set:{'fname':myob1.fname ,'lname':myob1.lname ,'uname':myob1.uname ,'id':myob1.id ,'pass':myob1.pass ,'cpass':myob1.cpass }});
            res.redirect("myacc.html");
       }
       else
       {
           res.send("Try Again");
       }
  }
  console.log("==========================================================================");
  console.log("Record Updation Details");
  console.log(result);

  });
});

});



app.get("/inpost",function(req,res)
{
  mc.connect(url,function(err,db)
 {
   var dbo = db.db("mongoblogPOSTTEST");
   var myob = {
                blogid: req.query.blogid,
                pid: req.query.pid,
                pname: req.query.pname,
                ptype: req.query.ptype,
                pfilename:"",
                ppath:"",
                pdata:""
              };

     dbo.collection("myblogposts").insert(myob,function(err,result)
     {
        if(err) throw err;
        res.redirect("post.html");
        console.log("======================================================================");
        console.log("Record Inserted Details");
        console.log(result);
        db.close();
     });
  });
});


 app.get('/outpost',function(req, res)
 {
   mc.connect(url,function(err,db)
  {
   var dbo = db.db("mongoblogPOSTTEST");
   var ra = { pname : req.query.pname,
              pfilename : req.query.pfilename
	           };


    dbo.collection("myblogposts").update({'pname': ra.pname}, {$set:{'pfilename':ra.pfilename,'ppath':"D:\ATOM NODE\file with mongo"}}, {new: true}, function(err, doc)
   {
      fse.outputFile("files/"+ra.pname+".txt",ra.pfilename,function(err)
      {
        if (err) throw err;
        // if no error
        console.log("======================================================================");
        console.log("Data is written to file successfully.")
      });
      if(err)
	    {
        console.log("======================================================================");
        console.log("Something wrong when updating data!");
      }
	    res.redirect("myacc.html");
   });
  });
});




app.get("/arti",function(req,res)
{
  var s = req.query.s1;
  mc.connect(url,function(err,db)
 {
  var dbo = db.db("mongoblogPOSTTEST");
  var size;
  var senddata = [];
  var n = [];
  dbo.collection("myblogposts").count(function(err,countData)
  {
    size = countData;
    console.log(size);
  });

  dbo.collection("myblogposts").find().toArray(function(err,result)
  {
    if(err)
    {
      throw err;
    }
    else
    {
      for(var i =0;i<size;i++)
      {
        n[i]=result[i].pname;
        senddata[i] = result[i].pfilename;

      }
      res.send(n + "   \n   " + senddata);
    }

  });

 });

});
