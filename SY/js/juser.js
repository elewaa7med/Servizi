
var selectingSendToFree = document.getElementById("selectingSendToFree"),
    DCountry = document.getElementsByClassName("DCountry"),
    DCity = document.getElementsByClassName("DCity"),
    DCategory = document.getElementsByClassName("DCategory"),
    DSpsific = document.getElementsByClassName("DSpsific"),
    countFreelancer = document.getElementById("countFreelancer");
$("#CusEmptyTable").attr("style", "display: none;");
$("#CusEmptyTable td").attr("style", "display: none;");
$("#FreeEmptyTable").attr("style", "display: none;");
$("#FreeEmptyTable td").attr("style", "display: none;");
$("#EmpEmptyTable").attr("style", "display: none;");
$("#EmpEmptyTable td").attr("style", "display: none;");
var userType = localStorage.getItem("userType"),
    id = null;
function currentPage(page) {
    localStorage.setItem("currentPage", page);
};
if (localStorage.getItem("currentPage") == "profile") {
    var tabLink = document.getElementById("usertab").getElementsByClassName("nav-link");
    tabLink[0].classList.add("active");
    tabLink[1].classList.remove("active");
    tabLink[2].classList.remove("active");
}
if (localStorage.getItem("currentPage") == "customer") {
    var tabpanel = document.getElementsByClassName("employee")[0].getElementsByClassName("tab-pane");
    tabpanel[0].classList.remove("active");
    tabpanel[1].classList.add("active");
    tabpanel[2].classList.remove("active");
    tabpanel[3].classList.remove("active");
    var tabLink = document.getElementById("usertab").getElementsByClassName("nav-link");
    tabLink[0].classList.remove("active");
    tabLink[1].classList.add("active");
    tabLink[2].classList.remove("active");
    tabLink[3].classList.remove("active");
}
if (localStorage.getItem("currentPage") == "freelancer") {
    var tabpanel = document.getElementsByClassName("employee")[0].getElementsByClassName("tab-pane");
    tabpanel[0].classList.remove("active");
    tabpanel[1].classList.remove("active");
    tabpanel[2].classList.add("active");
    tabpanel[3].classList.remove("active");
    var tabLink = document.getElementById("usertab").getElementsByClassName("nav-link");
    tabLink[0].classList.remove("active");
    tabLink[1].classList.remove("active");
    tabLink[2].classList.add("active");
    tabLink[3].classList.remove("active");
}
if (localStorage.getItem("currentPage") == "company") {
    var tabpanel = document.getElementsByClassName("employee")[0].getElementsByClassName("tab-pane");
    tabpanel[0].classList.remove("active");
    tabpanel[1].classList.remove("active");
    tabpanel[2].classList.remove("active");
    tabpanel[3].classList.add("active");
    var tabLink = document.getElementById("usertab").getElementsByClassName("nav-link");
    tabLink[0].classList.remove("active");
    tabLink[1].classList.remove("active");
    tabLink[2].classList.remove("active");
    tabLink[3].classList.add("active");
}

/********************** Start Read **Employee** Data from Firebase Database And Change Happen To Table Data *******************/
(function () {
    const userListUI = document.getElementById("user-list");
    var counter = 0;
    employeesRef.on("child_added", function (snapshot) {
        var attr = $("#EmpEmptyTable").attr("style");
        if (attr === undefined) {
            $("#EmpEmptyTable").attr("style", "display:none");
            $("#EmpEmptyTable td").attr("style", "display:none");
        }
        $("#EmpEmptyTable").attr("style", "display:none");
        $("#EmpEmptyTable td").attr("style", "display: none;");
        let $li = document.createElement("tr");
        let col1 = document.createElement("td");
        let col2 = document.createElement("td");
        let col3 = document.createElement("td");
        let td_delete = document.createElement("td");

        snapshot.forEach(function (element) {
            var key = element.key,
                value = element.val();
            if (key == "userName") {
                col1.append(value);
            }
            if (key == "email") {
                col2.append(value);
            }
            if (key == "type") {
                col3.append(value);
                if (value != "Admin") {
                    td_delete.innerHTML = "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#ConfirmModal' data-employeeid='" + snapshot.key + "' data-keyword='Delete' style='cursor: pointer'>Delete</button>";
                }
            }
        });
        $li.id = snapshot.key;
        $li.append(col1);
        $li.append(col2);
        $li.append(col3);
        $li.append(td_delete);
        userListUI.prepend($li);
        counter++;
        $("#spinnerLoaderEmp").attr("style", "display:none");
    });

    employeesRef.once("value", snap => {
        if (counter == snap.numChildren()) {
            pagination("#custb");
        }
        if (0 == snap.numChildren()) {
            $("#spinnerLoaderEmp").attr("style", "display:none");
            $("#EmpEmptyTable").removeAttr("style");
            $("#EmpEmptyTable td").removeAttr("style");
            $("#EmpEmptyTable td").text("No Employee Created Yet");
        }
    });

    employeesRef.on('child_removed', function (snapshot) {
        var tableRow = document.getElementById(snapshot.key);
        tableRow.remove();
    });

})();
/********************** End Read **Employee** Data from Firebase Database And Change Happen To Table Data *******************/

