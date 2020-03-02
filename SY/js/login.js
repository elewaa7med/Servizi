// Initialize Firebase
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
const usersRef = dbRef.child('Employees');
function readUserData() {
    var id = "";
    var txtname = document.getElementById("txtname");
    var txtpass = document.getElementById("txtpass");
    const databaseRef = firebase.database().ref().child('Employees');
    databaseRef.orderByChild("userName").equalTo(txtname.value).on("value", snap => {
        snap.forEach(childSnap => {
            let key = childSnap.key,
                value = childSnap.val();
            if (value.password == txtpass.value) {
                id = key;
                localStorage.setItem("userName", txtname.value);
                localStorage.setItem("userPassword", txtpass.value);
                localStorage.setItem("userType", value.type);
                window.location.href = "Orders.html?key=" + key + "&pre=" + value.type + "&name=" + value.name;
                
            }
        });
        if (id == "") {
            var noferro = document.getElementById("errorLogin");
            noferro.style.display = "block";
            noferro.innerText = "the password or user is Wrong";
        }
    });
}
/********************************** Start Press Enter Button make login ******************************/
var currentBoxNumber = 0;

$(".username").keyup(function (event) {
    if (event.keyCode == 13) {
        textboxes = $("input.username");
        currentBoxNumber = textboxes.index(this);
        if (textboxes[currentBoxNumber + 1] != null) {
            nextBox = textboxes[currentBoxNumber + 1];
            nextBox.focus();
        }
    }
});

$("#txtpass").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#btnlogin").click();
    }
});
/********************************** End Press Enter Button make login ******************************/


