var config = {
    apiKey: "AIzaSyB5_36WgMjAFqhtHUFX1V-kTvNR6JsawSg",
    authDomain: "servizi-528e9.firebaseapp.com",
    databaseURL: "https://servizi-528e9.firebaseio.com",
    projectId: "servizi-528e9",
    storageBucket: "servizi-528e9.appspot.com",
    messagingSenderId: "445806630230",
    appId: "1:445806630230:web:86b3263e4c03201e"
};
firebase.initializeApp(config);

// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const employeesRef = dbRef.child('Employees');
const requestRef = dbRef.child('Requests');
const DeteledrequestRef = dbRef.child('DetetedRequests');
const requestSpseficRef = dbRef.child('Requests/{request}/state');
const cmRef = dbRef.child('Workers');
const comRef = dbRef.child('Company');
const cusRef = dbRef.child('Users');
const catRef = dbRef.child('Category');
const notifyRef = dbRef.child('CPNotification');
const commentRef = dbRef.child('Comments');
const connectionRef = dbRef.child('FreeCustomerConnection');
const countersRef = dbRef.child('Locations/Countries');
const citysRef = dbRef.child('Locations/Cities');
const historyRef = dbRef.child('History');
const historyOrdersRef = dbRef.child('History/Orders');
const historyNotificationRef = dbRef.child('History/SendNotification');
const NotificationCustomer = dbRef.child('NotificationCustomer');
const NotificationFreelancer = dbRef.child('NotificationFreelancer');
const RegPhoneRef = dbRef.child('RegPhone');

var userType = localStorage.getItem("userType");
if (userType != "Admin") {
    var notificationTab = document.getElementsByClassName("nav-item");
    notificationTab[3].style.display = "none";
    notificationTab[4].style.display = "none";
}