/********************** Start Read **Customer** Data from Firebase Database And Change Happen To Table Data *******************/
(function () {
    const userListUI = document.getElementById("cus-list");
    var counter = 0;
    cusRef.on("child_added", function (snapshot) {
        var attr = $("#CusEmptyTable").attr("style");
        if (attr === undefined) {
            $("#CusEmptyTable").attr("style", "display:none");
            $("#CusEmptyTable td").attr("style", "display:none");
        }

        var $li = document.createElement("tr"),
            col1 = document.createElement("td"),
            col2 = document.createElement("td"),
            col3 = document.createElement("td"),
            col4 = document.createElement("td"),
            col5 = document.createElement("td"),
            operation = document.createElement("td");
        // let DeleteCustomer = null;
        var deteledRow = false;
        $li.classList.add("inList");
        var dropdown =
            "<button class='btn btn-warning dropdown-toggle' type = 'button' id = 'dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' > Action</button>"
            + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
            + "<a class='dropdown-item' onclick='directwithcustId(\"" + snapshot.key + "\")'  >Details</a>";
        /*************
         * <button class="btn btn-warning" onclick="function()" customer_id="value">Active/deactive</button>
        *************/
        let customerStateButton = document.createElement("button");
        customerStateButton.classList = "btn  btn-warning";
        customerStateButton.setAttribute("customer_id", snapshot.key);
        customerStateButton.setAttribute("onclick", "ChangeCustomerState(event)");
        /******************
         * <button class="btn btn-warning" onclick="function()" customer_id="value">Pre/Free</button>
        ******************/
        let customerTypeButton = document.createElement("button");
        customerTypeButton.classList = "btn  btn-warning";
        customerTypeButton.setAttribute("customerid", snapshot.key);
        customerTypeButton.setAttribute("onclick", "ChangeCustomerType(event)");

        snapshot.forEach(function (element) {
            var key = element.key,
                value = element.val();
            if (key == "activiationState") {
                if (value === true) {
                    col5.append("Active");
                    customerStateButton.textContent = "Deactive";
                    dropdown += "<a class='dropdown-item' onclick='ChangeCustomerState(event)' customer_id='" + snapshot.key + "'>Deactive</a>"

                }
                if (value === false) {
                    col5.append("Deactive");
                    customerStateButton.textContent = "Active";
                    $li.classList.add("deactiveColor");
                    dropdown += "<a class='dropdown-item' onclick='ChangeCustomerState(event)' customer_id='" + snapshot.key + "'>Active</a>";
                }
                if (value === "Deleted") {
                    deteledRow = true;
                    return;
                }
            }
            if (key == "userName") {
                col1.append(value);
            }
            if (key == "userEmail") {
                col2.append(value);
            }
            if (key == "userPhoneNumber") {
                col3.append(value);
            }
            if (key == "userType") {
                if (value === "FREE") {
                    col4.append("FREE");
                    customerTypeButton.textContent = "To premium";
                    dropdown += "<a class='dropdown-item' onclick='ChangeCustomerType(event)' customerid='" + snapshot.key + "'>To premium</a>"
                }
                if (value === "PRE") {
                    customerTypeButton.textContent = "To free";
                    col4.append("PREMIUM");
                    $li.classList.add("preColor");
                    dropdown += "<a class='dropdown-item' onclick='ChangeCustomerType(event)' customerid='" + snapshot.key + "'>To free</a>"
                }
            }
        });
        if (deteledRow == false) {
            operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithcustId(\"" + snapshot.key + "\")' >Details</button>";
            operation.append(customerStateButton);
            operation.append(customerTypeButton);
            if (userType == "Admin") {
                dropdown +=
                    // "<a class='dropdown-item' customerid='" + snapshot.key + "' onclick='deleteCustomer(event)'>Detete</a>"
                    // + 
                    "<a class='dropdown-item' data-toggle='modal' data-target='#sendNotificationModal'"
                    + " data-whatever = '" + snapshot.val().messageToken + "' data-whatever2='" + snapshot.val().phoneNumber
                    + "' data-whatever3 = '" + snapshot.key + "' data-whatever4 = customer "
                    + ">Send Notification</a></div>"
                let customernotifiybutton = document.createElement("button");
                customernotifiybutton.classList = "btn  btn-warning";
                customernotifiybutton.textContent = "Send Notification";
                customernotifiybutton.setAttribute("data-toggle", "modal");
                customernotifiybutton.setAttribute("data-target", "#sendNotificationModal");
                customernotifiybutton.setAttribute("data-whatever", snapshot.val().messageToken);
                customernotifiybutton.setAttribute("data-whatever2", snapshot.val().userPhoneNumber);
                customernotifiybutton.setAttribute("data-whatever3", snapshot.key);
                customernotifiybutton.setAttribute("data-whatever4", "customer");
                /******************
                * <button class="btn btn-warning" onclick="function()" customer_id="value">Delete Customer</button>
                ******************/
                // DeleteCustomer = document.createElement("button");
                // DeleteCustomer.classList = "btn  btn-warning";
                // DeleteCustomer.setAttribute("customerid", snapshot.key);
                // DeleteCustomer.setAttribute("onclick", "deleteCustomer(event)");
                // DeleteCustomer.textContent = "Delete";
                operation.append(customernotifiybutton);
            }
            operation.innerHTML += dropdown;

            // if (DeleteCustomer != null) {
            //     operation.append(DeleteCustomer);
            // }
            $li.append(col1);
            $li.append(col2);
            $li.append(col3);
            $li.append(col4);
            $li.append(col5);
            $li.append(operation);
            $li.id = snapshot.key;
            if (col3.value !== null) {
                userListUI.append($li);
            }
        }
        counter++;
        $("#spinnerLoaderCust").attr("style", "display:none");
    });

    cusRef.once("value", snap => {
        if (counter == snap.numChildren()) {
            pagination("#custb");
        }
        if (0 == snap.numChildren()) {
            $("#spinnerLoaderCust").attr("style", "display:none");
            $("#CusEmptyTable").removeAttr("style");
            $("#CusEmptyTable td").removeAttr("style");
            $("#CusEmptyTable td").text("No Customer Registed Yet");

        }
    });

    cusRef.on('child_changed', function (snapshot) {
        tableRow = document.getElementById(snapshot.key);
        activeButton = tableRow.children[5].children[1];
        typeButton = tableRow.children[5].children[2];
        activeRow = tableRow.children[4];
        typeRow = tableRow.children[3];
        if (snapshot.val().activiationState === true) {
            activeButton.textContent = "Deactive";
            activeRow.textContent = "Active";
            $("a[customer_id='" + snapshot.key + "']").text("Deactive");
            tableRow.classList.remove("deactiveColor");

        } else if (snapshot.val().activiationState === false) {
            activeButton.textContent = "Active";
            activeRow.textContent = "Deactive";
            $("a[customer_id='" + snapshot.key + "']").text("Active");
            tableRow.classList.add("deactiveColor");
        } else {
            tableRow.remove();
        }

        if (snapshot.val().userType === "PRE") {
            typeButton.textContent = "To free";
            $("a[customerid='" + snapshot.key + "']").text("To free");
            typeRow.textContent = "PREMIUM";
            tableRow.classList.add("preColor");
            if (snapshot.val().activiationState === false) {
                tableRow.classList.add("deactiveColor");

            }

        } else if (snapshot.val().userType === "FREE") {
            typeButton.textContent = "To premium";
            $("a[customerid='" + snapshot.key + "']").text("To premium");
            typeRow.textContent = "FREE";
            tableRow.classList.remove("preColor");
            if (snapshot.val().activiationState === false) {
                tableRow.classList.add("deactiveColor");
            }
        }
    });
})();
/********************** End Read **Customer** Data from Firebase Database And Change Happen To Table Data *******************/


/********************** Start Read **Freelancer** Data from Firebase Database And Change Happen To Table Data *******************/
readfreeData();

function readfreeData() {
    const userListUI = document.getElementById("fr-list");
    var counter = 0;
    countFreelancer.textContent = "All subscriped freelancer = " + counter;
    cmRef.on("child_added", snap => {

        if (snap.hasChildren()) {
            var attr = $("#FreeEmptyTable").attr("style");
            if (attr === undefined) {
                $("#FreeEmptyTable").attr("style", "display:none");
                $("#FreeEmptyTable td").attr("style", "display:none");
            }
            counter++;
            createFreelancerRows(snap, userListUI);
            countFreelancer.textContent = "All subscriped freelancer = " + counter;
            $("#spinnerLoaderFree").attr("style", "display:none");
        }
    });

    cmRef.on('child_changed', function (snapshot) {
        var tableRow = document.getElementById(snapshot.key),
            activiationButton = tableRow.children[4].children[1],
            activationRow = tableRow.children[3],
            nameRow = tableRow.children[0],
            emailRow = tableRow.children[1],
            phoneRow = tableRow.children[2];
        nameRow.textContent = snapshot.val().workerNameInEnglish;
        emailRow.textContent = snapshot.val().workerEmail;
        phoneRow.textContent = snapshot.val().workerPhone;
        if (snapshot.val().workerStatusActivation === true) {
            activiationButton.textContent = "Deactive";
            activationRow.textContent = "Active";
            tableRow.classList.remove("deactiveColor");
            $("a[workerId='" + snapshot.key + "']").text("Deactive");

        } else if (snapshot.val().workerStatusActivation === false) {
            activiationButton.textContent = "Active";
            activationRow.textContent = "Deactive";
            tableRow.classList.add("deactiveColor");
            $("a[workerId='" + snapshot.key + "']").text("Active");
        }
    });
    cmRef.once("value", snap => {
        if (counter == snap.numChildren()) {
            pagination("#frtb");
        }
        if (0 == snap.numChildren()) {
            $("#spinnerLoaderFree").attr("style", "display:none");
            $("#FreeEmptyTable").removeAttr("style");
            $("#FreeEmptyTable td").removeAttr("style");
            $("#FreeEmptyTable td").text("No Freelancer Registed Yet");

        }
    });
};
/********************** End Read **Freelancer** Data from Firebase Database And Change Happen To Table Data *******************/


/********************** Start Read **Company** Data from Firebase Database And Change Happen To Table Data *******************/
readCompanyData();

function readCompanyData() {
    const companyListUI = document.getElementById("com-list");
    var counter = 0;
    countFreelancer.textContent = "All subscriped freelancer = " + counter;
    comRef.on("child_added", snap => {
        if (snap.hasChildren()) {
            var attr = $("#ComEmptyTable").attr("style");
            if (attr === undefined) {
                $("#ComEmptyTable").attr("style", "display:none");
                $("#ComEmptyTable td").attr("style", "display:none");
            }
            counter++;
            createCompanyRows(snap, companyListUI);
            // countFreelancer.textContent = "All subscriped Company = " + counter;
            $("#spinnerLoaderCom").attr("style", "display:none");
        }
    });

    comRef.on('child_changed', function (snapshot) {
        var tableRow = document.getElementById(snapshot.key),
            activiationButton = tableRow.children[4].children[1],
            activationRow = tableRow.children[3],
            nameRow = tableRow.children[0],
            emailRow = tableRow.children[1],
            phoneRow = tableRow.children[2];
        nameRow.textContent = snapshot.val().companyNameInEnglish;
        emailRow.textContent = snapshot.val().companyEmail;
        phoneRow.textContent = snapshot.val().companyPhone;
        if (snapshot.val().companyStatusActivation === true) {
            activiationButton.textContent = "Deactive";
            activationRow.textContent = "Active";
            tableRow.classList.remove("deactiveColor");
            $("a[companyid='" + snapshot.key + "']").text("Deactive");

        } else if (snapshot.val().companyStatusActivation === false) {
            activiationButton.textContent = "Active";
            activationRow.textContent = "Deactive";
            tableRow.classList.add("deactiveColor");
            $("a[companyid='" + snapshot.key + "']").text("Active");
        }
    });

    comRef.once("value", snap => {
        if (counter == snap.numChildren()) {
            pagination("#frtb");
        }
        if (0 == snap.numChildren()) {
            $("#spinnerLoaderCom").attr("style", "display:none");
            $("#ComEmptyTable").removeAttr("style");
            $("#ComEmptyTable td").removeAttr("style");
            $("#ComEmptyTable td").text("No Company Registed Yet");

        }
    });
};
/********************** End Read **Freelancer** Data from Firebase Database And Change Happen To Table Data *******************/



/********************************** Start Send Notifcation All Method ******************************** */
/************ Start  check value exists in title & body ***********/
function checkvalueExists(inputId) {
    var input = document.getElementById(inputId),
        errorTitle = document.getElementById("errortitle"),
        errorBody = document.getElementById("errorBody"),
        errorfreetitle = document.getElementById("errorfreetitle"),
        errorfreeBody = document.getElementById("errorfreeBody");
    if (input.value) {
        if (inputId == "title-text") {
            errorTitle.style.display = "none";
        } else if (inputId == "message-text") {
            errorBody.style.display = "none";
        } else if (inputId == "freelancerNotificationTitle") {
            errorfreetitle.style.display = "none";
        } else if (inputId == "freelancerNotificationbody") {
            errorfreeBody.style.display = "none";

        }
    }
}
/************ End check value exists in title & body **************/

/********** Notificaiton check title body are not Empty **************/
function sendNotification(button, title, body, token, type) {
    var errorTitle = document.getElementById("errortitle"),
        errorBody = document.getElementById("errorBody"),
        error = 0;
    if (!title.value) {
        button.removeAttribute("data-dismiss");
        errorTitle.textContent = "* this field can't be empty";
        errorTitle.style.display = "block";
        error = 1;
    }
    if (!body.value) {
        button.removeAttribute("data-dismiss");
        errorBody.textContent = "* this field can't be empty";
        errorBody.style.display = "block";
        error = 1;
    }
    if (error == 0) {
        button.setAttribute("data-dismiss", "modal");
        excuteNotification(title, body, token, type);

    }
}
/********** End Notificaiton check title body are not Empty **************/

/********** Execute send notificatin using Ajax technology **************/
function excuteNotification(title, body, token, page) {
    if (token != null && token != undefined) {
        var to = [];
        to[0] = token;
        $.ajax({
            type: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                Authorization: "key=AIzaSyADxAUAvQtNRFNffkMWmE6geRpo3_DOC0w"
            },
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                "registration_ids": to,
                "notification": {
                    title: title.value,
                    body: body.value,
                    sound: "default"
                }
            }),
            success: function (respone) {

                //var postData = {
                //    message: body.value,
                //    shown: false,
                //    orderId: "",
                //    title: title.value,
                //};

                //if (page == "customer") {
                //    saveNotification("NotificationCustomer", postData);
                //}
                //if (page == "freelancer") {
                //    saveNotification("NotificationFreelancer", postData);
                //}
                body.value = "";
            },
            error: function (error) {
                console.log(error);
                body.value = "";
            }
        });
    }
}
/********** End Execute send notificatin using Ajax technology **************/
/********************************** End Send Notifcation All Method ******************************** */

