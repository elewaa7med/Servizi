const locRef = dbRef.child('Locations');
/*************************** Start Send Notification ************************************/

var to = [],
    ids = [],
    counterIds,
    counter;

/*************************start with Freelancer ***********************/

var selectingSendToFree = document.getElementById("selectingSendToFree"),
    notificationDiv = document.getElementsByClassName("notifications"),
    DCountry = document.getElementsByClassName("DCountry"),
    DCity = document.getElementsByClassName("DCity"),
    DCategory = document.getElementsByClassName("DCategory"),
    DSpsific = document.getElementsByClassName("DSpsific");

function SendToSelectFree() {
    to = [];
    counter = 0;
    ids = [];
    counterIds = 0;
    var selectingSendToFreeValue = selectingSendToFree.value;
    if (!selectingSendToFreeValue) {
    } else {
        if (selectingSendToFreeValue == "country" || selectingSendToFreeValue == "city") {
            notificationDiv[0].style.display = "none";
            DCity[0].style.display = "none";
            DCategory[0].style.display = "none";
            DSpsific[0].style.display = "none";
            DCountry[0].style.display = "block";
            var freeCountryNotify = document.getElementById("freeCountryNotify");
            freeCountryNotify.innerHTML = ""
            var option = document.createElement("option");
            option.setAttribute("selected", "on");
            option.setAttribute("disabled", "on");
            option.text = "select Country Name";
            freeCountryNotify.append(option);

            locRef.child("Countries").on("child_added", function (snapshot) {
                var option = document.createElement("option");
                option.value = snapshot.key;
                option.append(snapshot.val().countryName);
                freeCountryNotify.append(option);
            });
        }

        if (selectingSendToFreeValue == "all") {
            notificationDiv[0].style.display = "block";
            DCity[0].style.display = "none";
            DCountry[0].style.display = "none";
            DCategory[0].style.display = "none";
            DSpsific[0].style.display = "none";
            cmRef.on("child_added", function (snapshot) {
                to[counter++] = snapshot.val().messageToken;
                ids[counterIds++] = snapshot.key;
            });
        }

        if (selectingSendToFreeValue == "category") {
            notificationDiv[0].style.display = "none";
            DCity[0].style.display = "none";
            DCountry[0].style.display = "none";
            DSpsific[0].style.display = "none";
            DCategory[0].style.display = "block";

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
                option.append(snapshot.val().categoryName);
                freeCategoryNotify.append(option);
            });
        }

        if (selectingSendToFreeValue == "specific") {
            notificationDiv[0].style.display = "none";
            DCity[0].style.display = "none";
            DCountry[0].style.display = "none";
            DCategory[0].style.display = "none";
            DSpsific[0].style.display = "block";
            var freeSpsificNotify = document.getElementById("freeSpsificNotify");
            freeSpsificNotify.innerHTML = "";
            cmRef.on("child_added", function (snapshot) {
                var option = document.createElement("option");
                option.value = snapshot.val().messageToken;
                option.setAttribute("freelancerId", snapshot.key);
                option.append(snapshot.val().workerPhone);
                freeSpsificNotify.append(option);
            });
        }
    }
}

function sendDependCountry(e) {
    const selectingSendToFreeValue = document.getElementById("selectingSendToFree").value;
    var freeCountryNotify = document.getElementById("freeCountryNotify");
    if (selectingSendToFreeValue == "country") {
        notificationDiv[0].style.display = "block";
        to = [];
        counter = 0;
        ids = [];
        counterIds = 0;
        cmRef.on("child_added", function (snapshot) {
            if (freeCountryNotify.value == snapshot.val().workerLocation.countryId) {
                to[counter++] = snapshot.val().messageToken;
                ids[counterIds++] = snapshot.key;
            }
        });
    }

    if (selectingSendToFreeValue == "city") {
        notificationDiv[0].style.display = "none";
        DCity[0].style.display = "block";

        var freeCityNotify = document.getElementById("freeCityNotify");
        freeCityNotify.innerHTML = "";
        var option = document.createElement("option");
        option.setAttribute("selected", "on");
        option.setAttribute("disabled", "on");
        option.text = "select City Name";
        freeCityNotify.append(option);
        locRef.child("Cities/" + freeCountryNotify.value).on("child_added", function (snapshot) {
            var option = document.createElement("option");
            option.value = snapshot.key;
            option.append(snapshot.val().cityName);
            freeCityNotify.append(option);
        });
    }
}