/*********************************** Start ReadNotification() **********************************/
(function() {
    var spanNotiNumber = document.getElementById("noti-number");
    var notifyList = document.getElementById("notifList");
    var firstTime = false;
    var counter = 0;
    notifyRef.on('value', snap => {
        counter = snap.numChildren();
        spanNotiNumber.textContent = counter;
        firstTime = true;
    });
    notifyRef.on("child_added", function (snapshot) {
        // voice for notification coming
        if (firstTime === true) {
            var audio = new Audio("../sound/pip.wav");
            const playedPromise = audio.play();
            if (playedPromise) {
                playedPromise.catch((e) => {
                    if (e.name === 'NotAllowedError' ||
                        e.name === 'NotSupportedError') {
                    }
                });
            }
        }
        /************************** Create <a id="snapshot.key" className="dropdown-item" onmouseover="function()" onclick="function()"></a> to append notification in it *****************************/
        var notifyLink = document.createElement("a");
        notifyLink.className = "dropdown-item";
        notifyLink.id = snapshot.key;
        notifyLink.onmouseover = function () {
            this.style.cursor = "pointer";
        }
        notifyLink.onclick = function () {
            notifyRef.child(this.id).remove();
            if (notifyLink.name.endsWith("Orders.html")) {
                //localStorage.setItem("requestId", customerId);
                location.href = notifyLink.name;
            }
            if (notifyLink.name.endsWith("customerDetails.html")) {
                localStorage.setItem("customerId", notifyLink.getAttribute("secondaryId"));
                location.href = notifyLink.name;
            }
            if (notifyLink.name.endsWith("freelancerDetails.html")) {
                localStorage.setItem("freelancerId", notifyLink.getAttribute("secondaryId"));
                location.href = notifyLink.name;
            }
            if (notifyLink.name.endsWith("orderDetails.html")) {
                localStorage.setItem("requestId", notifyLink.getAttribute("secondaryId"));
                if (notifyLink.hasAttribute("keyword") && notifyLink.getAttribute("keyword") == "Offer") {
                    localStorage.setItem("pageValue", "POST");
                } else {
                    localStorage.setItem("pageValue", "other");
                }
                location.href = notifyLink.name;
            }
        }
        /************************** End <a id="snapshot.key" className="dropdown-item" onmouseover="function()" onclick="function()"></a> to append notification in it *****************************/
        var ids, userPhone, workerPhone,companyPhone;
        snapshot.forEach(function (element) {

            var requestKey = element.key,
                requestValue = element.val();

            if (requestKey == "id" || requestKey == "customerId" || requestKey == "freelancerId") {
                ids = requestValue;
            }
            if (requestKey == "keyword") {
                if (requestValue == "Users" || requestValue == "Requests") {
                    cusRef.child(ids).once("value").then(function (customerSnapshot) {
                        if (customerSnapshot.hasChild("userPhoneNumber")) {
                            userPhone = customerSnapshot.child("userPhoneNumber").val();
                        }
                        if (requestValue == "Users") {
                            notifyLink.setAttribute("secondaryId", customerSnapshot.key);
                            notifyLink.innerHTML = "New Customer &nbsp; <b>" + userPhone + "</b>&nbsp; Registed To Our Applicatoin";
                            notifyLink.name = "/Pages/customerDetails.html";
                        }
                        else if (requestValue == "Requests") {
                            notifyLink.innerHTML = "New Service Order has been sent by &nbsp; <b>" + userPhone + "</b>";
                            notifyLink.name = "/Pages/Orders.html";
                        }
                    });
                }

                if (requestValue == "Workers") {
                    cmRef.child(ids).once("value").then(function (customerSnapshot) {
                        if (customerSnapshot.hasChild("workerPhone")) {
                            workerPhone = customerSnapshot.child("workerPhone").val();
                        }
                        notifyLink.setAttribute("secondaryId", customerSnapshot.key);
                        notifyLink.innerHTML = "New Freelancer &nbsp;<b>" + workerPhone + "</b> &nbsp; Registed To Our Applicatoin";
                        notifyLink.name = "/Pages/freelancerDetails.html";
                    });
                }
                if (requestValue == "Company") {
                    comRef.child(ids).once("value").then(function (companySnapshot) {
                        if (companySnapshot.hasChild("companyPhone")) {
                            companyPhone = companySnapshot.child("companyPhone").val();
                        }
                        notifyLink.setAttribute("secondaryId", companySnapshot.key);
                        notifyLink.innerHTML = "New Company &nbsp;<b>" + companyPhone + "</b> &nbsp; Registed To Our Applicatoin";
                        // notifyLink.name = "/Pages/freelancerDetails.html";
                    });
                }

                if (requestValue == "Offer") {
                    cmRef.child(snapshot.val().freelancerId).once("value").then(function (workerSnapshot) {
                        if (workerSnapshot.hasChild("workerPhone")) {
                            workerPhone = workerSnapshot.child("workerPhone").val();
                        }
                        notifyLink.setAttribute("secondaryId", snapshot.val().orderId);
                        notifyLink.setAttribute("keyword", "Offer");
                        notifyLink.innerHTML = "New Offer add by Freelancer  &nbsp;<b>" + workerPhone + "</b> &nbsp; with coast = " + snapshot.val().Comment + " To Request " + snapshot.val().orderId;
                        notifyLink.name = "/Pages/orderDetails.html";
                    });

                }

                if (requestValue == "Accept") {
                    cusRef.child(snapshot.val().customerId).once("value").then(function (customerSnapshot) {
                        if (customerSnapshot.hasChild("userPhoneNumber")) {
                            userPhone = customerSnapshot.child("userPhoneNumber").val();
                            notifyLink.innerHTML = "Customer  &nbsp;<b>" + userPhone + "</b> &nbsp;";
                            cmRef.child(snapshot.val().freelancerId).once("value").then(function (workerSnapshot) {
                                if (workerSnapshot.hasChild("workerPhone")) {
                                    workerPhone = workerSnapshot.child("workerPhone").val();
                                    notifyLink.innerHTML += "Accept freelancer &nbsp;<b> " + workerPhone + "</b> &nbsp; on Request " + snapshot.val().orderId;
                                }
                            });
                        }
                    });
                    notifyLink.setAttribute("secondaryId", snapshot.val().orderId);
                    notifyLink.name = "/Pages/orderDetails.html";
                }

                if (requestValue == "FREELANCE_FINISHED") {
                    cusRef.child(snapshot.val().customerId).once("value").then(function (customerSnapshot) {
                        if (customerSnapshot.hasChild("userPhoneNumber")) {
                            userPhone = customerSnapshot.child("userPhoneNumber").val();
                            notifyLink.innerHTML = "Customer  &nbsp;<b>" + userPhone + "</b> &nbsp;";
                            cmRef.child(snapshot.val().freelancerId).once("value").then(function (workerSnapshot) {
                                if (workerSnapshot.hasChild("workerPhone")) {
                                    workerPhone = workerSnapshot.child("workerPhone").val();
                                    notifyLink.innerHTML += "Freelancer &nbsp;<b> " + workerPhone + "</b> &nbsp; Finish Working on Request " + snapshot.val().orderId;

                                }
                            });
                        }
                    });

                    notifyLink.setAttribute("secondaryId", snapshot.val().orderId);
                    notifyLink.name = "/Pages/orderDetails.html";
                }
            }
        });
        notifyList.prepend(notifyLink);
    });

    notifyRef.on("child_removed", function (snapshot) {
        var notificationElement = document.getElementById(snapshot.key);
        notificationElement.remove();
    });
})();