/********************** Start button of edite FreeLancer&Company Clicked *****************/
function editfr() {
    var editefr = document.getElementById("editefr"),
        namecm = document.getElementById("Nfr"),
        phonecm = document.getElementById("Phfr"),
        categoryfr = document.getElementById("Free-Category"),
        cityfr = document.getElementById("Free-City"),
        Addcm = document.getElementById("Addfr");
        
    if (namecm.value == "") {
        namecm.focus();
        md.showerror('top', 'center');
    }
    else if (phonecm.value == "") {
        phonecm.focus();
        md.showerror('top', 'center');
    }
    else if (Addcm.value == "") {
        Addcm.focus();
        md.showerror('top', 'center');
    }
    else {
            cmRef.child(editefr.getAttribute("user-key")).update({
                "workerPhoto": imgfr.src,
                "workerLocationAdress": Addcm.value,
                "workerPhone": phonecm.value,
                "workerCategoryid": categoryfr.value,
                "workerNameInEnglish": namecm.value,
            }).then(function () {
                cmRef.child(editefr.getAttribute("user-key") +"/workerLocation").update({
                    "cityId" : cityfr.value
                });
            });
    }
}

function editCom() {
    var comName = document.getElementById("comName"),
        comPh = document.getElementById("comPh"),
        comCat = document.getElementById("comCat"),
        comCity = document.getElementById("comCity"),
        AddCom = document.getElementById("AddCom"),
        imgCom = document.getElementById("imgCom"),
        AllCityIds = comCity.getAttribute("cityid").split(" , "),
        countryId = comCity.getAttribute("countryid");
    ComsRef = dbRef.child('Company/' + $("#editecomp").attr("com-key"));
    ComsRef.update({
        "companyLocationAddress": AddCom.value,
        "companyNameInEnglish": comName.value,
        "companyPhone": comPh.value,
        "companyPhoto": imgCom.src,
        "companyAttachment": imgattachcom.getAttribute("value"),
        "companyCategoryId": comCat.getAttribute("catid").split(" , ")
    }).then(function () {
        ComsRef.child("companyLocation").update({
            "cityId": AllCityIds,
            "countryId": countryId
        });
    });
}
/********************** End button of edite FreeLancer&Company Clicked *****************/

/******************* button Add of New Employee Clicked ***************** */
function addUserBtnClicked() {
    if (NewPassword() == 0 & checkMail() == true & checkUserName() == true & checkName() == true & checkPrivilages() == true & ConfirmPassword() == true) {
        var username = document.getElementById("f2"),
            haveusernsme = 0,
            nameError = document.getElementById("errorUserName");
        const databaseRef = firebase.database().ref().child('Employees');
        databaseRef.orderByChild("userName").equalTo(username.value).on("value", snap => {
            snap.forEach(childSnap => {
                let key = childSnap.key,
                    value = childSnap.val()

                if (value.userName == username.value) {
                    haveusernsme = 1;
                }
            });
        });
        if (haveusernsme == 1) {
            nameError.textContent = "* Employee User Name is already Exists";
            nameError.style.display = "block";
        } else {
            nameError.style.display = "none";
            const usersRef = dbRef.child('Employees');
            const addUserInputsUI = document.getElementsByClassName("c-o");
            // this object will hold the new user information
            let newUser = {};
            var v = 1;
            // loop through View to get the data for the model
            for (let i = 0, len = addUserInputsUI.length; i < len; i++) {
                let key = addUserInputsUI[i].getAttribute('data-key');
                let value = addUserInputsUI[i].value;
                if (value == "") { v = 0; break; }
                newUser[key] = value;
                if (i == 0) {

                }
                else {
                    addUserInputsUI[i].value = "";
                }
            }
            if (v == 1) {
                var ee = (usersRef.push(newUser).key);
            }
            if (v == 0) {
                md.showerror('top', 'center');
            }
        }
    }
}
/******************* End button Add of New Employee Clicked ***************** */

