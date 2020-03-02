var userType = localStorage.getItem("userType"),
    requestId = null,
    id = null;
function changeToCmFinish() {
    saveHistory("CMFinish", requestId);
    var inputCost = document.getElementById("cost-number");
    var johnRef = firebase.database().ref("Requests/" + requestId);
    johnRef.update({
        "state": "CM_FINISHED",
        "cost": inputCost.value
    }).then(function () {
        $("#cmPriceModal").modal("hide");
        inputCost.textContent = "";
        inputCost.value = "";
        window.location.reload();
    });
}
function finishCmClicked(value) {
    requestId = value;
}
function readMore(event, result) {
    event.target.parentElement.innerHTML = result + "<button class=\"button-more\" type='button' onclick='readless(event,\"" + result + "\")'> Read less </button>";
}
function readless(event, result) {
    event.target.parentElement.innerHTML = String(result).substring(0, 50) + "... <button  class=\"button-more\" type='button' onclick='readMore(event,\"" + result + "\")'> Read more </button>";
}
//////////////////////////////////////////////////////////////////////////////////////////////// POST REQUSETS //////////////////////////////////////////////////////////////////////
(function Read() {
    const freeFinsih = document.getElementById("fFinishList"),
        freeWorking = document.getElementById("workingList"),
        listcmfinish = document.getElementById("listcmfinish"),
        post = document.getElementById("listpost"),
        userListUI = document.getElementById("user-list"),
        cancelList = document.getElementById("cancelList");
    var pendingCounter = 0,
        postCounter = 0,
        freeWorkingCounter = 0,
        freeFinishCounter = 0,
        cmFinishCounter = 0,
        cancelCounter = 0,
        newChildAdded = false;
    requestRef.once("value", snap => {
        newChildAdded = true;
        $("#spinnerLoaderPend").hide();
        $("#spinnerLoaderPost").hide();
        $("#spinnerLoaderfw").hide();
        $("#spinnerLoadercw").hide();
        $("#spinnerLoadercf").hide();
        $("#spinnerLoaderc").hide();
        $('#post .pagination').empty();

        difPagination("#posttb", "Post", "#post");
        difPagination("#freeFinishtb", "fFinish", "#FFinish");
        difPagination("#freeWorktb", "FWorking", "#working");
        difPagination("#cmFinishtb", "CFinish", "#CMFinish");
        difPagination("#pendtb", "Pending", "#Pending");
        difPagination("#canceltb", "Cancel", "#Cancel");

        if (pendingCounter == 0) {
            $("#pendEmptyTable").show();
        }
        if (postCounter == 0) {
            $("#postEmptyTable").show();
        }
        if (freeWorkingCounter == 0) {
            $("#fwEmptyTable").show();
        }
        if (freeFinishCounter == 0) {
            $("#ffEmptyTable").show();
        }
        if (cmFinishCounter == 0) {
            $("#cfEmptyTable").show();
        }
        if (cancelCounter == 0) {
            $("#cEmptyTable").show();
        }

    });

    requestRef.on("child_added", snap => {
        var keyword = snap.val().state,
            $li = document.createElement("tr"),
            descriptionCol = document.createElement("td"),
            locationCol = document.createElement("td"),
            dateCol = document.createElement("td"),
            timeCol = document.createElement("td"),
            requestIdCol = document.createElement("td"),
            userPhoneCol = document.createElement("td"),
            paidCol = document.createElement("td"),
            operation = document.createElement("td"),
            phoneNumber,
            token;
        $li.id = snap.key;
        var dropdown =
            "<button class='btn btn-warning dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' >Action</button>"
            + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
            + "<a class='dropdown-item' onclick='directwithId(\"" + snap.key + "\")'>Details</a>";
        if (keyword == "PENDING") {
            pendingCounter++;
        }
        if (keyword == "POST") {
            postCounter++;
        }
        if (keyword == "FREELANCER_WORKING") {
            freeWorkingCounter++;
        }
        if (keyword == "FREELANCE_FINISHED") {
            freeFinishCounter++;
        }
        if (keyword == "CM_FINISHED") {
            cmFinishCounter++;
        }
        if (keyword == "CANCEL") {
            cancelCounter++;
        }
        snap.forEach(function (element) {
            var serviceKey = element.key,
                serviceValue = element.val();
            if (serviceKey == "orderDescription") {
                descriptionCol.innerHTML = serviceValue.length > 50 ? String(serviceValue).substring(0, 50) + "... <button class=\"button-more\" type='button' onclick='readMore(event,\"" + serviceValue + "\")'> Read more </button>" : serviceValue;
            }
            if (serviceKey == "locationAddress") {
                locationCol.innerHTML = serviceValue;

            }
            if (serviceKey == "creationDate") {
                dateCol.innerHTML = serviceValue;
            }
            if (serviceKey == "creationTime") {
                timeCol.innerHTML = serviceValue;
            }
            if (serviceKey == "customerId") {
                if (!serviceValue) {

                } else {
                    cusRef.child(serviceValue).once('value', snapshot => {
                        userPhoneCol.innerHTML = snapshot.val().userPhoneNumber;
                        phoneNumber = snapshot.val().userPhoneNumber;
                        token = snapshot.val().messageToken;
                        if (keyword === "PENDING") {

                            if (userType == "Admin") {
                                dropdown += "<a class='dropdown-item' data-whatever3= '" + serviceValue +
                                    "' data-whatever2= '" + token +
                                    "' request_id ='" + snap.key +
                                    "' data-whatever='" + phoneNumber +
                                    "' data-toggle= 'modal'  data-target = '#sendNotificationModal'>Send Notification</a> </div>";
                            }
                            operation.innerHTML = dropdown;
                        }
                    });
                }
            }
            if (keyword === "CM_FINISHED") {
                if (serviceKey == "cost") {
                    paidCol.innerHTML = serviceValue + "$";
                }
            }
        });

        if (keyword == "POST" || keyword == "FREELANCER_WORKING" || keyword == "FREELANCE_FINISHED") {
            dropdown += "<a class='dropdown-item'" +
                "' request_id ='" + snap.key +
                "' data-whatever='" + keyword +
                "' data-toggle= 'modal'  data-target = '#confirmModel'>pending</a>";
            if (keyword == "POST" || keyword == "FREELANCER_WORKING") {
                dropdown += "<a class='dropdown-item'" +
                    "' request_id ='" + snap.key +
                    "' data-whatever='" + "cancel" +
                    "' data-toggle= 'modal'  data-target = '#confirmModel'>Cancel</a>";
                operation.innerHTML += dropdown;
            }
            operation.innerHTML = dropdown;
        } else {
            operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithId(\"" + snap.key + "\")' >Details</button>";
        }

        if (keyword == "PENDING") {
            /***
             **     <a class="btn btn-warning" data-toggle="modal" data-target="#cmPriceModal" request-id="snap.key">Finish Work</a>
             ***/
            dropdown += "<a class='dropdown-item' data-toggle= 'modal' onclick='finishCmClicked(\"" + snap.key + "\")' data-target= '#cmPriceModal'>Finish By CM</a>";
            /******************************* End ****************************/

            /***
             **     <a class="btn btn-warning" data-toggle="modal" data-target="#cmPriceModal" request-id="snap.key">change to post</a>
             ***/
            dropdown += "<a class='dropdown-item'  request_id ='" + snap.key + "' data-whatever='post' data-toggle= 'modal'  data-target= '#confirmModel'>Change To Post</a>";
            /******************************* End ****************************/

            /***
             **     <a class="btn btn-warning" data-toggle="modal" data-target="#confirmModel" request-id="snap.key"></a>
             ***/
            dropdown += "<a class='dropdown-item'  request_id ='" + snap.key + "' data-whatever='cancel' data-toggle= 'modal'  data-target= '#confirmModel'>Cancel</a>";

            /******************************* End ****************************/
        }
        requestIdCol.innerHTML = snap.key;
        $li.append(descriptionCol);
        $li.append(locationCol);
        $li.append(dateCol);
        $li.append(timeCol);
        $li.append(requestIdCol);
        if (keyword === "FREELANCE_FINISHED" || keyword === "FREELANCER_WORKING") {
            connectionRef.on("value", snapshot => {
                snapshot.forEach(element => {
                    if (snap.key == element.val().requestId) {
                        commentRef.child(snap.key).on("value", commentSnap => {
                            commentSnap.forEach(commentSnapChild => {
                                if (element.val().freelancerId == commentSnapChild.val().freelancerId) {
                                    paidCol.innerHTML = commentSnapChild.val().comment + "$";
                                }
                            });

                        });
                    }
                });
            });
            $li.append(paidCol);
        }
        if (keyword === "CM_FINISHED") {
            $li.append(paidCol);
        }
        $li.append(userPhoneCol);
        $li.append(operation);

        if (keyword === "POST") {
            $li.classList.add("Post");
            $("#postEmptyTable").hide();
            post.prepend($li);
            if (newChildAdded == true) {
                $('#post .pagination').empty();
                difPagination("#posttb", "Post", "#post");
            }
        }

        if (keyword === "FREELANCE_FINISHED") {
            $li.classList.add("fFinish");
            $("#ffEmptyTable").hide();
            freeFinsih.prepend($li);
            if (newChildAdded == true) {
                $('#FFinish .pagination').empty();
                difPagination("#freeFinishtb", "fFinish", "#FFinish");
            }
        }

        if (keyword === "FREELANCER_WORKING") {
            $li.classList.add("FWorking");
            $("#fwEmptyTable").hide();
            freeWorking.prepend($li);
            if (newChildAdded == true) {
                $('#working .pagination').empty();
                difPagination("#freeWorktb", "FWorking", "#working");
            }
        }
        if (keyword === "CM_FINISHED") {
            $li.classList.add("CFinish");
            $("#cfEmptyTable").hide();
            listcmfinish.prepend($li);
            if (newChildAdded == true) {
                $('#CMFinish .pagination').empty();
                difPagination("#cmFinishtb", "CFinish", "#CMFinish");
            }
        }
        if (keyword === "PENDING") {
            $li.classList.add("Pending");
            userListUI.prepend($li);
            $("#pendEmptyTable").hide();
            if (newChildAdded == true) {
                $('#Pending .pagination').empty();
                difPagination("#pendtb", "Pending", "#Pending");
            }
        }
        if (keyword === "CANCEL") {
            $li.classList.add("Cancel");
            $("#cEmptyTable").hide();
            cancelList.prepend($li);
            if (newChildAdded == true) {
                $('#Cancel .pagination').empty();
                difPagination("#canceltb", "Cancel", "#Cancel");
            }
        }
    });

    requestRef.on('child_changed', function (data) {
        var id = document.getElementById(data.key),
            keyword = data.val().state;
        if (keyword === "FREELANCE_FINISHED" ||
            keyword === "FREELANCER_WORKING" ||
            keyword == "POST" ||
            keyword == "CANCEL") {
            var dropdown =
                "<button class='btn btn-warning dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' >Action</button>"
                + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
                + "<a class='dropdown-item' onclick='directwithId(\"" + data.key + "\")'>Details</a>";
            id.remove();
            var $li = document.createElement("tr"),
                descriptionCol = document.createElement("td"),
                locationCol = document.createElement("td"),
                dateCol = document.createElement("td"),
                timeCol = document.createElement("td"),
                requestIdCol = document.createElement("td"),
                userPhoneCol = document.createElement("td"),
                paidCol = document.createElement("td"),
                operation = document.createElement("td");
            $li.id = data.key;
            descriptionCol.innerHTML = data.val().orderDescription;
            locationCol.innerHTML = data.val().locationAddress;
            dateCol.innerHTML = data.val().creationDate;
            timeCol.innerHTML = data.val().creationTime;
            cusRef.child(data.val().customerId).once('value', snapshot => {
                userPhoneCol.innerHTML = snapshot.val().userPhoneNumber;
            });
            if (keyword === "FREELANCE_FINISHED" || keyword === "FREELANCER_WORKING") {
                connectionRef.on("value", snapshot => {
                    snapshot.forEach(element => {
                        if (data.key == element.val().requestId) {
                            commentRef.child(snap.key).on("value", commentSnap => {
                                commentSnap.forEach(commentSnapChild => {
                                    if (element.val().freelancerId == commentSnapChild.val().freelancerId) {
                                        paidCol.innerHTML = commentSnapChild.val().comment + "$";
                                    }
                                });

                            });
                        }
                    });
                });
            }
            if (keyword == "POST" || keyword == "FREELANCER_WORKING" || keyword == "FREELANCE_FINISHED") {
                dropdown += "<a class='dropdown-item'" +
                    "' request_id ='" + data.key +
                    "' data-whatever='" + keyword +
                    "' data-toggle= 'modal'  data-target = '#confirmModel'>pending</a>";
                if (keyword == "POST" || keyword == "FREELANCER_WORKING") {
                    dropdown += "<a class='dropdown-item'" +
                        "' request_id ='" + data.key +
                        "' data-whatever='" + "cancel" +
                        "' data-toggle= 'modal'  data-target = '#confirmModel'>Cancel</a>";
                    operation.innerHTML += dropdown;
                }
            } else {
                operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithId(\"" + data.key + "\")' >Details</button>";

            }
            requestIdCol.innerHTML = data.key;
            $li.append(descriptionCol);
            $li.append(locationCol);
            $li.append(dateCol);
            $li.append(timeCol);
            $li.append(requestIdCol);
            if (keyword === "FREELANCE_FINISHED"
                || keyword === "FREELANCER_WORKING") {
                $li.append(paidCol);
            }
            $li.append(userPhoneCol);
            $li.append(operation);

            if (keyword === "POST") {
                $li.classList.add("Post");
                post.prepend($li);
                if (newChildAdded == true) {
                    $('#post .pagination').empty();
                    difPagination("#posttb", "Post", "#post");
                }
            }
            if (keyword === "FREELANCE_FINISHED") {
                $li.classList.add("fFinish");
                freeFinsih.prepend($li);
                if (newChildAdded == true) {
                    $('#FFinish .pagination').empty();
                    difPagination("#freeFinishtb", "fFinish", "#FFinish");
                }
            }
            if (keyword === "FREELANCER_WORKING") {
                $li.classList.add("FWorking");
                freeWorking.prepend($li);
                if (newChildAdded == true) {
                    $('#working .pagination').empty();
                    difPagination("#freeWorktb", "FWorking", "#working");
                }
            }
            if (keyword === "CM_FINISHED") {
                $li.classList.add("CFinish");
                listcmfinish.prepend($li);
                if (newChildAdded == true) {
                    $('#CMFinish .pagination').empty();
                    difPagination("#cmFinishtb", "CFinish", "#CMFinish");
                }
            }
            if (keyword === "CANCEL") {
                $li.classList.add("Cancel");
                cancelList.prepend($li);
                if (newChildAdded == true) {
                    $('#Cancel .pagination').empty();
                    difPagination("#canceltb", "Cancel", "#Cancel");
                }
            }
        }
    });
})();



/************************************* End Company Maintaince Finish **********************************************/



/************************************* start Send Notification ****************************************************/
function sendNotification(button, title, body, token) {
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
        excuteNotification(title, body, token);
    }
}

function excuteNotification(title, body, token) {
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
                var postData = {
                   message: body.value,
                   shown: false,
                   orderId: "",
                   title: title.value,

                };
                saveNotification("NotificationCustomer", postData);
                body.value = "";
            },
            error: function (error) {
                console.log(error);
                body.value = "";
            }
        });
    }

}

