const express=require("express");
const mongoose=require("mongoose");
require('dotenv').config();
const app = express();
// this for the back end data base conneciton with this only data from data base can be shown
// const uri="mongodb://localhost:27017/todoDBv3";
const uri_pass = process.env.MONGODB_URI_PASS;
const uri =process.env.MONGODB_URI
console.log(uri);
const uri_enc =  uri.replace("<password>",encodeURIComponent(uri_pass))
console.log(uri_enc);
mongoose.connect(uri_enc);

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.set('view engine','ejs')
app.use(express.static('public'));

///////////this the todo schema ///////////////////////////////////

const itemsSchema = mongoose.Schema({

    name:{
        type:String,
       
    },
    
})
const listSchema = mongoose.Schema({
    name: {type:String},
    tasks:[itemsSchema]
})
const items=mongoose.model('itemSchema',itemsSchema);
const list=mongoose.model('List',listSchema);

////////////////////////////////////////////////////////////////////////////
const newitem1=new items({
    name:"<-PRESS + BUTTON FOR ADD YOUR TASKS!->"
})
const newitem2=new items({
    name:"<-PRESS X FOR DELETE YOUR TASKS USING CHECK BOX!->"
})
const newitem3=new items({
    name:"<-GOOD LUCK WITH YOUR TASKS !->"
})

const default_items=[newitem1,newitem2,newitem3];


app.get("/",function(req,res){
    res.redirect("/home");
});

app.get('/:custom_url', function(req,res){
    const custom_url=req.params.custom_url;

    async function retriving_data_db(custom_url){
        console.log(custom_url);
        const db_res= await list.findOne({name:custom_url});
        console.log("this from retriving data:  "+db_res);
        if (!db_res) {
            // Handle the case where no documents were found (e.g., send a 404 response)
            return res.status(404).send("No list found with that custom URL");
          }
        else{
        const tasks=db_res.tasks;

        const title=db_res.name;
        console.log(tasks);
        res.render("cuslist",{kindOfDay:title,list:db_res.tasks});
        }
    }
    async function retriving_data_db1(){
        const db_res= await list.find();
        const title=req.params.custom_url;
        res.render("home",{list:db_res});
    }


    try{
        if(req.params.custom_url==="home"){
          retriving_data_db1();
        }
      
        else if(req.params.custom_url==="todo"){
            res.render("todo");

        }
        else{
            retriving_data_db(custom_url);
        }
    
}

catch(err){
    console.log(err);
}
   
   
    
})

app.post('/:custom_url',function(req,res){
    console.log(req.body.input_todo);
    const user_input=req.body.input_todo;
    const parm=req.params.custom_url;

    //saving the name of custom todo list
    
    async function saving_name(parm,user_input){
        console.log(user_input,parm+"this from saving name of the custom todo list!");

        const cus_todo=new list({
            name:user_input,
            tasks:default_items,
        });
        cus_todo.save();
        res.redirect(`/${user_input}`)
    }
    ///////////////////
////////////////////////saving data ////////////////////////////
    async function saving_db(parm,user_input){
        console.log("saving going on!")
        console.log("user name is:"+user_input+"and custom url parameter is:"+parm);
        
       const db_res= await list.findOne({name:parm});
       console.log(db_res);
    //   const db_up= await list.updateOne({ _id: db_res._id }, { $set:{tasks:{ name: user_input }}});
     db_res.tasks.push({ name:user_input});
     db_res.save();
    //   console.log(db_up);
     
       

        
    
        res.redirect(`/${parm}`)
    }
////////////////////////////////////////////////////////////////
    if(req.params.custom_url==="todo"){
        saving_name(parm,user_input)
    }
    else if(req.params.custom_url!=="todo"){
        console.log("working !!!!!!!!!!!!!!!!!!!!!!!!!")
          saving_db(parm,user_input)
    }
    
    
   


/////////////////////////////////////////////delete_work
    
});


app.post("/delete/:custom_url",function(req,res){
console.log("working delete!!!!!!!!!!!!!!!!!!11");
console.log(req.body.checkbox);
const b_id=req.body.checkbox;
console.log(b_id);
  
    async function deleting_data_db(parms,del_id){
      
       const db_res= await list.findOne({name:parms})
       if(parms==="del_custom_list"){
        console.log(parms,"this del id: " + del_id);
        const del_res= await list.deleteOne({name:del_id});
        console.log("this is after delteting the custom list :"+del_res);
        res.redirect("/");

       }
       else{
       db_res.tasks.remove({_id:del_id});
       db_res.save();
       
        console.log("successfully deleted!:"+parms);
        res.redirect('/'+parms);
       }
      
    }
   try{  
    if(req.params.custom_url){
      deleting_data_db(req.params.custom_url,req.body.checkbox);
    }
   
    }
 
   
    catch(err){
        console.log(err);
    }

});

app.listen("3000", function(){
    console.log("listening da")
})