//////////////////////////////////////////////////////////////////////* Start Table SEARCH *///////////////////////////////////////////////////////////////////////////////////
function myFunction(value, id, tableColumn) {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    table = document.getElementById(value);
    tr = table.getElementsByTagName("tr");
    // $(".pagination-container").hide();
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[tableColumn];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().startsWith(filter) == true) {
                tr[i].classList.add("inList");
                tr[i].removeAttribute("style");
            } else {
                tr[i].classList.remove("inList");
                tr[i].style.display = "none";
            }
        }
    }
    if (value == "cus-list") {
        if ($("#cus-list  tr[class*='inList']").length === 0) {
            $("#cus-list #CusEmptyTable").removeAttr("style");
            $("#cus-list #CusEmptyTable td").removeAttr("style");
        } else {
            $("#CusEmptyTable").attr("style", "display: none;");
            $("#CusEmptyTable td").attr("style", "display: none;");
        }
        $('#customer .pagination').empty();
        pagination("#custb");
    }

    if (value == "fr-list") {
        $("#fr-list #FreeEmptyTable").attr("style", "display: none;");

        if ($("#fr-list tr[class*='inList'").length === 0) {
            $("#fr-list #FreeEmptyTable").removeAttr("style");
            $("#fr-list #FreeEmptyTable td").removeAttr("style");
        } else {
            $("#fr-list #FreeEmptyTable").attr("style", "display: none;");
            $("#fr-list #FreeEmptyTable td").attr("style", "display: none;");
        }
        $('#freelancer .pagination').empty();
        pagination("#frtb");
    }
}
//////////////////////////////////////////////////////////////////////* End Table SEARCH *///////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////* Start validation *///////////////////////////////////////////////////////////////////////////////
/********************* create new Employee Validation ******************/
function NewPassword() {
    var newpass = document.getElementById("f5").value,
        errorpass = document.getElementById("errorPassword");
    var testing = false;
    if (!newpass) {
        errorpass.style.display = "block";
        errorpass.textContent = "* This field can't be empty";
        testing = true;
    }
    else if (validatePassword(newpass) == false) {
        errorpass.style.display = "block";
        errorpass.textContent = "* Invalid Password,minimum length:8, include number and upper ,lower case character";
        testing = true;

    } else {
        errorpass.style.display = "none";
        testing = false;
    }

    if (testing == true) {
        return 1;
    } else {
        return 0;
    }
}

function ConfirmPassword() {
    var newpass = document.getElementById("f5").value,
        confirmpass = document.getElementById("f6").value,
        errorpassconfirm = document.getElementById("errorPasswordConfirm"),
        testValue = null;
    if (!confirmpass) {
        errorpassconfirm.textContent = "* This field can't be empty";
        errorpassconfirm.style.display = "block";

        testValue = 1;
    } else if (newpass !== confirmpass && !newpass) {
        errorpassconfirm.textContent = "* No Password To Match";
        errorpassconfirm.style.display = "block";

        testValue = 1;
    }
    else if (newpass !== confirmpass) {
        errorpassconfirm.textContent = "* Password Don't Match";
        errorpassconfirm.style.display = "block";

        testValue = 1;
    } else {
        errorpassconfirm.style.display = "none";

    }

    if (testValue == 1) {
        return false;
    } else {
        return true;
    }
}

function checkMail() {
    var email = document.getElementById("f3").value,
        errorEmail = document.getElementById("errorEmail"),
        testValue = null;
    if (!email) {
        errorEmail.textContent = "* This field can't be empty";
        errorEmail.style.display = "block";
        testValue = 1;
    }
    else if (validateEmail(email) == false) {
        errorEmail.textContent = "* Email not Valid";
        errorEmail.style.display = "block";
        testValue = 1;
    } else {
        errorEmail.style.display = "none";
    }
    if (testValue == 1) {
        return false;
    } else {
        return true;
    }
}

function checkUserName() {
    var nameValue = document.getElementById("f2").value,
        nameError = document.getElementById("errorUserName"),
        testValue = null;
    if (!nameValue) {
        nameError.textContent = "* This field can't be empty";
        nameError.style.display = "block";
        testValue = 1;
    } else if (nameValue.match(" ") != null) {
        nameError.textContent = "* User Name can't contain space"
        nameError.style.display = "block";
        testValue = 1;
    } else if (nameValue.trim().length < 6) {
        nameError.textContent = "* User Name can't be less than 6 character"
        nameError.style.display = "block";
        testValue = 1;
    } else if (nameValue.trim().length > 10) {
        nameError.textContent = "* User Name can't be greater than 10 character"
        nameError.style.display = "block";
        testValue = 1;
    } else {
        nameError.style.display = "none";
    }

    if (testValue == 1) {
        return false;
    } else {
        return true;
    }
}

function checkName() {
    var nameValue = document.getElementById("f4").value,
        nameError = document.getElementById("errorName"),
        testValue = null;

    if (!nameValue) {
        nameError.textContent = "* This field can't be empty";
        nameError.style.display = "block";
        testValue = 1;
    } else if (nameValue.trim().length < 5) {
        nameError.textContent = "* Name can't be less than 5 character"
        nameError.style.display = "block";
        testValue = 1;
    } else {
        nameError.style.display = "none";
    }
    if (testValue == 1) {
        return false;
    } else {
        return true;
    }
}

function checkPrivilages() {
    var PrivilagesValue = document.getElementById("EmployeePrivilages").value,
        errorPrivalages = document.getElementById("errorPrivalages"),
        testValue = null;
    if (PrivilagesValue === "Select Employee Privilages") {
        errorPrivalages.textContent = "* Must Select Employee Privilages";
        errorPrivalages.style.display = "block";
        testValue = 1;
    } else {
        errorPrivalages.style.display = "none";
    }

    if (testValue == 1) {
        return false;
    } else {
        return true;
    }
}

function validatePassword(password) {
    var passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passReg.test(String(password));
}

function validateEmail(email) {
    var regMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regMail.test(String(email).toLowerCase());
}
/********************* End create new Employee Validation ******************/
//////////////////////////////////////////////////////////////////////* End validation *///////////////////////////////////////////////////////////////////////////////


/******************* Start Freelancer Filteration *************************************/
function SelectFreeToFilter() {
    var selectingSendToFreeValue = selectingSendToFree.value;
    if (!selectingSendToFreeValue) {

    } else {
        if (selectingSendToFreeValue == "all") {
            const userListUI = document.getElementById("fr-list");
            userListUI.innerHTML = "";
            DCity[0].style.display = "none";
            DCountry[0].style.display = "none";
            DCategory[0].style.display = "none";
            readfreeData();
        }

        if (selectingSendToFreeValue == "country" || selectingSendToFreeValue == "city" || selectingSendToFreeValue == "cityWcategory") {
            DCity[0].style.display = "none";
            DCategory[0].style.display = "none";
            DCountry[0].style.display = "inline-block";
            var freeCountryNotify = document.getElementById("freeCountryNotify");
            freeCountryNotify.innerHTML = ""
            var option = document.createElement("option");
            option.setAttribute("selected", "on");
            option.setAttribute("disabled", "on");
            option.text = "select Country Name";
            freeCountryNotify.append(option);

            countersRef.on("child_added", function (snapshot) {
                var option = document.createElement("option");
                option.value = snapshot.key;
                option.append(snapshot.val().countryName);
                freeCountryNotify.append(option);
            });
        }

        if (selectingSendToFreeValue == "category") {
            DCity[0].style.display = "none";
            DCountry[0].style.display = "none";
            DCategory[0].style.display = "inline-block";
            var freeCategoryNotify = document.getElementById("freeCategoryNotify");
            freeCategoryNotify.innerHTML = "";
            var option = document.createElement("option");
            option.setAttribute("selected", "on");
            option.setAttribute("disabled", "on");
            option.text = "select Category";
            freeCategoryNotify.append(option);
            catRef.on("child_added", function (snapshot) {
                var option = document.createElement("option");
                option.value = snapshot.key;
                option.setAttribute("name", snapshot.val().categoryName);
                option.append(snapshot.val().categoryName);
                freeCategoryNotify.append(option);
            });
        }
    }
}

