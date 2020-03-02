var freelancerId = localStorage.getItem("freelancerId");
const cmRefspcific = dbRef.child('Workers/' + freelancerId);
readpendingData();
function readpendingData() {
    const freelancerImage = document.getElementById("freelancerImage"),
        freelancerName = document.getElementById("freelancerName"),
        freelancerPhone = document.getElementById("freelancerPhone"),
        freelancerEmail = document.getElementById("freelancerEmail"),
        freelancerState = document.getElementById("freelancerState"),
        freelancerCategory = document.getElementById("freelancerCategory"),
        freelancerCountry = document.getElementById("freelancerCountry"),
        freelancerCity = document.getElementById("freelancerCity"),
        freelancerAddress = document.getElementById("freelancerAddress");

    cmRefspcific.once("value", snap => {
        //get customer infromation for Request
        catRef.child(snap.val().workerCategoryid).once("value", snap => {
            freelancerCategory.textContent = snap.val().categoryName;
        });
        if (!snap.val().workerPhoto) {
            freelancerImage.src = "../img/logo.jpg";
        } else {
            freelancerImage.src = snap.val().workerPhoto;
        }

        freelancerName.textContent = snap.val().workerNameInEnglish;
        freelancerPhone.textContent = snap.val().workerPhone;
        freelancerEmail.textContent = snap.val().workerEmail;
        if (snap.val().workerStatusActivation === true) {
            freelancerState.textContent = "Active";
        } else {
            freelancerState.textContent = "Deactive";
        }

        freelancerCountry.textContent = snap.val().workerLocation.country;
        freelancerCity.textContent = snap.val().workerLocation.city;
        freelancerAddress.textContent = snap.val().workerLocationAdress;
    });


    var freeHistory = document.getElementById("free-list");
    customerConnectionFreelacner.once("value", snap => {
        
        snap.forEach(snapChild => {
            var tableRow = document.createElement("tr");
            var col1 = document.createElement("td");
            var col2 = document.createElement("td");
            var col3 = document.createElement("td");
            var col4 = document.createElement("td");
            var col5 = document.createElement("td");
            var col6 = document.createElement("td");
            var col7 = document.createElement("td");
            if (snapChild.val().freelancerId === freelancerId) {
                cusRef.child(snapChild.val().customerId).once("value", snapCus => {
                    col1.append(snapCus.val().userName);
                    col2.append(snapCus.val().userPhoneNumber);
                });

                requestRef.child(snapChild.val().requestId).once("value", snapReq => {
                    col5.append(snapReq.val().state);
                    col4.append(snapReq.val().locationAddress);
                    col3.append(snapReq.val().creationDate);

                    RatRef.child(snapReq.val().rate).once("value", snapRat => {
                        col6.append(snapRat.val().message);
                        col7.append(snapRat.val().numberOfStars);
                    });

                })
                tableRow.append(col1);
                tableRow.append(col2);
                tableRow.append(col3);
                tableRow.append(col4);
                tableRow.append(col5);
                tableRow.append(col6);
                tableRow.append(col7);
                freeHistory.append(tableRow);
            }
           
        });
        
    })

}
