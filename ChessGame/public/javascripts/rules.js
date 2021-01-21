function openFunction() {
    var x = document.getElementById("rules-container");
    if (x.style.display === "none") {
        x.style.display = "block";
    }else{
        x.style.display = "none";
    }
} 

function closeFunction() {
var x = document.getElementById("rules-container");
if (x.style.display === "block") {
    x.style.display = "none";
}
}