function filterDependCountry(e) {
    const selectingSendToFreeValue = document.getElementById("selectingSendToFree").value;
    var freeCountryNotify = document.getElementById("freeCountryNotify");
    if (selectingSendToFreeValue == "country") {
        const userListUI = document.getElementById("fr-list");
        userListUI.innerHTML = "",
            countryName = null;
        var counter = 0;
        cmRef.on("child_added", function (snapshot) {
            if (freeCountryNotify.value == snapshot.val().workerLocation.countryId) {
                counter++;
                createFreelancerRows(snapshot, userListUI);
                countryName = snapshot.val().workerLocation.country;
            }
            $('#freelancer .pagination').empty();
            pagination("#frtb");
            countFreelancer.textContent = "All subscriped Freelancer in ( " + countryName + " ) = " + counter;
        });
        cmRef.once("value", snap => {
            if (0 == counter) {
                $("#spinnerLoaderFree").attr("style", "display:none");
                $("#FreeEmptyTable").removeAttr("style");
                $("#FreeEmptyTable td").removeAttr("style");
                $("#FreeEmptyTable td").text("No Freelancer Registed Yet wihn this country");
            }
        });

    }

    if (selectingSendToFreeValue == "city" || selectingSendToFreeValue == "cityWcategory") {
        DCity[0].style.display = "inline-block";
        var freeCityNotify = document.getElementById("freeCityNotify");
        freeCityNotify.innerHTML = "";
        var option = document.createElement("option");
        option.setAttribute("selected", "on");
        option.setAttribute("disabled", "on");
        option.text = "select City Name";
        freeCityNotify.append(option);
        citysRef.child(freeCountryNotify.value).on("child_added", function (snapshot) {
            var option = document.createElement("option");
            option.value = snapshot.key;
            option.append(snapshot.val().cityName);
            freeCityNotify.append(option);
        });
    }
}

function sendDependCity() {
    const selectingSendToFreeValue = document.getElementById("selectingSendToFree").value;
    var counter = 0;
    if (selectingSendToFreeValue == "city") {
        var freeCityNotify = document.getElementById("freeCityNotify"),
            freeCityValue = freeCityNotify.value,
            userListUI = userListUI = document.getElementById("fr-list"),
            cityName = null;
        userListUI.innerHTML = "<tr id='FreeEmptyTable' style='display: none;'><td colspan='6'>No Freelancer with This Phone Number</td></tr>";
        cmRef.on("child_added", function (snapshot) {
            $('#freelancer .pagination').empty();
            if (snapshot.val().workerLocation.cityId != undefined && freeCityValue == snapshot.val().workerLocation.cityId) {
                counter++;
                createFreelancerRows(snapshot, userListUI);
                cityName = snapshot.val().workerLocation.city;
                pagination("#frtb");
            }
            countFreelancer.textContent = "All subscriped Freelancer Within " + cityName + " city  =" + counter;
        });
        cmRef.once("value", snap => {
            if (0 == counter) {
                $("#spinnerLoaderFree").attr("style", "display:none");
                $("#FreeEmptyTable").removeAttr("style");
                $("#FreeEmptyTable td").removeAttr("style");
                $("#FreeEmptyTable td").text("No Freelancer Registed Yet wihn this City");
            }
        });
    }
    if (selectingSendToFreeValue == "cityWcategory") {
        DCategory[0].style.display = "inline-block";
        var freeCategoryNotify = document.getElementById("freeCategoryNotify");
        freeCategoryNotify.innerHTML = "";
        var option = document.createElement("option");
        option.setAttribute("selected", "on");
        option.setAttribute("disabled", "on");
        option.text = "select Category";
        freeCategoryNotify.append(option);
        catRef.on("child_added", function (snapshot) {
            var option = document.createElement("option");
            option.value = snapshot.key;
            option.setAttribute("name", snapshot.val().categoryName);
            option.append(snapshot.val().categoryName);
            freeCategoryNotify.append(option);
        });
    }
}

function sendDependCategory() {
    const selectingSendToFreeValue = document.getElementById("selectingSendToFree").value;
    var freeCategoryNotify = document.getElementById("freeCategoryNotify"),
        freeCategoryValue = freeCategoryNotify.value,
        userListUI = document.getElementById("fr-list"),
        counter = 0;
    userListUI.innerHTML = "<tr id='FreeEmptyTable' style='display: none;'><td colspan='6'>No Freelancer with This Phone Number</td></tr>";
    if (selectingSendToFreeValue == "cityWcategory") {
        var freeCityNotify = document.getElementById("freeCityNotify"),
            freeCityValue = freeCityNotify.value,
            cityName = null;
        cmRef.on("child_added", function (snapshot) {
            $('#freelancer .pagination').empty();
            if (freeCategoryValue == snapshot.val().workerCategoryid && freeCityValue == snapshot.val().workerLocation.cityId) {
                counter++;
                createFreelancerRows(snapshot, userListUI);
                cityName = snapshot.val().workerLocation.city;
                pagination("#frtb");
            }
        });
        countFreelancer.innerHTML = "All subscriped Freelancer Within city ( " + cityName + " ) and category ( <bdi>" +
            freeCategoryNotify.selectedOptions[0].getAttribute("name") + "</bdi> ) = <span id='freeCounter'>" + counter + "</span>";
        cmRef.once("value", snap => {
            if (0 == counter) {
                $("#spinnerLoaderFree").attr("style", "display:none");
                $("#FreeEmptyTable").removeAttr("style");
                $("#FreeEmptyTable td").removeAttr("style");
                $("#FreeEmptyTable td").text("No Freelancer Registed Yet within this City and with this Category");
            }
        });
    }
    if (selectingSendToFreeValue == "category") {
        cmRef.on("child_added", function (snapshot) {
            $('#freelancer .pagination').empty();
            if (freeCategoryValue == snapshot.val().workerCategoryid) {
                counter++;
                createFreelancerRows(snapshot, userListUI);
                pagination("#frtb");
            }
        });
        countFreelancer.innerHTML = "All subscriped Freelancer Within category ( <bdi>" +
            freeCategoryNotify.selectedOptions[0].getAttribute("name") + "</bdi> ) = <span id='freeCounter'>" + counter + "</span>";
        cmRef.once("value", snap => {
            if (0 == counter) {
                $("#FreeEmptyTable").removeAttr("style");
                $("#FreeEmptyTable td").removeAttr("style");
                $("#FreeEmptyTable td").text("No Freelancer Registed Yet with is Category");
            }
        });
    }
}
/******************* End Freelancer Filteration *************************************/

