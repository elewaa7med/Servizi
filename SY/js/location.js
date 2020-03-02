(function () {
    const userListUI = document.getElementById("country-list");
    const countryOptionList = document.getElementById("listCountry");
    const countryOptionListSh = document.getElementById("listCountrySh");
    countersRef.once("value", snap => {
        if (!snap.hasChildren() || snap.hasChildren == "") {
            $("#spinnerLoadercountry").attr("style", "display:none");
            $("#countryEmptyTable").removeAttr("style");
            $("#countryEmptyTable td").removeAttr("style");
        } else {
            $("#spinnerLoadercountry").attr("style", "display:none");
        }
    });
    countersRef.on("child_added", snap => {
        var $li = document.createElement("tr"),
            countryNameAr = document.createElement("td"),
            operation = document.createElement("td"),
            countryNameEn = document.createElement("td"),
            editButton = document.createElement("button"),
            deleteButton = document.createElement("button");
        var dropdown =
            "<button class='btn btn-warning dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' >Action</button>"
            + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
            + "<a class='dropdown-item' location-key='" + snap.key + "' onclick='countryEditClicked(event)'>Edit</a>"
            + "<a class='dropdown-item' onclick='return deleteButtonClicked(event);' countryId='" + snap.key + "' style='cursor: pointer'>Delete</a> </div>";
       if(countryOptionList.innerHTML.trim() == "")
            countryOptionList.innerHTML = "<option selected disabled value=''>select country</option>"

        var option1 = document.createElement("option");
        var option2 = document.createElement("option");
        option1.setAttribute("value", snap.key);
        option1.setAttribute("class", "dropdown-item");
        option2.setAttribute("value", snap.key);
        option2.setAttribute("class", "dropdown-item");


        // edite button
        editButton.setAttribute("class", "btn btn-warning");
        editButton.textContent = "Edit";
        editButton.setAttribute("location-key", snap.key);
        editButton.addEventListener("click", countryEditClicked);
        // delete button
        deleteButton.setAttribute("class", "btn btn-warning");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("countryId", snap.key)
        deleteButton.addEventListener("click", deleteButtonClicked);
        snap.forEach(childSnap => {
            let key = childSnap.key,
                value = childSnap.val();
            if (key == "countryName") {
                countryNameEn.innerHTML = value;
                option1.innerHTML = value;
                option2.innerHTML = value;
            }
            if (key == "countryNameArabic") {
                countryNameAr.innerHTML = value;
            }
        });
        $li.id = snap.key;
        operation.innerHTML = dropdown;
        operation.append(editButton);
        operation.append(deleteButton);
        $li.append(countryNameEn);
        $li.append(countryNameAr);
        $li.append(operation);
        userListUI.append($li);
        countryOptionList.append(option2);
        countryOptionListSh.append(option1);
    });

    countersRef.on('child_changed', function (snapshot) {
        var tableRow = document.getElementById(snapshot.key);
        tableRow.children[0].textContent = snapshot.val().countryName;
        tableRow.children[1].textContent = snapshot.val().countryNameArabic;
    });
    countersRef.on("child_removed", function (snapshot) {
        document.getElementById(snapshot.key).remove();
    })
})();

var catid;

function countryEditClicked(e) {
    var CountryKey = e.target.getAttribute("location-key");
    var specificCountry = countersRef.child(CountryKey);
    specificCountry.once("value", snap => {
        $("#locationNameInEnglish").val(snap.val().countryName);
        $("#locationNameInArabic").val(snap.val().countryNameArabic);
    }).then(function () {
        $("#ModelLocHeader").text("Update Country Name");
        $("#loc-label-english").text("Country Name In English");
        $("#loc-label-arabic").text("Country Name In Arabic");
        $("#editelocation").text("Update Country");
        $("#editelocation").attr("location-id", CountryKey);
        $("#addUpdatelocation").modal("show");
    });
}

function cityEdit(e) {
    var specificCity = citysRef.child($("#listCountrySh").val() + "/" + e.target.getAttribute("cityId"));
    specificCity.once("value", snap => {
        $("#locationNameInEnglish").val(snap.val().cityName);
        $("#locationNameInArabic").val(snap.val().cityNameArabic);
    }).then(function () {
        $("#ModelLocHeader").text("Edit City");
        $("#loc-label-english").text("City Name In English");
        $("#loc-label-arabic").text("City Name In Arabic");
        $("#editelocation").text("update city");
        $("#editelocation").attr("cityId", e.target.getAttribute("cityId"));
        $("#addUpdatelocation").modal("show");
    });
}

