var requestId = localStorage.getItem("requestId");
var pageValue = localStorage.getItem("pageValue");
const requestRefWithID = dbRef.child('Requests/' + requestId);
const commentRefWithID = dbRef.child('Comments/' + requestId);

(function readpendingData() {

    const customerImage = document.getElementById("customerImage"),
        customerName = document.getElementById("customerName"),
        customerPhone = document.getElementById("customerPhone"),
        customerEmail = document.getElementById("customerEmail"),
        customerType = document.getElementById("customerType"),
        description = document.getElementById("description"),
        country = document.getElementById("country"),
        city = document.getElementById("city"),
        address = document.getElementById("address"),
        startDate = document.getElementById("startDate"),
        startTime = document.getElementById("startTime"),
        Category = document.getElementById("Category"),
        State = document.getElementById("State"),
        requestInfoImage = document.getElementsByClassName("req-info-img");

    requestRefWithID.once("value", snap => {
        //get customer infromation for Request
        cusRef.child(snap.val().customerId).once("value", snap => {
            if (!snap.val().userPhoto) {
                customerImage.src = "../img/defaultImage.png";
            } else {
                customerImage.src = snap.val().userPhoto;
            }

            customerName.textContent = snap.val().userName;
            customerPhone.textContent = snap.val().userPhoneNumber;
            customerEmail.textContent = snap.val().userEmail;
            customerType.textContent = snap.val().userType;
           
        });

        if (snap.hasChild("orderPhotos")) {
            snap.child("orderPhotos").forEach(childSnap => {
                var imageForInfoImage = document.createElement("img");
                imageForInfoImage.src = childSnap.val();
                requestInfoImage[0].append(imageForInfoImage);
            });
            requestInfoImage[0].style.display = "block";
        }

        //get category name for Request
        catRef.child(snap.val().categoryId).once("value", snap => {
            Category.textContent = snap.val().categoryName;
        });

        description.textContent = snap.val().orderDescription;
        country.textContent = snap.val().location.country;
        city.textContent = snap.val().location.city;
        address.textContent = snap.val().locationAddress;
        startDate.textContent = snap.val().creationDate;
        startTime.textContent = snap.val().creationTime;
        State.textContent = snap.val().state;
    });

    if (pageValue == "POST") {
        var postDiv = document.getElementById("postDiv");
        postDiv.style.display = "block";
        var postOfferList = document.getElementById("postOfferList");


        commentRefWithID.on("value", snap => {
            postOfferList.innerHTML = "";
            snap.forEach(element => {
                var tableRow = document.createElement("tr");
                var freelancerName = document.createElement("td");
                var freelancerPhone = document.createElement("td");
                var freelancerEmail = document.createElement("td");
                var freelancerOffer = document.createElement("td");
                var freelancerOperation = document.createElement("td");
                /***
                 **  <button class ="btn btn-warning" request_id="value" onclick="function()">CANCEL</button>
                 ***/
                let DeleteButton = document.createElement("button");
                DeleteButton.classList = "btn  btn-warning";
                DeleteButton.setAttribute("offer_id", element.key);
                DeleteButton.setAttribute("type", "button");
                DeleteButton.setAttribute("data-toggle", "modal");
                DeleteButton.setAttribute("data-target", "#confirmModel");
                DeleteButton.setAttribute("data-whatever", "cancel");
                DeleteButton.textContent = "Delete Offere";

                $('#confirmModel').on('show.bs.modal', function (event) {
                    var btnConfirm = document.getElementById("confirm-button");
                    var Comment_id = event.relatedTarget.getAttribute("offer_id");
                    var freelancerId = event.relatedTarget.getAttribute("freelancerId");
                    btnConfirm.onclick = function () {
                        saveHistory("DeleteComment", requestId + "/" + Comment_id, freelancerId);
                        firebase.database().ref("Comments/" + requestId + "/" + Comment_id).remove();
                    }

                });
                freelancerOperation.append(DeleteButton);
                freelancerOffer.innerHTML = element.val().comment + " $";
                cmRef.child(element.val().freelancerId).on("value", workerSnap => {
                    freelancerName.innerHTML = workerSnap.val().workerNameInEnglish;
                    freelancerPhone.innerHTML = workerSnap.val().workerPhone;
                    freelancerEmail.innerHTML = workerSnap.val().workerEmail;
                    DeleteButton.setAttribute("freelancerId", workerSnap.key);

                });
                tableRow.append(freelancerName);
                tableRow.append(freelancerPhone);
                tableRow.append(freelancerEmail);
                tableRow.append(freelancerOffer);
                tableRow.append(freelancerOperation);
                postOfferList.prepend(tableRow);
            });

        });

    }
})();
