


var wtask, ftask, ptask;
(function readUserData() {
    const creq = document.getElementById("creq");
    const numcus = document.getElementById("numcus");
    const ncat = document.getElementById("ncat");
    const nsum = document.getElementById("sumcost");
    requestRef.on("value", snap => {

        creq.innerText = (snap.numChildren());
        cusRef.innerText = (snap.numChildren());

    })
    cusRef.on("value", snap => {

        numcus.innerText = (snap.numChildren());


    })
    catRef.on("value", snap => {

        ncat.innerText = (snap.numChildren());


    })

    var costRef = dbRef.child('CmTasks');
    var tf = document.getElementById("txtf");
    var tw = document.getElementById("txtw");
    var tp = document.getElementById("txtp");

    requestRef.orderByChild("state").equalTo("FREELANCE_FINISHED").on("value", snap => {


        tw.value = snap.numChildren();

    });
    requestRef.orderByChild("state").equalTo("PENDING").on("value", snap => {


        tp.value = snap.numChildren();

    });
    requestRef.orderByChild("state").equalTo("CM_FINISHED").on("value", snap => {


        tf.value = snap.numChildren();

    });

    var sum = 0;
    costRef.on("value", snap => {

        snap.forEach(childSnap => {

            let keyx = childSnap.key,
                valuex = childSnap.val();
            sum = sum + parseInt(valuex.cost);
            nsum.innerText = sum;

        });


    });
})();

var catid;

function readcatData() {

    const userListUI = document.getElementById("listcat");

    usersRef.on("value", snap => {

        userListUI.innerHTML = ""

    })

}
var qu;
function readqData() {

    const userListUI = document.getElementById("user-list2");

    usersRef.on("value", snap => {

        userListUI.innerHTML = ""
        userListUI.innerHTML = "        <tr><td>Name</td><td>Edie</td><td>Delet</td></tr>";
        snap.forEach(childSnap => {

            let key = childSnap.key,
                value = childSnap.val()

            let $li = document.createElement("tr");

            // edit icon
            let editIconUI = document.createElement("td");
            editIconUI.class = "edit-user";
            editIconUI.innerHTML = " ✎";
            editIconUI.setAttribute("userid", key);
            editIconUI.addEventListener("click", editButtonClicked)

            // delete icon
            let deleteIconUI = document.createElement("button");
            deleteIconUI.class = "delete-user";
            deleteIconUI.innerHTML = " ☓";
            deleteIconUI.setAttribute("userid", key);
            deleteIconUI.addEventListener("click", deleteButtonClicked)
            let col1 = document.createElement("td");

            // editIconUI.class = "edit-user";
            col1.innerHTML = value.categoryName;



            //$li.innerHTML = ;<div> <input type='radio' name='drone' value='louie' > <label for='louie'>" + value.categoryName + "</label></div>"
            $li.append(col1);
            // $li.innerHTML = value.categoryName;
            $li.append(editIconUI);
            $li.append(deleteIconUI);

            col1.setAttribute("user-key", key);
            $li.addEventListener("click", userClicked)

            userListUI.append($li);

        });


    })

}
function catClicked(e) {


    var userID = e.target.getAttribute("user-key");
    catid = userID;
    // alert(catid);
    // var qRef = dbRef.child('Category/' + catid + '/CategoryQuestion');
    //var rootRef = firebase.database.ref();
    var urlRef = dbRef.child('CategoryQuestion/' + catid + '');
    //urlRef.once("value", function (snapshot) {
    //    snapshot.forEach(function (child) {
    //        console.log(child.key + ": " + child.val());
    //    });
    //});
    //var uRef = dbRef.child('Category/' + catid + '/CategoryQuestion');
    ////var uRefq = firebase.database().ref('Category/1/CategoryQuestion/');
    //var userDetailUI = document.getElementById("quu");
    // var txtcost = document.getElementById("txtidcat");
    // var txtcost = document.getElementById("cost");

    const userListUI = document.getElementById("quu");

    urlRef.on("value", snap => {

        userListUI.innerHTML = ""
        userListUI.innerHTML = "        <tr><td>Name</td><td></tr>";
        snap.forEach(childSnap => {

            let key = childSnap.key,
                value = childSnap.val()

            let $li = document.createElement("tr");

            //// edit icon
            //let editIconUI = document.createElement("td");
            //editIconUI.class = "edit-user";
            //editIconUI.innerHTML = " ✎";
            //editIconUI.setAttribute("userid", key);
            //editIconUI.addEventListener("click", editButtonClicked)

            //// delete icon
            //let deleteIconUI = document.createElement("td");
            //deleteIconUI.class = "delete-user";
            //deleteIconUI.innerHTML = " ☓";
            //deleteIconUI.setAttribute("userid", key);
            //deleteIconUI.addEventListener("click", deleteButtonClicked)
            let col1 = document.createElement("td");

            // editIconUI.class = "edit-user";
            col1.innerHTML = value.question;



            //$li.innerHTML = ;<div> <input type='radio' name='drone' value='louie' > <label for='louie'>" + value.categoryName + "</label></div>"
            $li.append(col1);
            // $li.innerHTML = value.categoryName;
            //$li.append(editIconUI);
            //$li.append(deleteIconUI);

            col1.setAttribute("user-key", key);
            $li.addEventListener("click", userClicked)

            userListUI.append($li);

        });


    })



}