function sendDependCity() {
    notificationDiv[0].style.display = "block";
    var freeCityNotify = document.getElementById("freeCityNotify"),
        freeCityValue = freeCityNotify.value;
    to = [];
    counter = 0;
    ids = [];
    counterIds = 0;
    cmRef.on("child_added", function (snapshot) {
        if (freeCityValue == snapshot.val().workerLocation.cityId) {
            to[counter++] = snapshot.val().messageToken;
            ids[counterIds++] = snapshot.key;
        }
    });
}

function sendDependCategory() {
    notificationDiv[0].style.display = "block";
    var freeCategoryNotify = document.getElementById("freeCategoryNotify"),
        freeCategoryValue = freeCategoryNotify.value;
    to = [];
    counter = 0;
    ids = [];
    counterIds = 0;
    cmRef.on("child_added", function (snapshot) {
        if (freeCategoryValue == snapshot.val().workerCategoryid) {
            to[counter++] = snapshot.val().messageToken;
            ids[counterIds++] = snapshot.key;
        }
    });
}

function sendDependSpsific(e) {
    notificationDiv[0].style.display = "block";
    event = e;
}
/************************* End with Freelancer ***********************/

/********* start with customer ***************/
var selectingSendTocust = document.getElementById("selectingSendTocust");
function SendToSelectCust() {
    to = [];
    counter = 0;
    ids = [];
    counterIds = 0;
    const selectingSendTocustValue = selectingSendTocust.value;
    if (!selectingSendTocustValue) {

    } else {
        if (selectingSendTocustValue == "all") {
            notificationDiv[1].style.display = "block";
            DSpsific[1].style.display = "none";
            cusRef.on("child_added", function (snapshot) {
                to[counter++] = snapshot.val().messageToken;
                ids[counterIds++] = snapshot.key;
            });
        }



        if (selectingSendTocustValue == "specific") {
            DSpsific[1].style.display = "block";
            notificationDiv[1].style.display = "none";

            var freeSpsificNotify = document.getElementById("custSpsificNotify");
            freeSpsificNotify.innerHTML = "";
            cusRef.on("child_added", function (snapshot) {
                var option = document.createElement("option");
                option.value = snapshot.val().messageToken;
                option.setAttribute("customerId", snapshot.key);
                option.append(snapshot.val().userPhoneNumber);
                freeSpsificNotify.append(option);
            });
        }
    }
}

var freeSpsificNotify = document.getElementById("custSpsificNotify");
var event;
function sendDependSpsificCust(e) {
    notificationDiv[1].style.display = "block";
    event = e;
}
/*********  End with customer ***************/

function sendNotification(titleId, bodyId, page) {
    var title = document.getElementById(titleId),
        body = document.getElementById(bodyId),
        errorTitle = document.getElementById("errortitle"),
        errorBody = document.getElementById("errorBody"),
        errorfreetitle = document.getElementById("errorfreetitle"),
        errorfreeBody = document.getElementById("errorfreeBody"),
        error = 0;
    if (page == "customer") {
        if (selectingSendTocust.value == "specific") {
            to = [];
            ids = [];
            for (var counter = 0; counter < event.target.selectedOptions.length; counter++) {
                to[counter] = event.target.selectedOptions[counter].value;
                ids[counter] = event.target.selectedOptions[counter].getAttribute("customerId");
            }
        }
        if (!title.value) {
            errortitle.textcontent = "* this field can't be empty";
            errortitle.style.display = "block";
            error = 1;
        }
        if (!body.value) {
            errorbody.textcontent = "* this field can't be empty";
            errorbody.style.display = "block";
            error = 1;
        }
        if (error == 0) {
            excuteNotification(title, body, page, selectingSendTocust.value);
        }
    }

    if (page == "freelancer") {
        if (selectingSendToFree.value == "specific") {
            to = [];
            ids = [];
            for (var counter = 0; counter < event.target.selectedOptions.length; counter++) {
                to[counter] = event.target.selectedOptions[counter].value;
                ids[counter] = event.target.selectedOptions[counter].getAttribute("freelancerId");
            }
        }

        if (!title.value) {
            errorfreetitle.textContent = "* This field can't be empty";
            errorfreetitle.style.display = "block";
            error = 1;
        }
        if (!body.value) {
            errorfreeBody.textContent = "* This field can't be empty";
            errorfreeBody.style.display = "block";
            error = 1;
        }
        if (error == 0) {
            excuteNotification(title, body, page, selectingSendToFree.value);
        }
    }
}