/*.............................. End readNotification() ......................................*/

/********************************** Start logout function ***********************************/
function logout() {
    localStorage.clear();
    window.location.href = "./login.html"
}
/*................................. End logout function ..................................*/


/********************************** Start logout If no User ***********************************/
var userName = localStorage.getItem("userName");
var userPassword = localStorage.getItem("userPassword");
if (userName === null || userName === undefined || userName === "" &&
    userPassword === null || userPassword === undefined || userPassword === "") {
    window.location.href = "./login.html";
}
/*................................. End logout If no User .....................................*/


/********************************** Start Save Employee History Action *************************/
function saveHistory(actionName = null, requestId = null, freelancerId = null, title = null, body = null, toWho = null, toWhotype = null, toWhoCategory = null) {
    var date = new Date();
    var time = date.getDate() + "/" + (parseInt(date.getMonth()) + 1) + "/" + date.getFullYear();
    var dateStr = (String(date.getHours()).length == 2 ? date.getHours() : "0" + date.getHours()) + ":"
        + (String(date.getMinutes()).length == 2 ? date.getMinutes() : "0" + date.getMinutes()) + ":"
        + (String(date.getSeconds()).length == 2 ? date.getSeconds() : "0" + date.getSeconds());
    if (actionName != null) {
        historyOrdersRef.push().set({
            "actionName": actionName,
            "userName": userName,
            "date": time,
            "time": dateStr,
            "requestId": requestId,
            "freelancerId": freelancerId
        });
    }
    //else {
    //    historyNotificationRef.push().set({
    //        "userName": userName,
    //        "date": time,
    //        "time": dateStr,
    //        "title": title,
    //        "body": body,
    //        "toWho": toWho,
    //        "userCategory": toWhotype,
    //        "toWhoCategory": toWhoCategory
    //    });
    //}

};
/*................................. End Save Employee History Action ..........................*/

/******************************** Start global functions *************************/
function directwithId(requestId, pageValue) {
    localStorage.setItem("requestId", requestId);
    localStorage.setItem("pageValue", pageValue);
    location.href = "orderDetails.html";
}

