$("#catEmptyTable").attr("style", "display: none;");
$("#catEmptyTable td").attr("style", "display: none;");
(function readCategory() {
    const categoryList = document.getElementById("cat-list");
    catRef.once("value",snap=>{
        if(!snap.hasChildren() || snap.hasChildren == ""){
            $("#spinnerLoaderCat").attr("style", "display:none");
            $("#catEmptyTable").removeAttr("style");
            $("#catEmptyTable td").removeAttr("style");
        }else{
            $("#spinnerLoaderCat").attr("style", "display:none");
        }
    });
    catRef.on("child_added", snap => {
        let $li = document.createElement("tr");
        let imageCol = document.createElement("td");
        let enameCol = document.createElement("td");
        let anameCol = document.createElement("td");
        let operation = document.createElement("td");
        
        $li.id = snap.key;
        $li.classList.add("inList");
        // edit button
        var dropdown =
            "<button class='btn btn-warning dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' >Action</button>"
            + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
            + "<a class='dropdown-item' cat-id='"+ snap.key + "' onclick='specifyButton(event)'>Edit</a>"
            + "<a class='dropdown-item' onclick='return deleteButtonClicked(event);' categoryID='" + snap.key + "' style='cursor: pointer'>Delete</a> </div>";

        operation.innerHTML = "<button type='button' class='btn btn-warning' cat-id='"
            + snap.key + "' onclick='specifyButton(event)'>Edit</button>"
        //delete button
        let deleteIconUI = document.createElement("i");
        snap.forEach(function (element) {
            var key = element.key,
                value = element.val();
            deleteIconUI.innerHTML = "<button type='button' onclick='return deleteButtonClicked(event);' categoryID='" + snap.key + "' style='cursor: pointer' class='btn btn-warning'>Delete</button>";
            if (key == "categoryIcon") {
                imageCol.innerHTML = "<img src=" + value + " />";
            }
            if (key == "categoryName") {
                enameCol.append(value);
            }
            if (key == "categoryNameArabic") {
                anameCol.append(value);
            }
        });
        operation.append(deleteIconUI);
        operation.innerHTML += dropdown;
        // operation.append(editCategory)
        $li.append(imageCol);
        $li.append(enameCol);
        $li.append(anameCol);
        $li.append(operation);
        categoryList.prepend($li);
        $('#categoryValue .pagination').empty();
        pagination("#cattb");
    });
    catRef.on("child_changed", snap => {
        $("#" + snap.key).find("td img").attr("src", snap.val().categoryIcon);
        $("#" + snap.key).find("td")[1].textContent = snap.val().categoryName;
        $("#" + snap.key).find("td")[2].textContent = snap.val().categoryNameArabic;
    });
    catRef.on("child_removed", snap => {
        $("#" + snap.key).remove();
    });
})();

// ------------------ DELETE --------------------------
function deleteButtonClicked(e) {
    $("#ConfirmModal").modal("show");
    $("#btnConfirmDialog").click(function () {
        const categoryRef = dbRef.child('Category/' + e.target.getAttribute("categoryID"));
        categoryRef.remove();
    })
}


var catid;
function readcatData() {
    const userListUI = document.getElementById("listcat");
    catRef.on("value", snap => {
        userListUI.innerHTML = ""
        userListUI.innerHTML = "<option value='select' selected>Select List</option>";
        snap.forEach(childSnap => {
            let key = childSnap.key,
                value = childSnap.val()
            let $li = document.createElement("option");
            let col1 = document.createElement("option");
            col1.innerHTML = value.categoryName;
            $li.append(col1);
            $li.setAttribute("user-key", key);
            $li.addEventListener("click", catClicked)
            userListUI.append($li);
        });
    });
}

var qu;
function readqData() {
    const userListUI = document.getElementById("cat-list2");
    catRef.on("value", snap => {
        userListUI.innerHTML = ""
        userListUI.innerHTML = "        <tr><td>Name</td><td>Edie</td><td>Delet</td></tr>";
        snap.forEach(childSnap => {
            let key = childSnap.key,
                value = childSnap.val()
            let $li = document.createElement("tr");
            // delete icon
            let deleteIconUI = document.createElement("td");
            deleteIconUI.class = "delete-user";
            deleteIconUI.innerHTML = " ☓";
            deleteIconUI.setAttribute("userid", key);
            deleteIconUI.addEventListener("click", deleteButtonClicked)
            let col1 = document.createElement("td");
            col1.innerHTML = value.categoryName;
            $li.append(col1);
            $li.append(deleteIconUI);
            col2.setAttribute("user-key", key);
            $li.addEventListener("click", userClicked)
            userListUI.append($li);
        });
    });
}

function catClicked(e) {
    var userID = e.target.getAttribute("user-key");
    catid = userID;
    var urlRef = dbRef.child('Categoryquestion/' + catid + '');
    const userListUI = document.getElementById("quu");
    urlRef.on("value", snap => {
        userListUI.innerHTML = ""
        userListUI.innerHTML = "<tr><td>Name</td><td></tr>";
        snap.forEach(childSnap => {
            let key = childSnap.key,
                value = childSnap.val()
            let $li = document.createElement("tr");
            let col1 = document.createElement("td");
            col1.innerHTML = value.question;
            $li.append(col1);
            col1.setAttribute("user-key", key);
            $li.addEventListener("click", userClicked)
            userListUI.append($li);
        });
    })
}