function addLocationBtnClicked(value) {
    $("#ModelLocHeader").text("Add New Country");
    $("#loc-label-english").text("Country Name In English");
    $("#loc-label-arabic").text("Country Name In Arabic");
    $("#editelocation").text("Add Country");
    $("#addUpdatelocation").modal("show");
}

function addCityBtnClicked() {
    $("#ModelLocHeader").text("Add New City");
    $("#loc-label-english").text("City Name In English");
    $("#loc-label-arabic").text("City Name In Arabic");
    $("#editelocation").text("Add city");
    $("#divlistCountry").removeAttr("style");
    $("#addUpdatelocation").modal("show");

}


// --------------------------
// DELETE
// --------------------------
function deleteButtonClicked(e) {
    $("#ConfirmModal").modal("show");
    $("#btnConfirmDialog").click(function () {
        countersRef.child(e.target.getAttribute("countryId")).remove();
    });
    // var userID = e.target.getAttribute("userid");
    // const userRef = dbRef.child('Locations/Countries/' + userID);
    // userRef.remove();
}

function deletecity(e) {
    $("#ConfirmQuestion").text("Are you Sure Want To Delete This City !?");
    $("#ConfirmModal").modal("show");
    $("#btnConfirmDialog").click(function () {
        citysRef.child($("#listCountrySh").val() + '/' + e.target.getAttribute("cityId")).remove();
    });
}
selectFuncation("-LqVUFTcU5D9285r7oRT");
function selectFuncation(countryId) {
    if (countryId == null) {
        var countryId = document.getElementById("listCountrySh").value;
    }
    var cityInCountryRef = citysRef.child(countryId);
    const cityList = document.getElementById("city-list");
    cityList.innerHTML = '<tr id="cityEmptyTable" style="display: none;"><td colspan="6">No City Has Been Added To This Country Yet</td></tr><tr id="spinnerLoadercity"><td colspan="6"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></td></tr>'
    cityInCountryRef.once("value", snap => {
        if (!snap.hasChildren() || snap.hasChildren == "") {
            $("#spinnerLoadercity").attr("style", "display:none");
            $("#cityEmptyTable").removeAttr("style");
            $("#cityEmptyTable td").removeAttr("style");
        } else {
            $("#spinnerLoadercity").attr("style", "display:none");
        }
    });
    
    console.log(cityList.childNodes);
    cityInCountryRef.on("child_added", snap => {

        var $li = document.createElement("tr"),
            countryNameAr = document.createElement("td"),
            operation = document.createElement("td"),
            countryNameEn = document.createElement("td"),
            editButton = document.createElement("button"),
            deleteButton = document.createElement("button");
        var dropdown =
            "<button class='btn btn-warning dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' >Action</button>"
            + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>"
            + "<a class='dropdown-item' cityId='" + snap.key + "' onclick='cityEdit(event)'>Edit</a>"
            + "<a class='dropdown-item' onclick='return deletecity(event);' cityId='" + snap.key + "' style='cursor: pointer'>Delete</a> </div>";

        // edit icon
        editButton.setAttribute("class", "btn btn-warning");
        editButton.textContent = "Edit";
        editButton.setAttribute("cityId", snap.key);
        editButton.addEventListener("click", cityEdit);
        // delete icon
        deleteButton.setAttribute("cityId", snap.key);
        deleteButton.setAttribute("class", "btn btn-warning");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", deletecity);

        snap.forEach(childSnap => {
            var key = childSnap.key,
                value = childSnap.val();
            if (key == "cityName") {
                countryNameEn.innerHTML = value;
            }
            if (key == "cityNameArabic") {
                countryNameAr.innerHTML = value;
            }
        });
        $li.id = snap.key;
        operation.innerHTML += dropdown;
        operation.append(editButton);
        operation.append(deleteButton);

        $li.append(countryNameEn);
        $li.append(countryNameAr);
        $li.append(operation);
        cityList.append($li);
    });

    cityInCountryRef.on('child_changed', function (snapshot) {
        var tableRow = document.getElementById(snapshot.key);
        tableRow.children[0].textContent = snapshot.val().cityName;
        tableRow.children[1].textContent = snapshot.val().cityNameArabic;
    });

    cityInCountryRef.on("child_removed", function (snapshot) {
        document.getElementById(snapshot.key).remove();
    });
}


function checkInputValueEng(e) {
    var errorLocationNameEnglish = document.getElementById("errorLocationNameEnglish");
    if (e.target.value != "") {
        errorLocationNameEnglish.style.display = "none";
    }
}

function checkInputValueAra(e) {
    var errorLocationNameArabic = document.getElementById("errorLocationNameArabic");
    if (e.target.value != "") {
        errorLocationNameArabic.style.display = "none";
    }
}

