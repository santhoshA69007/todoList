const express=require("express");
const strftime=require("strftime");
const mongoose=require("mongoose");
const mongodb=require("mongodb");

const app = express();
// this for the back end data base conneciton with this only data from data base can be shown
const uri="mongodb://localhost:27017/todoDB";
mongoose.connect(uri);

///////////this the todo schema ///////////////////////////////////

const todoSchema = mongoose.Schema({


    task:{
        type:String,
        required:true,
    }
})

const todoSchemawork = mongoose.Schema({
    task:{
        type:String,
        required:true,
    }
})

const todo=mongoose.model('todo_doc',todoSchema);
const todowork=mongoose.model('todowork_doc',todoSchemawork);
////////////////////////////////////////////////////////////////////////////

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.set('view engine','ejs')
app.use(express.static('public'));
var day=strftime("%A");
// this line is for list that appears on the front page or someother page 
let list=["Buy Food","Cook Food","Eat Food","Sleep","Repeat"];
// this line is for list that appears on the front page or someother page
let work_list=[]

app.get('/', function(req,res){
    try{
    async function retriving_data_db(){
        const db_res= await todo.find();

        res.render("list",{kindOfDay:"week_end",list:db_res});
    }
    retriving_data_db();
}
catch(err){
    console.log(err);
}
   
   
    
})
app.get('/work', function(req,res){
    async function retriving_data_db(){
        const db_res= await todowork.find();
        res.render("list",{kindOfDay:"work",list:db_res});
    }
    retriving_data_db();
   
});
// app.get('/about', function(req,res){
    
//     res.render("about",{kindOfDay:"work",list:work_list});
// });
app.post('/',function(req,res){
    console.log(req.body);
    let user_input=req.body.input;
    if(req.body.button==="work"){
        console.log(work_list);
        work_list.push(user_input);
        todo_new_work=new todowork({
           task:user_input,


        });
       todo_new_work.save();
       console.log("successfully saved todo work db!")
        res.redirect('/work');
    }
    else{
    
    list.push(user_input);
    const todo_new=new todo({
        task:user_input,
     })
     todo_new.save();
     console.log("successfully saved todo db normal!");
    res.redirect('/');
}

    
});
app.post("/delete/:del_res",function(req,res){
console.log(req.body.checkbox);
const del_res=req.params.del_res;
console.log(req.params.del_res);
  
    async function deleting_data_db(){
        if(del_res==="week_end"){
        await todo.deleteOne({_id:req.body.checkbox});
       
        console.log("successfully deleted!:"+req.params.del_res);
        res.redirect('/');
        }
        else if(del_res==="work"){
                await todowork.deleteOne({_id:req.body.checkbox});
               

                console.log("successfully deleted!:"+req.params.del_res);
                res.redirect('/work');

        }
      
    }
   try{  
    
      deleting_data_db();
 
    }
 
   
    catch(err){
        console.log(err);
    }

});

app.listen("3000", function(){
    console.log("listening da")
})