function UpdateCategory(event) {
    var categoyNameInEnglish = document.getElementById("categoyNameInEnglish"),
        categoyNameInArabic = document.getElementById("categoyNameInArabic"),
        imgCat = document.getElementById("imgCat"),
        errorCatImg = document.getElementById("errorCatImg"),
        errorCatNameEnglish = document.getElementById("errorCatNameEnglish"),
        errorCatNameArabic = document.getElementById("errorCatNameArabic");
    errorCatImg.style.display = "none";
    errorCatNameEnglish.style.display = "none";
    errorCatNameArabic.style.display = "none";
    if (String(imgCat.src).endsWith("/img/logo.jpg") == true) {
        errorCatImg.style.display = "block";
        errorCatImg.textContent = "* Category Image Must Be Added"
    }
    if (!categoyNameInEnglish.value) {
        errorCatNameEnglish.style.display = "block";
        errorCatNameEnglish.textContent = "* Category Name Must Be Upload"
    }
    if (!categoyNameInArabic.value) {
        errorCatNameArabic.style.display = "block";
        errorCatNameArabic.textContent = "* Category Name Must Be Upload"
    }

    if (event.target.textContent === "add") {
        if (categoyNameInEnglish.value && categoyNameInArabic.value &&
            String(imgCat.src).endsWith("/img/logo.jpg") != true) {
            let newCategory = {
                "categoryName": categoyNameInEnglish.value,
                "categoryNameArabic": categoyNameInArabic.value,
                "categoryIcon": imgCat.src
            }
            dbRef.child('Category').push(newCategory).then(function () {
                $("#addUpdateCategory").modal("hide");
            });
        }
    }
    if (event.target.textContent === "Update") {
        if (categoyNameInEnglish.value && categoyNameInArabic.value &&
            String(imgCat.src).endsWith("/img/logo.jpg") != true) {
            var categoryRef = firebase.database().ref('Category/' + event.target.getAttribute("cat-id"));
            categoryRef.update({
                "categoryName": categoyNameInEnglish.value,
                "categoryNameArabic": categoyNameInArabic.value,
                "categoryIcon": imgCat.src
            }).then(function () {
                $("#addUpdateCategory").modal("hide");
            });
        }
    }
}

function imageBrowserCategory() {
    var imageBrowserFreelancer = document.getElementById("File1Cat");
    imageBrowserFreelancer.click();
}

function specifyButton(event) {
    if (event.target.textContent === "Add New Category") {
        document.getElementById("categoyNameInEnglish").value = "";
        document.getElementById("categoyNameInArabic").value = "";
        document.getElementById("errorCatImg").style.display = "none";
        document.getElementById("errorCatNameEnglish").style.display = "none";
        document.getElementById("errorCatNameArabic").style.display = "none";
        document.getElementById("editecat").textContent = "add";
        document.getElementById("ModelCatHeader").textContent = "Add New Category";
        document.getElementById('File1Cat').value = null;
        $("#addUpdateCategory").modal("show");
    }

    if (event.target.textContent === "Edit") {
        document.getElementById("editecat").textContent = "Update";
        document.getElementById("ModelCatHeader").textContent = "Update Category";
        var catId = event.target.getAttribute("cat-id");
        document.getElementById("editecat").setAttribute("cat-id", catId);
        dbRef.child('Category/' + catId).once("value", snap => {
            snap.forEach(childSnap => {
                let key = childSnap.key,
                    catValue = childSnap.val()
                if (key == "categoryName") {
                    document.getElementById("categoyNameInEnglish").value = catValue;
                }
                if (key == "categoryNameArabic") {
                    document.getElementById("categoyNameInArabic").value = catValue;
                }
                if (key == "categoryIcon") {
                    document.getElementById("imgCat").src = catValue;
                }
            });
        }).then(function () {
            $("#addUpdateCategory").modal("show");
        });
    }
}

function addQUBtnClicked() {
    var catRef = firebase.database().ref('Categoryquestion/' + catid);
    const addUserInputsUI = document.getElementsByClassName("O-input");
    // this object will hold the new user information
    let newUser = {};
    var v = 1;
    // loop through View to get the data for the model 
    for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

        let key = addUserInputsUI[i].getAttribute('data-key');
        let value = addUserInputsUI[i].value;
        if (value == "") { v = 0; }
        newUser[key] = value;
    }
    if (v == 1) {
        var ee = (catRef.push(newUser).key);
    }
    if (v == 0) {
        md.showerror('top', 'center');
    }
}
var fileButton = document.getElementById('File1Cat');
var imgCat = document.getElementById('imgCat');
var task;
fileButton.addEventListener('change', function (e) {
    $("#addUpdateCategory img").hide();
    $("#addUpdateCategory  .spinner-border-edit").show();
    $("#editecat").attr("disabled", "disabled");
    var file = e.target.files[0];
    imgCat.src = "";
    var storageRef = firebase.storage().ref('img/' + file.name);
    task = storageRef.put(file);
    task.on('state_changed', function (snapshot) {
    }, function (error) {
        switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
            case 'storage/canceled':
                $("#addUpdateCategory .spinner-border-edit").hide();
                $("#addUpdateCategory img").show();
                document.getElementById("categoyNameInEnglish").value = "";
                document.getElementById("imgCat").src = "../img/logo.jpg";
                document.getElementById("errorCatImg").style.display = "none";
                document.getElementById("errorCatName").style.display = "none";
                break;
        }
    }, function () {
        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            imgCat.src = downloadURL;
            $("#addUpdateCategory img").show();
            $("#addUpdateCategory .spinner-border").hide();
            $("#editecat").removeAttr("disabled");
            e.target.files[0] = "";
        });
    });
});

$("#addUpdateCategory").on('hide.bs.modal', function (e) {
    if (task != null) {
        task.cancel()
    }
});

