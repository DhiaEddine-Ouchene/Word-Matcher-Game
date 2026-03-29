import * as cst from "./constants.js" ;
import * as game from "./game.js"
import * as sfx from "./sfx.js";
import * as data from "./getData.js"

//initialiation of setings
// let setingsParameters = JSON.parse(localStorage.getItem("setings")) ;
// document.querySelector(".toggels #sound-toggele").checked = setingsParameters.soundEffects ;
// document.querySelector(".toggels #music-toggele").checked = setingsParameters.music ;


let setingsBtns = document.querySelectorAll(".btn-setings");
let setings = document.querySelector(".setigns-drop-down") ;
let delSetings = document.querySelectorAll(" .delete")
setingsBtns.forEach(btn => {
    btn.addEventListener("click",function(){
    sfx.playClick() ;
    setings.style.display = "block" ;
    setings.style.opacity = "1" ;
    btn.firstElementChild.classList.add("animated")})


}) ;
delSetings.forEach(delBtn => delBtn.addEventListener("click",() => { sfx.playClick();setings.style.animation = " toTransparent .3s ease forwards" ; setTimeout(()=>{setings.style.cssText = ""},300) ;document.querySelector(".btn-setings .gear").classList.remove("animated")},200))

let deffLevels = document.querySelectorAll(".diff-levels span") ;
deffLevels.forEach(function(level){
    level.addEventListener("click",()=>{
        deffLevels.forEach(lev => lev.classList.remove("active")) ;
        level.classList.add("active")
    })
})


document.querySelector("header .btn-save").addEventListener("click",function(){
    let soundfx = document.querySelector(".sound #sound-toggele").checked ;
    let music = document.querySelector(".music #music-toggele").checked ;
    let difficulty = game.getDifficulty() ;
    localStorage.setItem("setings",JSON.stringify({soundEffects : soundfx , music : music , difficulty : difficulty})) ;
    setTimeout(()=>{   setings.style.animation = " toTransparent .3s ease forwards" ; setTimeout(()=>{setings.style.cssText = ""},300) ;document.querySelector(".btn-setings .gear").classList.remove("animated")},200)
    sfx.playClick() ;
})

document.querySelector(".footer .btn-close").addEventListener("click", function(){
    sfx.playClick();
    let setings = JSON.parse(localStorage.getItem("setings")) ;
    document.querySelector(".sound #sound-toggele").checked = setings.soundEffects ;
    document.querySelector(".music #music-toggele").checked = setings.music ;
    document.querySelectorAll(".diff-levels span").forEach(diffLevel => {
        if(diffLevel.innerHTML.trim()===setings.difficulty) {diffLevel.classList.add("active")}
        else{diffLevel.classList.remove("active")} ;
    })
})
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click" , function(){
        btn.classList.add("btn-animation")  ;
        setTimeout(()=>{
            btn.classList.remove("btn-animation")
        },200)
    })
})

document.querySelector(".btn-restart").addEventListener("click",function(){
    if(document.querySelector(".main-game .game").children.length === 0) return
    if(localStorage.getItem("step")){
        clearInterval(game.secs) ;
        clearInterval(game.bonusId)
        document.querySelector(".popup .stat-points span").innerHTML = "0"
        let points = document.querySelector(".score-box .score .points") ;
        points.innerHTML = 0 ;
         delete points.dataset.intervalId;
         delete points.dataset.targetScore;
        document.querySelector(".btns .start").click() ;
    }
})

document.querySelector(".to-dashbord").addEventListener("click", function(){
       document.querySelector(".popup").style.display = "none";
        document.querySelector(".popup-bg").style.display = "none";
})

// if(window.innerWidth <= 768){
//     let highScore = document.querySelector(".infos .High-score-box ") ;
//     highScore.remove() ;
//     document.querySelector(".difficulty").after(highScore)
// }

    let highScore = document.querySelector(".setigns-drop-down .High-score-box ") ;
    if(window.innerWidth> 768){
        if(document.querySelector(".setigns-drop-down").children.length === 5){
            highScore.remove() ;
            document.querySelector(".infos").appendChild(highScore) ;
        }}
        
window.addEventListener("resize",function(){
    if(window.innerWidth <= 768){
    let highScore = document.querySelector(".infos .High-score-box ") ;
    if(this.document.querySelector(".infos").children.length ===3){
    highScore.remove() ;
    document.querySelector(".difficulty").after(highScore)
     } 
    //  if(highScore) highScore.remove() ;
    // this.document.querySelector(".infos").appendChild(highScore) ;
    } else{
        let highScore = document.querySelector(".setigns-drop-down .High-score-box ") ;
        if(this.document.querySelector(".setigns-drop-down").children.length === 5){
            highScore.remove() ;
            this.document.querySelector(".infos").appendChild(highScore) ;
        }
    }})