/*********************************** Start All Helped Function ***************************************/
function createFreelancerRows(snap, userListUI) {
    let $li = document.createElement("tr"),
        col1 = document.createElement("td"),
        col2 = document.createElement("td"),
        col3 = document.createElement("td"),
        col4 = document.createElement("td"),
        operation = document.createElement("td");
    // let DeleteFreelancer = null;
    $li.classList.add("inList");
    var dropdown =
        "<button class='btn btn-warning dropdown-toggle' type = 'button' id = 'dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' > Action</button>"
        + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
        + "<a class='dropdown-item' onclick='directwithfreeId(\"" + snap.key + "\")'  >Details</a>"
        + "<a class='dropdown-item' data-toggle='modal' data-target='#editFreelancer'" + " data-freeid = '" + snap.key + "'>Edit</a>";
    let activeButton = document.createElement("button");
    activeButton.classList = "btn  btn-warning";
    activeButton.setAttribute("workerId", snap.key);
    activeButton.setAttribute("onclick", "ChangeFreelancerState(event)");
    //<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editFreelancer">Edit</button>
    let EditFreeButton = document.createElement("button");
    EditFreeButton.classList = "btn  btn-warning";
    EditFreeButton.textContent = "Edit";
    EditFreeButton.setAttribute("data-toggle", "modal");
    EditFreeButton.setAttribute("data-target", "#editFreelancer");
    EditFreeButton.setAttribute("data-freeid", snap.key);
    snap.forEach(function (element) {
        var key = element.key,
            value = element.val();
        if (key == "workerNameInEnglish") {
            col1.append(value);
        }
        if (key == "workerEmail") {
            col2.append(value);
        }
        if (key == "workerPhone") {
            col3.append(value);
        }
        if (key == "workerStatusActivation") {

            if (value === true) {
                col4.append("Active");
                activeButton.textContent = "Deactive";
                dropdown += "<a class='dropdown-item' onclick='ChangeFreelancerState(event)' workerId='" + snap.key + "'>Deactive</a>"
            } else {
                col4.append("Deactive");
                $li.classList.add("deactiveColor");
                activeButton.textContent = "Active";
                dropdown += "<a class='dropdown-item' onclick='ChangeFreelancerState(event)' workerId='" + snap.key + "'>Active</a>"

            }
        }
    });
    operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithfreeId(\"" + snap.key + "\")' >show</button>";
    operation.append(activeButton);
    operation.append(EditFreeButton);
    if (userType == "Admin") {
        dropdown +=
            // "<a class='dropdown-item' freelancerid='" + snap.key + "' onclick='DeleteFreelncer(event)'>Detete</a>"
            // + 
            "<a class='dropdown-item' data-toggle='modal' data-target='#sendNotificationModal'"
            + " data-whatever = '" + snap.val().messageToken + "' data-whatever2='" + snap.val().workerPhone
            + "' data-whatever3 = '" + snap.key + "' data-whatever4 = freelancer "
            + ">Send Notification</a></div>";
        let freenotifiybutton = document.createElement("button");
        freenotifiybutton.classList = "btn  btn-warning";
        freenotifiybutton.textContent = "Send Notification";
        freenotifiybutton.setAttribute("data-toggle", "modal");
        freenotifiybutton.setAttribute("data-target", "#sendNotificationModal");
        freenotifiybutton.setAttribute("data-whatever", snap.val().messageToken);
        freenotifiybutton.setAttribute("data-whatever2", snap.val().workerPhone);
        freenotifiybutton.setAttribute("data-whatever3", snap.key);
        freenotifiybutton.setAttribute("data-whatever4", "freelancer");

        // DeleteFreelancer = document.createElement("button");
        // DeleteFreelancer.classList = "btn  btn-warning";
        // DeleteFreelancer.setAttribute("customerid", snap.key);
        // DeleteFreelancer.setAttribute("onclick", "DeleteFreelncer(event)");
        // DeleteFreelancer.textContent = "Delete";
        operation.append(freenotifiybutton);
    }
    operation.innerHTML += dropdown;

    // if (DeleteFreelancer != null) {
    //     operation.append(DeleteFreelancer);
    // }

    $li.id = snap.key;
    $li.append(col1);
    $li.append(col2);
    $li.append(col3);
    $li.append(col4);
    $li.append(operation);
    userListUI.append($li);
}

function createCompanyRows(snap, companyListUI) {
    let $li = document.createElement("tr"),
        col1 = document.createElement("td"),
        col2 = document.createElement("td"),
        col3 = document.createElement("td"),
        col4 = document.createElement("td"),
        operation = document.createElement("td");
    let DeleteFreelancer = null;
    var dropdown =
        "<button class='btn btn-warning dropdown-toggle' type = 'button' id = 'dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' > Action</button>"
        + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
        + "<a class='dropdown-item' onclick='directwithCompanyId(\"" + snap.key + "\")'  >Details</a>"
        + "<a class='dropdown-item' data-toggle='modal' data-target='#editCompany'" + " data-companyid = '" + snap.key + "'>Edit</a>";
    let activeButton = document.createElement("button");
    activeButton.classList = "btn  btn-warning";
    activeButton.setAttribute("companyId", snap.key);
    activeButton.setAttribute("onclick", "ChangeCompanyState(event)");
    //<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editFreelancer">Edit</button>
    let EditCompanyButton = document.createElement("button");
    EditCompanyButton.classList = "btn  btn-warning";
    EditCompanyButton.textContent = "Edit";
    EditCompanyButton.setAttribute("data-toggle", "modal");
    EditCompanyButton.setAttribute("data-target", "#editCompany");
    EditCompanyButton.setAttribute("data-companyid", snap.key);
    snap.forEach(function (element) {
        var key = element.key,
            value = element.val();
        if (key == "companyNameInEnglish") {
            col1.append(value);
        }
        if (key == "companyEmail") {
            col2.append(value);
        }
        if (key == "companyPhone") {
            col3.append(value);
        }
        if (key == "companyStatusActivation") {

            if (value === true) {
                col4.append("Active");
                activeButton.textContent = "Deactive";
                dropdown += "<a class='dropdown-item' onclick='ChangeCompanyState(event)' companyId='" + snap.key + "'>Deactive</a>"
            } else {
                col4.append("Deactive");
                $li.classList.add("deactiveColor");
                activeButton.textContent = "Active";
                dropdown += "<a class='dropdown-item' onclick='ChangeCompanyState(event)' companyId='" + snap.key + "'>Active</a>"
            }
        }
    });
    operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithCompanyId(\"" + snap.key + "\")' >show</button>";
    operation.append(activeButton);
    operation.append(EditCompanyButton);
    /******************
* <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="token message">Open modal for @mdo</button>
    ******************/

    if (userType == "Admin") {
        dropdown +=
            "<a class='dropdown-item' freelancerid='" + snap.key + "' onclick='DeleteFreelncer(event)'>Detete</a>"
            + "<a class='dropdown-item' data-toggle='modal' data-target='#sendNotificationModal'"
            + " data-whatever = '" + snap.val().messageToken + "' data-whatever2='" + snap.val().companyPhone
            + "' data-whatever3 = '" + snap.key + "' data-whatever4 = freelancer "
            + ">Send Notification</a></div>";
        let companyNotifiybutton = document.createElement("button");
        companyNotifiybutton.classList = "btn  btn-warning";
        companyNotifiybutton.textContent = "Send Notification";
        companyNotifiybutton.setAttribute("data-toggle", "modal");
        companyNotifiybutton.setAttribute("data-target", "#sendNotificationModal");
        companyNotifiybutton.setAttribute("data-whatever", snap.val().messageToken);
        companyNotifiybutton.setAttribute("data-whatever2", snap.val().companyPhone);
        companyNotifiybutton.setAttribute("data-whatever3", snap.key);
        companyNotifiybutton.setAttribute("data-whatever4", "freelancer");

        // DeleteFreelancer = document.createElement("button");
        // DeleteFreelancer.classList = "btn  btn-warning";
        // DeleteFreelancer.setAttribute("customerid", snap.key);
        // DeleteFreelancer.setAttribute("onclick", "DeleteFreelncer(event)");
        // DeleteFreelancer.textContent = "Delete";
        operation.append(companyNotifiybutton);
    }
    operation.innerHTML += dropdown;

    if (DeleteFreelancer != null) {
        operation.append(DeleteFreelancer);
    }

    $li.id = snap.key;
    $li.append(col1);
    $li.append(col2);
    $li.append(col3);
    $li.append(col4);
    $li.append(operation);
    companyListUI.append($li);
}

function directwithcustId(customerId) {
    localStorage.setItem("customerId", customerId);
    location.href = "customerDetails.html";
}

function directwithfreeId(freelancerId) {
    localStorage.setItem("freelancerId", freelancerId);
    location.href = "freelancerDetails.html";
}

function directwithCompanyId(companyId) {
    localStorage.setItem("companyId", companyId);
    location.href = "companyDetails.html";
}

/*********************************** End All Helped Function *****************************************/


/************************** start save Notification ******************************/
function saveNotification(notTable, postData) {
    firebase.database().ref(notTable + "/" + id).push().set(
        postData
    );
}
function ChangeCustomerState(e) {
    const freeRef = dbRef.child('Users/' + e.path[0].getAttribute("customer_id"));
    if (e.path[0].textContent === "Active") {

        freeRef.update({
            "activiationState": true,
            "messageToken": null,
            "login": false
        });
    } else if (e.path[0].textContent === "Deactive") {
        freeRef.update({
            "activiationState": false,
            "messageToken": null,
            "login": false
        });
    }
}
function ChangeCustomerType(e) {
    const freeRef = dbRef.child('Users/' + e.path[0].getAttribute("customerid"));
    if (e.path[0].textContent === "To premium") {
        freeRef.update({
            "userType": "PRE"
        });
    } else if (e.path[0].textContent === "To free") {
        freeRef.update({
            "userType": "FREE"
        });
    }
};
function ChangeFreelancerState(e) {
    const freeRef = dbRef.child('Workers/' + e.path[0].getAttribute("workerId"));
    if (e.path[0].textContent === "Active") {
        freeRef.update({
            "workerStatusActivation": true
        });
    } else if (e.path[0].textContent === "Deactive") {
        freeRef.update({
            "workerStatusActivation": false
        });
    }
}
function ChangeCompanyState(e) {
    const comRef = dbRef.child('Company/' + e.path[0].getAttribute("companyid"));
    if (e.path[0].textContent === "Active") {
        comRef.update({
            "companyStatusActivation": true
        });
    } else if (e.path[0].textContent === "Deactive") {
        comRef.update({
            "companyStatusActivation": false
        });
    }
}
/************************** End save Notification ******************************/

/***************************** Confirmation Dialog Retrive Data and do Some Action ********************/
$('#sendNotificationModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var token = button.data('whatever'); // Extract info from data-* attributes
    var ID = button.data('whatever3'); // Extract info from data-* attributes
    var phoneNumber = button.data('whatever2'); // Extract info from data-* attributes
    var type = button.data('whatever4'); // Extract info from data-* attributes

    var modal = $(this);
    modal.find('.modal-title').text('Send Notification To ' + phoneNumber);
    var NotificationTitle = document.getElementById("title-text"),
        NotificationBody = document.getElementById("message-text");
    document.getElementById("btnSend").onclick = function () {
        id = ID;
        //saveHistory(null, null, null,NotificationTitle.value, NotificationBody.value, ID, type);
        sendNotification(this, NotificationTitle, NotificationBody, token, type);
    }
});

$('#ConfirmModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var employeeId = button.data('employeeid'); // Extract info from data-* attributes
    var keyword = button.data('keyword'); // Extract info from data-* attributes
    if (keyword == "Delete") {
        document.getElementById("ConfirmQuestion").textContent = "Are You Sure You Want To Delete This Employee !?"
        $(this).find("#btnConfirmDialog").click(function () {
            const userRef = dbRef.child('Employees/' + employeeId);
            userRef.remove();
            //.then(function () {
            //    this.setAttribute("data-dismiss", "modal");
            //});
        });
    }
});

