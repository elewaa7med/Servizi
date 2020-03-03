var companyId = localStorage.getItem("companyId");
const comRefspcific = dbRef.child('Company/' + companyId);
readpendingData();
function readpendingData() {
    const companyImage = document.getElementById("companyImage"),
        companyName = document.getElementById("companyName"),
        companyPhone = document.getElementById("companyPhone"),
        companyEmail = document.getElementById("companyEmail"),
        companyState = document.getElementById("companyState"),
        companyCategory = document.getElementById("companyCategory"),
        companyCountry = document.getElementById("companyCountry"),
        companyCity = document.getElementById("companyCity"),
        companyAddress = document.getElementById("companyAddress");

    comRefspcific.once("value", snap => {
        //get customer infromation for Request
        var value = 0, 
        value1 = 0;
        for (var counter = 0; counter < snap.val().companyCategoryId.length; counter++) {
            catRef.child(snap.val().companyCategoryId[counter]).once("value", snap => {
                companyCategory.textContent += snap.val().categoryName + " , ";
            }).then(function () {
                value ++;
                if (value == snap.val().companyCategoryId.length) {
                    var index = companyCategory.textContent.lastIndexOf(",");
                    companyCategory.textContent = companyCategory.textContent.substring(0, index);
                }
            });
        }
        
        if (!snap.val().companyPhoto) {
            companyImage.src = "../img/logo.jpg";
        } else {
            companyImage.src = snap.val().companyPhoto;
        }

        companyName.textContent = snap.val().companyNameInEnglish;
        companyPhone.textContent = snap.val().companyPhone;
        companyEmail.textContent = snap.val().companyEmail;
        if (snap.val().companyStatusActivation === true) {
            companyState.textContent = "Active";
        } else {
            companyState.textContent = "Deactive";
        }
        countersRef.child(snap.val().companyLocation.countryId).once("value", snap => {
            companyCountry.textContent += snap.val().countryName;
        });

        for (var counter = 0; counter < snap.val().companyLocation.cityId.length; counter++) {
            citysRef.child(snap.val().companyLocation.countryId + "/" + snap.val().companyLocation.cityId[counter]).once("value", snap => {
                companyCity.textContent += snap.val().cityName + " , ";
            }).then(function () {
                value1++;
                if (value1 == snap.val().companyLocation.cityId.length) {
                    var index = companyCity.textContent.lastIndexOf(",");
                    companyCity.textContent = companyCity.textContent.substring(0, index);
                }
            });
        }
        companyAddress.textContent = snap.val().companyLocationAddress;
        $("#companyAttachment").attr("href", snap.val().companyAttachment)
    });


    var freeHistory = document.getElementById("free-list");
    // customerConnectionFreelacner.once("value", snap => {

    //     snap.forEach(snapChild => {
    //         var tableRow = document.createElement("tr");
    //         var col1 = document.createElement("td");
    //         var col2 = document.createElement("td");
    //         var col3 = document.createElement("td");
    //         var col4 = document.createElement("td");
    //         var col5 = document.createElement("td");
    //         var col6 = document.createElement("td");
    //         var col7 = document.createElement("td");
    //         if (snapChild.val().companyId === companyId) {
    //             cusRef.child(snapChild.val().customerId).once("value", snapCus => {
    //                 col1.append(snapCus.val().userName);
    //                 col2.append(snapCus.val().userPhoneNumber);
    //             });

    //             requestRef.child(snapChild.val().requestId).once("value", snapReq => {
    //                 col5.append(snapReq.val().state);
    //                 col4.append(snapReq.val().locationAddress);
    //                 col3.append(snapReq.val().creationDate);

    //                 RatRef.child(snapReq.val().rate).once("value", snapRat => {
    //                     col6.append(snapRat.val().message);
    //                     col7.append(snapRat.val().numberOfStars);
    //                 });

    //             })
    //             tableRow.append(col1);
    //             tableRow.append(col2);
    //             tableRow.append(col3);
    //             tableRow.append(col4);
    //             tableRow.append(col5);
    //             tableRow.append(col6);
    //             tableRow.append(col7);
    //             freeHistory.append(tableRow);
    //         }

    //     });

    // })

}