function userClicked(e) {


    var userID = e.target.getAttribute("user-key");
    vv = userID;
    const userRef = dbRef.child('Category/' + userID + '');
    const userDetailUI = document.getElementById("nnnn");

    userRef.on("value", snap => {

        userDetailUI.innerHTML = ""

        snap.forEach(childSnap => {
            var $p = document.createElement("p");
            $p.innerHTML = childSnap.key + " - " + childSnap.val();
            userDetailUI.append($p);
        })

    });


}





// --------------------------
// ADD
// --------------------------

function addQUBtnClicked() {
    // alert(vv);
    //const usersRef = dbRef.child('Category/1/CategoryQuestion');
    var usersRef = firebase.database().ref('CategoryQuestion/' + catid);
    const addUserInputsUI = document.getElementsByClassName("O-input");
    //var userID = e.target.getAttribute("user-key");
    //firebase.database().ref('okour/11' ).set({
    //    username: name,
    //    email: email,
    //    profile_picture: imageUrl
    //});
    // this object will hold the new user information
    let newUser = {};

    // loop through View to get the data for the model 
    for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

        let key = addUserInputsUI[i].getAttribute('data-key');
        let value = addUserInputsUI[i].value;
        newUser[key] = value;
    }

    usersRef.push(newUser)


    console.log(myPro)
    alert(myPro);


}


// --------------------------
// DELETE
// --------------------------
function deleteButtonClicked(e) {

    e.stopPropagation();

    var userID = e.target.getAttribute("userid");

    const userRef = dbRef.child('Category/' + userID);

    userRef.remove();

}


// --------------------------
// EDIT
// --------------------------
function editButtonClicked(e) {

    document.getElementById('edit-user-module').style.display = "block";

    //set user id to the hidden input field
    document.querySelector(".edit-userid").value = e.target.getAttribute("userid");

    const userRef = dbRef.child('Category/' + e.target.getAttribute("userid"));

    // set data to the user field
    const editUserInputsUI = document.querySelectorAll(".edit-user-input");


    userRef.on("value", snap => {

        for (var i = 0, len = editUserInputsUI.length; i < len; i++) {

            var key = editUserInputsUI[i].getAttribute("data-key");
            editUserInputsUI[i].value = snap.val()[key];
        }

    });




    const saveBtn = document.querySelector("#edit-user-btn");
    saveBtn.addEventListener("click", saveUserBtnClicked)
}


function saveUserBtnClicked(e) {

    const userID = document.querySelector(".edit-userid").value;
    const userRef = dbRef.child('Category/' + userID);

    var editedUserObject = {}

    const editUserInputsUI = document.querySelectorAll(".edit-user-input");

    editUserInputsUI.forEach(function (textField) {
        let key = textField.getAttribute("data-key");
        let value = textField.value;
        editedUserObject[textField.getAttribute("data-key")] = textField.value
    });



    userRef.update(editedUserObject);

    document.getElementById('edit-user-module').style.display = "none";


}