/********************************** End global functions *************************/
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
            if (txtValue.toUpperCase().startsWith(filter) == true) {
                if (table.parentElement.id == "pendtb") {
                    tr[i].classList.add("Pending");
                }
                if (table.parentElement.id == "posttb") {
                    tr[i].classList.add("Post");
                }
                if (table.parentElement.id == "freeWorktb") {
                    tr[i].classList.add("FWorking");
                }
                if (table.parentElement.id == "freeFinishtb") {
                    tr[i].classList.add("fFinish");
                }
                if (table.parentElement.id == "cmFinishtb") {
                    tr[i].classList.add("CFinish");
                }
                if (table.parentElement.id == "canceltb") {
                    tr[i].classList.add("Cancel");
                }
                tr[i].removeAttribute("style");
            } else {
                if (table.parentElement.id == "pendtb") {
                    tr[i].classList.remove("Pending");
                }
                if (table.parentElement.id == "posttb") {
                    tr[i].classList.remove("Post");
                }
                if (table.parentElement.id == "freeWorktb") {
                    tr[i].classList.remove("FWorking");
                }
                if (table.parentElement.id == "freeFinishtb") {
                    tr[i].classList.remove("fFinish");
                }
                if (table.parentElement.id == "cmFinishtb") {
                    tr[i].classList.remove("CFinish");
                }
                if (table.parentElement.id == "canceltb") {
                    tr[i].classList.remove("Cancel");
                }
                tr[i].style.display = "none";
            }
        }

        if (table.parentElement.id == "pendtb") {
            if ($(value + " tr[class*='Pending']").length === 0) {
                $(value + " #pendEmptyTable").removeAttr("style");
                $(value + " #pendEmptyTable td").removeAttr("style");
            } else {
                $("#pendEmptyTable").attr("style", "display: none;");
                $("#pendEmptyTable td").attr("style", "display: none;");
            }
            $('#pending .pagination').empty();
            difPagination("#pendtb", "Pending", "#Pending");
        }
        if (table.parentElement.id == "posttb") {
            if ($(value + " tr[class*='Post']").length === 0) {
                $(value + " #postEmptyTable").removeAttr("style");
                $(value + " #postEmptyTable td").removeAttr("style");
            } else {
                $("#postEmptyTable").attr("style", "display: none;");
                $("#postEmptyTable td").attr("style", "display: none;");
            }
            $('#post .pagination').empty();
            difPagination("#posttb", "Post", "#post");
        }
        if (table.parentElement.id == "freeWorktb") {
            if ($(value + " tr[class*='FWorking']").length === 0) {
                $(value + " #fwEmptyTable").removeAttr("style");
                $(value + " #fwEmptyTable td").removeAttr("style");
            } else {
                $("#fwEmptyTable").attr("style", "display: none;");
                $("#fwEmptyTable td").attr("style", "display: none;");
            }
            $('#working .pagination').empty();
            difPagination("#freeWorktb", "FWorking", "#working");
        }
        if (table.parentElement.id == "freeFinishtb") {
            if ($(value + " tr[class*='fFinish']").length === 0) {
                $(value + " #ffEmptyTable").removeAttr("style");
                $(value + " #ffEmptyTable td").removeAttr("style");
            } else {
                $("#ffEmptyTable").attr("style", "display: none;");
                $("#ffEmptyTable td").attr("style", "display: none;");
            }
            $('#FFinish .pagination').empty();
            difPagination("#freeFinishtb", "fFinish", "#FFinish");

        }
        if (table.parentElement.id == "cmFinishtb") {
            if ($(value + " tr[class*='CFinish']").length === 0) {
                $(value + " #cfEmptyTable").removeAttr("style");
                $(value + " #cfEmptyTable td").removeAttr("style");
            } else {
                $("#cfEmptyTable").attr("style", "display: none;");
                $("#cfEmptyTable td").attr("style", "display: none;");
            }
            $('#CMFinish .pagination').empty();
            difPagination("#cmFinishtb", "CFinish", "#CMFinish");
        }
        if (table.parentElement.id == "canceltb") {
            if ($(value + " tr[class*='Cancel']").length === 0) {
                $(value + " #cEmptyTable").removeAttr("style");
                $(value + " #cEmptyTable td").removeAttr("style");
            } else {
                $("#cEmptyTable").attr("style", "display: none;");
                $("#cEmptyTable td").attr("style", "display: none;");
            }
            $('#Cancel .pagination').empty();
            difPagination("#canceltb", "Cancel", "#Cancel");
        }
    }
}
/************************** End Search Function in Tables of orders for each state ******************************/