$('#editFreelancer').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var freeid = button.data('freeid') // Extract info from data-* attributes
    var modal = $(this)
    modal.find('#editefr').attr('user-key', freeid);
    var namefr = document.getElementById("Nfr"),
        phonefr = document.getElementById("Phfr"),
        categoryfr = document.getElementById("Free-Category"),
        cityfr = document.getElementById("Free-City"),
        Addfr = document.getElementById("Addfr"),
        imgufr = document.getElementById("imgpfr");
    cmRef.child(freeid).on("value", snapChild => {
        namefr.value = snapChild.val().workerNameInEnglish;
        phonefr.value = snapChild.val().workerPhone;
        imgfr.src = snapChild.val().workerPhoto;
        imgufr.value = snapChild.val().workerPhoto;
        catRef.on("value", CatChild => {
            CatChild.forEach(catChildChild => {
                var select = document.createElement("option");
                select.value = catChildChild.key;
                select.textContent = catChildChild.val().categoryName;
                if (snapChild.val().workerCategoryid == catChildChild.key) {
                    select.setAttribute("selected", "on");
                }
                categoryfr.append(select);
            });
        });
        citysRef.child(snapChild.val().workerLocation.countryId).on("value",citySnapShot =>{
            citySnapShot.forEach(CityChildSnapShot =>{
                var select = document.createElement("option");
                select.value = CityChildSnapShot.key;
                select.textContent = CityChildSnapShot.val().cityName;
                if(snapChild.val().workerLocation.cityId == CityChildSnapShot.key){
                    select.setAttribute("selected","on");
                }
                cityfr.append(select);
            });
        })
        Addfr.value = snapChild.val().workerLocationAdress;
    });
});
$('#editCompany').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var companyid = button.data('companyid');
    var modal = $(this)
    modal.find('#editecomp').attr('Com-key', companyid);
    var comName = document.getElementById("comName"),
        comPh = document.getElementById("comPh"),
        comCat = document.getElementById("comCat"),
        comCity = document.getElementById("comCity"),
        AddCom = document.getElementById("AddCom"),
        imgCom = document.getElementById("imgCom");


    comRef.child(companyid).on("value", snapChild => {
        comName.value = snapChild.val().companyNameInEnglish;
        comPh.value = snapChild.val().companyPhone;
        imgfr.src = snapChild.val().companyPhoto;
        imgCom.value = snapChild.val().companyPhoto;
        var value = 0,
            value1 = 0,
            cat = "",
            city = "";
        for (var counter = 0; counter < snapChild.val().companyCategoryId.length; counter++) {
            catRef.child(snapChild.val().companyCategoryId[counter]).once("value", snap => {
                comCat.value += snap.val().categoryName + " , ";
                cat += snap.key + " , ";
            }).then(function () {
                value++;
                if (value == snapChild.val().companyCategoryId.length) {
                    comCat.value = comCat.value.substring(0, comCat.value.length - 3);
                    cat = cat.substring(0, cat.length - 3);
                    comCat.setAttribute("catId", cat);
                }
            });
        }

        for (var counter = 0; counter < snapChild.val().companyLocation.cityId.length; counter++) {
            citysRef.child(snapChild.val().companyLocation.countryId + "/" + snapChild.val().companyLocation.cityId[counter]).once("value", snap => {
                comCity.value += snap.val().cityName + " , ";
                city += snap.key + " , ";
            }).then(function () {
                value1++;
                if (value1 == snapChild.val().companyLocation.cityId.length) {
                    comCity.value = comCity.value.substring(0, comCity.value.length - 3);
                    city = city.substring(0, city.length - 3);
                    comCity.setAttribute("cityId", city);
                    comCity.setAttribute("countryId", snapChild.val().companyLocation.countryId);
                }
            });
        }

        AddCom.value = snapChild.val().companyLocationAddress;

        if (!snapChild.val().companyPhoto) {
            imgCom.src = "../img/logo.jpg";
        } else {
            imgCom.src = snapChild.val().companyPhoto;
        }
        if (!snapChild.val().companyAttachment) {
            imgattachcom.setAttribute("value","");
        } else {
            imgattachcom.setAttribute("value",snapChild.val().companyAttachment);
        }
    });
});
$('#editCompany').on('hide.bs.modal', function (event) {
    var comName = document.getElementById("comName"),
        comPh = document.getElementById("comPh"),
        comCat = document.getElementById("comCat"),
        comCity = document.getElementById("comCity"),
        AddCom = document.getElementById("AddCom"),
        imgCom = document.getElementById("imgCom");
    comName.value = "";
    comPh.value = "";
    imgfr.src = "";
    imgCom.value = "";
    AddCom.value = "";
    comCat.value = "";
    comCat.removeAttribute("catId");
    comCity.value = "";
    comCity.removeAttribute("cityId");
    comCity.removeAttribute("countryId");
});
function selectMutliCat(e) {
    $("#titleCatCit").text("Select All Category that Company Support");
    $("#editeCatCit").text("Add Categories");
    $("#editCatCit").modal("show");
}