function excuteNotification(title, body, page, selectCustomerOrFreelancer) {
    if (to != null && to != undefined) {
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
                var postdata = {
                   message: body.value,
                   shown: false,
                   orderId: "",
                   title: title.value,

                };
                if (page == "customer") {
                    saveNotification("NotificationCustomer", postdata);
                }
                if (page == "freelancer") {
                    saveNotification("NotificationFreelancer", postdata);
                }

                /************************************************************************* Related to save notification History in database *********************************************/
                //if (selectCustomerOrFreelancer === "specific") {
                //    saveHistory(null, null, null, title.value, body.value, ids[0], page);
                //} else {
                //    if (selectCustomerOrFreelancer == "country") {
                //        var freeCountryNotify = document.getElementById("freeCountryNotify");
                //        saveHistory(null, null, null, title.value, body.value, selectCustomerOrFreelancer, page, freeCountryNotify.value);
                //    }
                //    else if (selectCustomerOrFreelancer == "city") {
                //        var freeCountryNotify = document.getElementById("freeCountryNotify");
                //        var freeCityNotify = document.getElementById("freeCityNotify");
                //        saveHistory(null, null, null, title.value, body.value, selectCustomerOrFreelancer, page, freeCountryNotify.value + "\\" + freeCityNotify.value);

                //    }
                //    else if (selectCustomerOrFreelancer == "category") {
                //        var freeCategoryNotify = document.getElementById("freeCategoryNotify");
                //        saveHistory(null, null, null, title.value, body.value, selectCustomerOrFreelancer, page, freeCategoryNotify.value);

                //    } else {
                //        saveHistory(null, null, null, title.value, body.value, selectCustomerOrFreelancer, page);
                //    }
                //}
                /************************************************************************* Related to save notification History in database *********************************************/
                console.log(respone);
                var button = document.getElementById("exampleModalbutton");
                title.value = "";
                body.value = "";
                button.click();
            },
            error: function (error) {
                console.log(error);
                title.value = "";
                body.value = "";
            }
        });
    }
}

/************************** start save Notification ******************************/
function saveNotification(notTable, postData) {
    console.log("save");
    for (var counter = 0; counter < ids.length; counter++) {
        var singleId = ids[counter];
                firebase.database().ref(notTable + "/" + singleId).push().set(
            postData
        );
    }
}
/************************** End save Notification ******************************/
/*************************** End Send Notification ************************************/

//////////////////////////////////////////////////////////////////////* Start Table SEARCH *///////////////////////////////////////////////////////////////////////////////////

function myFunction(value, id) {
    // Declare variables
    var input, filter, select, option, i, txtValue;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    select = document.getElementById(value);
    option = select.getElementsByTagName("option");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < option.length; i++) {
        txtValue = option[i].textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            option[i].style.display = "";
        } else {
            option[i].style.display = "none";
        }
    }
}

//////////////////////////////////////////////////////////////////////* End Table SEARCH *///////////////////////////////////////////////////////////////////////////////////

/************ Start  check value exists in title & body **********************************/
function checkvalueExists(inputId) {
    var input = document.getElementById(inputId),
        errorTitle = document.getElementById("errortitle"),
        errorBody = document.getElementById("errorBody"),
        errorfreetitle = document.getElementById("errorfreetitle"),
        errorfreeBody = document.getElementById("errorfreeBody");
    if (input.value) {
        if (inputId == "customerNotificationTitle") {
            errorTitle.style.display = "none";
        } else if (inputId == "customerNotificationbody") {
            errorBody.style.display = "none";
        } else if (inputId == "freelancerNotificationTitle") {
            errorfreetitle.style.display = "none";
        } else if (inputId == "freelancerNotificationbody") {
            errorfreeBody.style.display = "none";

        }
    }
}
/************ End check value exists in title & body **********************************/