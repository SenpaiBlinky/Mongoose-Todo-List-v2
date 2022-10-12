const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const date = require(__dirname + "/date.js")


const app = express();


// only if using ejs (for templates)
app.set('view engine', 'ejs');


//used for body parser and also shows where static pages are
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))




// mongoose
mongoose.connect("mongodb+srv://admin-richi:straighttogold1@cluster0.zniop21.mongodb.net/todolistDB");

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema)

// adding new items to the db

const listItemOne = new Item ({
    name: "Dumpy Wumpy"
})

const listItemTwo = new Item ({
    name: "Brush Teeth"
})

const listItemThree = new Item ({
    name: "Go to the gym"
})

const defaultItems = [listItemOne, listItemTwo, listItemThree]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)


// get and posts
app.get("/", function(req, res){

    let day = date.getDate();


    Item.find({}, function(err, foundItems){

        if (foundItems.length === 0) {

            Item.insertMany(defaultItems, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Success");
                }

            })

            res.redirect("/")

        } else {

            res.render("list", {listTitle: day, newListItems: foundItems})

        }
        

    })
    
})

app.post("/", function(req, res) {

    const itemName = req.body.newItem

    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/")

    // if (req.body.list === "Work"){
    //     workItems.push(item)
    //     res.redirect("/work")
    // } else {
    //     items.push(item)

    //     res.redirect("/")
    // }

    

    

})


app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/")
        }
      })
})


// app.get("/:customListName", function(req, res){
//     const customListName = req.params.customListName

//     List.findOne({name: customListName}, function(err, foundList){
//         if (!err){
//             if (!foundList){

//                 // creates a new list
//                 const list = new List ({
//                     name: customListName,
//                     items: defaultItems
//                 });
            
//                 list.save()

//                 res.redirect("/" + customListName)

//             } else {

//                 res.render("list", {listTitle: foundList.name, newListItems: foundList.items})

//             }
//         }
//     })

    
// })

let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
} 

app.listen(port, function(){
    console.log("Server started on port 3000");
})