function selectFuncationAddUpdate() {
    document.getElementById("errorLocationSelectMainCountry").style.display = "none"
}

function updateLoction(event) {
    var locationNameInEnglish = document.getElementById("locationNameInEnglish"),
        locationNameInArabic = document.getElementById("locationNameInArabic"),
        listCountry = document.getElementById("listCountry"),
        listCountrySh = document.getElementById("listCountrySh"),
        errorLocationNameEnglish = document.getElementById("errorLocationNameEnglish"),
        errorLocationNameArabic = document.getElementById("errorLocationNameArabic"),
        errorLocationSelectMainCountry = document.getElementById("errorLocationSelectMainCountry");
    errorLocationNameEnglish.style.display = "none";
    errorLocationNameArabic.style.display = "none";
    errorLocationSelectMainCountry.style.display = "none";

    if (event.target.textContent === "Add Country") {
        if (!locationNameInEnglish.value) {
            errorLocationNameEnglish.style.display = "block";
            errorLocationNameEnglish.textContent = "* Country Name In English Must Be Upload"
        }

        if (!locationNameInArabic.value) {
            errorLocationNameArabic.style.display = "block";
            errorLocationNameArabic.textContent = "* Country Name In Arabic Must Be Upload"
        }
        if (locationNameInEnglish.value && locationNameInArabic.value) {
            let newCountry = {
                "countryName": locationNameInEnglish.value,
                "countryNameArabic": locationNameInArabic.value,
            }
            countersRef.push(newCountry).then(function () {
                $("#addUpdatelocation").modal("hide");
            });
        }
    }

    if (event.target.textContent === "Update Country") {
        if (!locationNameInEnglish.value) {
            errorLocationNameEnglish.style.display = "block";
            errorLocationNameEnglish.textContent = "* Country Name In English Must Be Upload"
        }

        if (!locationNameInArabic.value) {
            errorLocationNameArabic.style.display = "block";
            errorLocationNameArabic.textContent = "* Country Name In Arabic Must Be Upload"
        }
        if (locationNameInEnglish.value && locationNameInArabic.value) {
            var specificlocation = countersRef.child(event.target.getAttribute("location-id"));
            specificlocation.update({
                "countryName": locationNameInEnglish.value,
                "countryNameArabic": locationNameInArabic.value,
            }).then(function () {
                $("#addUpdatelocation").modal("hide");
            });
        }
    }
    if (event.target.textContent === "Add city") {
        if (!listCountry.value || listCountry.value == "") {
            errorLocationSelectMainCountry.style.display = "block";
            errorLocationSelectMainCountry.textContent = "* Country must be selected"
        }

        if (!locationNameInEnglish.value) {
            errorLocationNameEnglish.style.display = "block";
            errorLocationNameEnglish.textContent = "* City Name In English Must Be Upload"
        }

        if (!locationNameInArabic.value) {
            errorLocationNameArabic.style.display = "block";
            errorLocationNameArabic.textContent = "* City Name In Arabic Must Be Upload"
        }
        if (locationNameInEnglish.value && locationNameInArabic.value && listCountry.value) {
            var specificlocation = citysRef.child(listCountry.value);
            specificlocation.push({
                "cityName": locationNameInEnglish.value,
                "cityNameArabic": locationNameInArabic.value,
            }).then(function () {
                $("#addUpdatelocation").modal("hide");
            });
        }
    }

    if (event.target.textContent === "update city") {
        if (!locationNameInEnglish.value) {
            errorLocationNameEnglish.style.display = "block";
            errorLocationNameEnglish.textContent = "* Country Name In English Must Be Upload"
        }

        if (!locationNameInArabic.value) {
            errorLocationNameArabic.style.display = "block";
            errorLocationNameArabic.textContent = "* Country Name In Arabic Must Be Upload"
        }
        if (locationNameInEnglish.value && locationNameInArabic.value) {
            var specificlocation = citysRef.child($("#listCountrySh").val() + "/" + event.target.getAttribute("cityId"));
            specificlocation.update({
                "cityName": locationNameInEnglish.value,
                "cityNameArabic": locationNameInArabic.value,
            }).then(function () {
                $("#addUpdatelocation").modal("hide");
            });
        }
    }
}


$('#addUpdatelocation').on('hide.bs.modal', function (e) {
    $("#locationNameInEnglish").val("");
    $("#locationNameInArabic").val("");
    $("#divlistCountry").attr("style", "display:none;");
    $("#errorLocationNameEnglish").attr("style", "display:none;");
    $("#errorLocationNameArabic").attr("style", "display:none;");
    $("#errorLocationSelectMainCountry").attr("style", "display:none;");
});