
(function Read() {
    const allAction = document.getElementById("allAction"),
        notificationTable = document.getElementById("notification");

    historyOrdersRef.on("child_added", snap => {
        var tr = document.createElement("tr"),
            employeeName = document.createElement("td"),
            date = document.createElement("td"),
            time = document.createElement("td"),
            requestId = document.createElement("td"),
            Action = document.createElement("td"),
            operation = document.createElement("td");

        //console.log(snap.val().actionName);
        if (snap.hasChild("actionName")) {
            if (snap.val().actionName === "PENDING") {
                Action.innerHTML = "Change request to Pending State";
                operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithId(\"" + snap.val().requestId + "\")' >Details</button>"
            }
            if (snap.val().actionName === "CMFinish") {
                Action.innerHTML = "CM finish Request";
                operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithId(\"" + snap.val().requestId + "\")' >Details</button>"

            }
            if (snap.val().actionName === "CANCEL") {
                Action.innerHTML = "change request to cancel state";
                operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithId(\"" + snap.val().requestId + "\")' >Details</button>"

            }
            if (snap.val().actionName === "POST") {
                Action.innerHTML = "Post request to Freelancer";
                operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithId(\"" + snap.val().requestId + "\")' >Details</button>"
            }
            if (snap.val().actionName === "DeleteComment") {
                Action.innerHTML = "Delete freelancer";
                var value = String(snap.val().requestId).split("/");
                requestId.innerHTML = value[0];
                if (snap.hasChild("freelancerId")) {
                    cmRef.child(snap.val().freelancerId).once("value", workerSnap => {
                        Action.innerHTML += workerSnap.val().workerPhone + " Offer on Request";
                    });
                }
                operation.innerHTML = "<button type='button' class='btn btn-warning' onclick='directwithId(\"" + value[0] + "\",\"POST\")' >Details</button>"

            }
        }
        if (snap.hasChild("date")) {
            date.innerHTML = snap.val().date;
        }
        if (snap.hasChild("requestId") && snap.val().actionName !== "DeleteComment") {
            requestId.innerHTML = snap.val().requestId;
        }
        if (snap.hasChild("time")) {
            time.innerHTML = snap.val().time;
        }
        if (snap.hasChild("userName")) {
            employeeName.innerHTML = snap.val().userName;
        }
        tr.append(employeeName);
        tr.append(Action);
        tr.append(date);
        tr.append(time);
        tr.append(requestId);
        tr.append(operation);
        allAction.prepend(tr);
    });

    //historyNotificationRef.on("child_added", snap => {
    //    var tr = document.createElement("tr"),
    //        employeeName = document.createElement("td"),
    //        date = document.createElement("td"),
    //        time = document.createElement("td"),
    //        requestId = document.createElement("td"),
    //        userCategory = document.createElement("td"),
    //        toWho = document.createElement("td"),
    //        operation = document.createElement("td");
    //    //console.log(snap.val().actionName);
    //    if (snap.hasChild("date")) {
    //        date.innerHTML = snap.val().date;
    //    }
    //    if (snap.hasChild("requestId")) {
    //        requestId.innerHTML = snap.val().requestId;
    //    }
    //    if (snap.hasChild("time")) {
    //        time.innerHTML = snap.val().time;
    //    }
    //    if (snap.hasChild("userName")) {
    //        employeeName.innerHTML = snap.val().userName;
    //    }
    //    if (snap.hasChild("userCategory")) {
    //        userCategory.innerHTML = snap.val().userCategory;
    //    }
    //    if (snap.hasChild("toWho")) {
    //        var toWhoValue = snap.val().toWho;
    //        if (toWhoValue == "all") {
    //            toWho.innerHTML = "All " + snap.val().userCategory;
    //        } if (toWhoValue == "country") {
    //            toWho.innerHTML = "All freelancer within " + snap.val().toWhoCategory + " country";
    //        } if (toWhoValue == "city") {
    //            toWho.innerHTML = "All freelancer within " + snap.val().toWhoCategory + " city\country";
    //        } if (toWho == "category") {
    //            toWho.innerHTML = "All freelancer within " + snap.val().toWhoCategory + " Category";
    //        } else {
    //            if (snap.val().userCategory == "freelancer") {
    //                cmRef.child(toWhoValue).on("child_added", refSnap => {
    //                    if (refSnap.key == "workerPhone") {
    //                        toWho.innerHTML = refSnap.val();
    //                    }
    //                });
    //            } else {
    //                cusRef.child(toWhoValue).on("child_added", refSnap => {
    //                    if (refSnap.key == "userPhoneNumber") {
    //                        toWho.innerHTML = refSnap.val();
    //                    }
    //                });
    //            }

    //        }
    //    }
    //    operation.innerHTML = "<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#sendNotificationModal\" data-title=\"" + snap.val().title +
    //        "\" data-body=\"" + snap.val().body + "\">Show Notification</button>";
    //    $('#sendNotificationModal').on('show.bs.modal', function (event) {
    //        var button = $(event.relatedTarget); // Button that triggered the modal
    //        var title = button.data('title'); // Extract info from data-* attributes
    //        var body = button.data('body'); // Extract info from data-* attributes
    //        document.getElementById("title-text").value = title;
    //        document.getElementById("message-text").value = body;
            
    //    });
    //    tr.append(employeeName);
    //    tr.append(date);
    //    tr.append(time);
    //    tr.append(userCategory);
    //    tr.append(toWho);
    //    tr.append(operation);
    //    notificationTable.prepend(tr);
    //});
})();



/************************************* End Company Maintaince Finish **********************************************/

/************************** Start Search Function in Tables of orders for each state ******************************/
function searchInTable(value, id, tablerow) {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(id);
    filter = input.value.toUpperCase();
    table = document.getElementById(value);
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[tablerow];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
/************************** End Search Function in Tables of orders for each state ******************************/