/********************** Start Table Pgination ************************* */
function pagination(tableID) {
    var table = tableID;
    var trnum = 0;
    var maxRows = 15;
    var totalRows = $(table + " tbody tr[class*='inList']").length;
    $(table + " tbody tr[class*='inList']").each(function () {
        trnum++;
        if (trnum > maxRows) {
            $(this).hide();
        } if (trnum <= maxRows) {
            $(this).show();
        }
    });

    if (totalRows > maxRows) {
        var pagenu = Math.ceil(totalRows / maxRows);
        for (var i = 1; i <= pagenu && tableID == "#custb";) {
            $('#customer .pagination').append('<li data-page="' + i + '">\<span>' + i++ + '<span class="sr-only">(current)</span>\</li>').show();
        }
        for (var i = 1; i <= pagenu && tableID == "#frtb";) {
            $('#freelancer .pagination').append('<li data-page="' + i + '">\<span>' + i++ + '<span class="sr-only">(current)</span>\</li>').show();
        }
        for (var i = 1; i <= pagenu && tableID == "#cattb";) {
            $('#categoryValue .pagination').append('<li data-page="' + i + '">\<span>' + i++ + '<span class="sr-only">(current)</span>\</li>').show();
        }
    }

    $('.pagination li:first-child').addClass('active');
    $('.pagination li').on('click', function () {
        var pagenum = $(this).attr('data-page');
        var trIndex = 0;
        $('.pagination li').removeClass('active')
        $(this).addClass('active');
        $(table + " tbody tr[class*='inList']").each(function () {
            trIndex++;
            if (trIndex > (maxRows * pagenum) || trIndex <= ((maxRows * pagenum) - maxRows)) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });
}

function difPagination(tableID, className, mainId) {
    var table = tableID;
    var trnum = 0;
    var maxRows = 15;
    var totalRows = $(table + " tbody tr[class*='" + className + "']").length;
    $(table + " tbody tr[class*='" + className + "']").each(function () {
        trnum++;
        if (trnum > maxRows) {
            $(this).hide();
        } if (trnum <= maxRows) {
            $(this).show();
        }
    });

    if (totalRows > maxRows) {
        var pagenu = Math.ceil(totalRows / maxRows);
        for (var i = 1; i <= pagenu && table == "#pendtb";) {
            $(mainId + ' .pagination').append('<li data-page="' + i + '">\<span>' + i++ + '<span class="sr-only">(current)</span>\</li>').show();
        }
        for (var i = 1; i <= pagenu && table == "#canceltb";) {
            $(mainId + ' .pagination').append('<li data-page="' + i + '">\<span>' + i++ + '<span class="sr-only">(current)</span>\</li>').show();
        }
        for (var i = 1; i <= pagenu && table == "#cmFinishtb";) {
            $(mainId + ' .pagination').append('<li data-page="' + i + '">\<span>' + i++ + '<span class="sr-only">(current)</span>\</li>').show();
        }
        for (var i = 1; i <= pagenu && table == "#freeWorktb";) {
            $(mainId + ' .pagination').append('<li data-page="' + i + '">\<span>' + i++ + '<span class="sr-only">(current)</span>\</li>').show();
        }
        for (var i = 1; i <= pagenu && table == "#freeFinishtb";) {
            $(mainId + ' .pagination').append('<li data-page="' + i + '">\<span>' + i++ + '<span class="sr-only">(current)</span>\</li>').show();
        }
        for (var i = 1; i <= pagenu && table == "#posttb";) {
            $(mainId + ' .pagination').append('<li data-page="' + i + '">\<span>' + i++ + '<span class="sr-only">(current)</span>\</li>').show();
        }
    }

    $(mainId + ' .pagination li:first-child').addClass('active');
    $(mainId + ' .pagination li').on('click', function () {
        var pagenum = $(this).attr('data-page');
        var trIndex = 0;
        $(mainId + ' .pagination li').removeClass('active')
        $(this).addClass('active');
        $(table + " tbody tr[class*='" + className + "']").each(function () {
            trIndex++;
            if (trIndex > (maxRows * pagenum) || trIndex <= ((maxRows * pagenum) - maxRows)) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });
}
/********************** End Table Pgination ************************* */