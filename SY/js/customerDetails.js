window.onbeforeunload = confirmExit;
function confirmExit() {
    localStorage.setItem("currentPage","customer");
}
var customerId = localStorage.getItem("customerId");
const cusRefspecfic = dbRef.child('Users/' + customerId);

(function readpendingData() {
    const customerImage = document.getElementById("customerImage"),
        customerName = document.getElementById("customerName"),
        customerPhone = document.getElementById("customerPhone"),
        customerEmail = document.getElementById("customerEmail"),
        customerState = document.getElementById("customerState");
    cusRefspecfic.once("value", snap => {
        //get customer infromation for Request
        //console.log(snap.val());
        if (!snap.val().userPhoto) {
            customerImage.src = "../img/logo.jpg";
        } else {
            customerImage.src = snap.val().userPhoto;
        }

        customerName.textContent = snap.val().userName;
        customerPhone.textContent = snap.val().userPhoneNumber;
        customerEmail.textContent = snap.val().userEmail;
        if (snap.val().activiationState === true) {
            customerState.textContent = "Active";
        } else {
            customerState.textContent = "Deactive";
        }
    });

    //var freeHistory = document.getElementById("free-list");
    //customerConnectionFreelacner.once("value", snap => {

    //    snap.forEach(snapChild => {
    //        var tableRow = document.createElement("tr");
    //        var col1 = document.createElement("td");
    //        var col2 = document.createElement("td");
    //        var col3 = document.createElement("td");
    //        var col4 = document.createElement("td");
    //        var col5 = document.createElement("td");
    //        var col6 = document.createElement("td");
    //        var col7 = document.createElement("td");
    //        if (snapChild.val().freelancerId === freelancerId) {
    //            cusRef.child(snapChild.val().customerId).once("value", snapCus => {
    //                col1.append(snapCus.val().userName);
    //                col2.append(snapCus.val().userPhoneNumber);
    //            });

    //            requestRef.child(snapChild.val().requestId).once("value", snapReq => {
    //                col5.append(snapReq.val().state);
    //                col4.append(snapReq.val().locationAddress);
    //                col3.append(snapReq.val().creationDate);

    //                RatRef.child(snapReq.val().rate).once("value", snapRat => {
    //                    col6.append(snapRat.val().message);
    //                    col7.append(snapRat.val().numberOfStars);
    //                });

    //            })

    //        }
    //        tableRow.append(col1);
    //        tableRow.append(col2);
    //        tableRow.append(col3);
    //        tableRow.append(col4);
    //        tableRow.append(col5);
    //        tableRow.append(col6);
    //        tableRow.append(col7);
    //        freeHistory.append(tableRow);
    //    });

    //})

})();