function selectMutliCity(e) {
    $("#titleCatCit").text("Select All City that Company Support");
    $("#editeCatCit").text("Add Cities");
    $("#editCatCit").modal("show");
}



$('#editCatCit').on('show.bs.modal', function (event) {
    var detectShowValues = $("#editeCatCit").text();
    if (detectShowValues == "Add Categories") {
        var priviousSelectedCat = $("#comCat").attr("catId").split(",");
        catRef.once("value", snapshot => {
            snapshot.forEach(snapChild => {
                $("#AllCatCity").prepend("<input class='checkbox' type='checkbox' value='" + snapChild.val().categoryName + "' id='" + snapChild.key + "'/><label >" + snapChild.val().categoryName + "</label> </br>");
                $("#AllCatCity .checkbox").change(function () {
                    if (this.checked) {
                        this.setAttribute("checked", "checked");
                    } else {
                        this.removeAttribute("checked");
                    }
                });
            });
            priviousSelectedCat.forEach(value => {
                $("#" + value.trim()).attr("checked", "checked");
            });
        });
    }
    if (detectShowValues == "Add Cities") {
        var priviousSelectedCity = $("#comCity").attr("cityId").split(",");
        citysRef.child(document.getElementById("comCity").getAttribute("countryId")).once("value", snapshot => {
            snapshot.forEach(snapChild => {
                $("#AllCatCity").prepend("<input class='checkbox' type='checkbox' value='" + snapChild.val().cityName + "' id='" + snapChild.key + "'/><label >" + snapChild.val().cityName + "</label> </br>");
                $("#AllCatCity .checkbox").change(function () {
                    if (this.checked) {
                        this.setAttribute("checked", "checked");
                    } else {
                        this.removeAttribute("checked");
                    }
                });
            });
            priviousSelectedCity.forEach(value => {
                $("#" + value.trim()).attr("checked", "checked");
            });
        });
    }
});
function addCatCity(e) {
    if (e.target.textContent == "Add Categories") {
        var AllInputValue = "", AllInputId = "";
        $("#AllCatCity .checkbox").each(value => {
            if ($("#AllCatCity .checkbox")[value].getAttribute("checked") == "checked") {
                AllInputId += $("#AllCatCity .checkbox")[value].getAttribute("id") + " , ";
                AllInputValue += $("#AllCatCity .checkbox")[value].getAttribute("value") + " , ";
            }
        });
        AllInputValue = AllInputValue.substring(0, AllInputValue.lastIndexOf(",") - 1);
        AllInputId = AllInputId.substring(0, AllInputId.lastIndexOf(",") - 1);

        $("#comCat").attr("catId", AllInputId);
        $("#comCat").val(AllInputValue);
    }
    if (e.target.textContent == "Add Cities") {
        var AllInputValue = "", AllInputId = "";
        $("#AllCatCity .checkbox").each(value => {
            if ($("#AllCatCity .checkbox")[value].getAttribute("checked") == "checked") {
                AllInputId += $("#AllCatCity .checkbox")[value].getAttribute("id") + " , ";
                AllInputValue += $("#AllCatCity .checkbox")[value].getAttribute("value") + " , ";
            }
        });
        AllInputValue = AllInputValue.substring(0, AllInputValue.lastIndexOf(",") - 1);
        AllInputId = AllInputId.substring(0, AllInputId.lastIndexOf(",") - 1);

        $("#comCity").attr("cityId", AllInputId);
        $("#comCity").val(AllInputValue);
    }
}

$('#editCatCit').on('hide.bs.modal', function (event) {
    $("#AllCatCity").empty();
});

var fileButtonfr = document.getElementById('File1fr');
var imgfr = document.getElementById('imgfr');
fileButtonfr.addEventListener('change', function (e) {
    $("#editFreelancer img").hide();
    $("#editFreelancer  #spinner-border-edit").show();
    $("#editefr").attr("disabled", "disabled");
    var file = e.target.files[0];
    imgfr.src = "";
    var storageRef = firebase.storage().ref('img/' + file.name);
    var task = storageRef.put(file).then((snapshot) => {
        // added this part which as grabbed the download url from the pushed snapshot
        var jj = snapshot.downloadURL;
        imgfr.src = jj;
        $("#editFreelancer img").show();
        $("#editFreelancer  #spinner-border-edit").hide();
        $("#editefr").removeAttr("disabled");
    });
    //var gg = firebase.storage().ref('img/' + file.name).fullPath();
});

var AttachButtonCom = document.getElementById('File2Attach');
var imgattachcom = document.getElementById('imgattachcom');
AttachButtonCom.addEventListener('change', function (e) {
    $("#editCompany  #spinner-border-edit").show();
    $("#editecomp").attr("disabled", "disabled");
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref('img/' + file.name);
    var task = storageRef.put(file).then((snapshot) => {
        // added this part which as grabbed the download url from the pushed snapshot
        var jj = snapshot.downloadURL;
        imgattachcom.setAttribute("value",jj);
        $("#editCompany  #spinner-border-edit").hide();
        $("#editecomp").removeAttr("disabled");
    });
});

var fileButtonCom = document.getElementById('File1Com');
var imgCom = document.getElementById('imgCom');
fileButtonfr.addEventListener('change', function (e) {
    $("#editCompany img").hide();
    $("#editCompany  #spinner-border-edit").show();
    $("#editecomp").attr("disabled", "disabled");
    var file = e.target.files[0];
    imgCom.src = "";
    var storageRef = firebase.storage().ref('img/' + file.name);
    var task = storageRef.put(file).then((snapshot) => {
        // added this part which as grabbed the download url from the pushed snapshot
        var jj = snapshot.downloadURL;
        imgCom.src = jj;
        $("#editCompany img").show();
        $("#editCompany  #spinner-border-edit").hide();
        $("#editecomp").removeAttr("disabled");
    });
});
/***************************** End Confirmation Dialog Retrive Data and do Some Action ********************/
function imageBrowserFreelancer() {
    var imageBrowserFreelancer = document.getElementById("File1fr");
    imageBrowserFreelancer.click();
}
function imageBrowserCompanyAttachment() {
    var imageBrowserCompanyAttachment = document.getElementById("File2Attach");
    imageBrowserCompanyAttachment.click();
}

// function deleteCustomer(e) {
//     var customerId = e.target.getAttribute("customerid");
//     // Delete All customer notification 
//     NotificationCustomer.child(customerId).remove();
//     //move All Related Request to Deteted Requests Database
//     requestRef.orderByChild("customerId").equalTo(customerId).on("child_added", function (snapshot) {
//         DeteledrequestRef.child(snapshot.key).set(snapshot.val()).then(function () {
//             // Remove All Related Request
//             requestRef.child(snapshot.key).remove();
//             cusRef.orderByChild("userId").equalTo(customerId).on("child_added", function (snapshot) {
//                 snapshot.ref.update({
//                     "login": "false",
//                     "messageToken": "",
//                     "activiationState": "Deleted"
//                 }).then(function () {
//                     //Remove table of Regphone 
//                     RegPhoneRef.orderByChild("customerId").equalTo(customerId).on("child_added", function (snapshot) {
//                         RegPhoneRef.child(snapshot.key).remove();
//                     });
//                 });
//             });
//         });
//     });
// }

// function DeleteFreelncer(e) {
//     var freelancerId = e.target.getAttribute("freelancerid");
//     // Delete All customer notification 
//     NotificationFreelancer.child(freelancerId).remove();
//     cmRef.orderByChild("workerId").equalTo(freelancerId).on("child_added", function (snapshot) {
//         snapshot.ref.update({
//             "login": "false",
//             "messageToken": "",
//             "workerStatusActivation": "Deleted"
//         }).then(function () {
//             //Remove table of Regphone 
//             RegPhoneRef.orderByChild("customerId").equalTo(freelancerId).on("child_added", function (snapshot) {
//                 RegPhoneRef.child(snapshot.key).remove();
//             });
//         });
//     });
// }