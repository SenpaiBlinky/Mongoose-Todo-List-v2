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
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema)

// adding new items to the db

const listItemTwo = new Item ({
    name: "Brush Teeth"
})

const listItemOne = new Item ({
    name: "Brush Teeth"
})

const listItemThree = new Item ({
    name: "Go to the gym"
})

const defaultItems = [listItemOne, listItemTwo, listItemThree]




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


app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newListItems: workItems})
})

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workItems.push(item)
    res.redirect("/work")
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
})