/************ Start  check value exists in title & body **********************************/
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
/************ End check value exists in title & body **********************************/

/************************** start save Notification ******************************/
function saveNotification(notTable, postData) {
    firebase.database().ref(notTable + "/" + id).push().set(
        postData
    );
}
/************************** End save Notification ******************************/

/************************************* End Send Notification ************************************************/



/************************************** Start Action Confirmation of Alert Dialog To Confirm Action On Request *************************/
$('#confirmModel').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var dialogKeyword = button.data('whatever') // Extract info from data-* attributes
    var confirmQuestion = document.getElementById("confirm-question");
    var btnConfirm = document.getElementById("confirm-button");
    var request_id = event.relatedTarget.getAttribute("request_id");
    var requestRef = firebase.database().ref("Requests/" + request_id);
    if (dialogKeyword === "cancel") {
        confirmQuestion.textContent = "Are You Sure You Want To Cancel This Requet !?";
        btnConfirm.onclick = function () {
            saveHistory("CANCEL", request_id);
            requestRef.update({
                "state": "CANCEL"
            });
        }
    }
    if (dialogKeyword === "post") {
        confirmQuestion.textContent = "Are You Sure You Want To Convert This Request To Post State !?";
        btnConfirm.onclick = function () {
            saveHistory("POST", request_id);
            requestRef.update({
                "state": "POST"
            });
        }
    }
    if (dialogKeyword === "POST" || dialogKeyword === "FREELANCER_WORKING" || dialogKeyword === "FREELANCE_FINISHED") {
        confirmQuestion.textContent = "are you sure you want to convert this request to Pending state !?";
        btnConfirm.onclick = function () {
            saveHistory("PENDING", request_id);
            var commentRef = firebase.database().ref("Comments/" + request_id);
            requestRef.update({
                "state": "PENDING"
            });
            commentRef.remove();
            if (dialogKeyword === "FREELANCER_WORKING" || dialogKeyword === "FREELANCE_FINISHED") {
                firebase.database().ref("FreeCustomerConnection").once("value", element => {
                    element.forEach(snapElement => {
                        if (snapElement.val().requestId === request_id) {
                            firebase.database().ref("FreeCustomerConnection/" + snapElement.key).remove();
                            return;
                        }
                    });
                });
                if (dialogKeyword === "FREELANCE_FINISHED") {
                    requestRef.once("value", element => {
                        if (element.hasChild("rate")) {
                            if (String(element.val().rate).length > 2) {
                                firebase.database().ref("Ratings/" + element.val().rate).remove();
                            }
                        }
                    });
                    requestRef.update({
                        "rate": "5"
                    });
                }
            }
            window.location.reload();
        }
    }
});
/************************************** End Action Confirmation of Alert Dialog To Confirm Action On Request *************************/

/*********************************** Start Action send Notification of Alert Dialog *************************/
$('#sendNotificationModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var token = button.data('whatever2'); // Extract info from data-* attributes
    var phoneNumber = button.data('whatever'); // Extract info from data-* attributes
    var customerID = button.data('whatever3'); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find('.modal-title').text('Send Notification To ' + phoneNumber);
    var NotificationTitle = document.getElementById("title-text"),
        NotificationBody = document.getElementById("message-text");
    document.getElementById("btnSend").onclick = function () {
        id = customerID;
        //saveHistory(null, null, null, NotificationTitle.value, NotificationBody.value, customerID, "customer");
        sendNotification(this, NotificationTitle, NotificationBody, token);
    }
});
/************************************* Start Action send Notification of Alert Dialog **********************************************************/