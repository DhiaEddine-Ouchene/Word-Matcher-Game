import * as game from "./game.js";
import * as cst from "./constants.js";
import * as data from "./getData.js";
import * as sfx from "./sfx.js"
let step ;
let bestScore ;
let setings ;
if(localStorage.getItem("setings")){
  setings = JSON.parse(localStorage.getItem("setings"))
} else {
  setings = {soundEffects : true , music : true , difficulty : "medium"} ;
  localStorage.setItem("setings",JSON.stringify(setings)) ;
}
import "./ui.js";

if(window.localStorage.getItem("step")) {
step = JSON.parse(localStorage.getItem("step"))
} else {
step = {currentLevel : 1 , currentRank :1 , currentWord : 0} ;
localStorage.setItem("step",JSON.stringify(step))
}

if(localStorage.getItem("best-score")){
  bestScore = parseInt(localStorage.getItem("best-score")) ;
} else {
  bestScore = 0 ;
  localStorage.setItem("best-score",0) ;
}
document.querySelector(".High-score-box .High-score").innerHTML = bestScore ;





game.showLevel(step) ;
let firstclick = true ;
let start = document.querySelector(".btns .start");
// let SuccessGame = false; 
start.addEventListener("click", function () {
  sfx.playClick()

  sfx.playMusic(firstclick) ;
  firstclick = false ;

  // let gameTime = cst.ranks[`rank${step.currentRank}`]["time"][`${game.getDifficulty().toLocaleLowerCase()}`] ;
  // gameTime = gameTime.min*60000 + gameTime.sec*1000 ;
  game.showLevel(step) ;
  let cardsNbr = cst.ranks[`rank${step.currentRank}`].nbrCards;
  data.getWords().then((cards) => {
    game.initGame(
      cst.ranks[`rank${step.currentRank}`],
      game.randomizeCards(cards.slice(step.currentWord,step.currentWord + cardsNbr))
    );
    // game.blockStart(gameTime) ;
  });
  
  game.timeDecrement(cst.ranks[`rank${step.currentRank}`]["time"][`${game.getDifficulty().toLowerCase()}`].min,cst.ranks[`rank${step.currentRank}`]["time"][`${game.getDifficulty().toLowerCase()}`].sec,game.popup,step) ;
});


// let times = [] ;
// cards.forEach(card=>card.addEventListener("click",function(){
//     if (countRotated() == 2) {
//         return
//     } ;
//     card.style.cssText = "transform : rotateY(180deg)" ;
//     card.classList.add("rotated") ;
//     if (countRotated() == 2 ){
//         let rotatedElements = document.querySelectorAll(".rotated") ;
//         if(searchKey(rotatedElements[0].getAttribute("word"))===searchKey(rotatedElements[1].getAttribute("word"))){
//         clearTimeout(times.pop()) ;
//         clearTimeout(times.pop()) ;
//         rotatedElements.forEach(ele=>{ele.classList.remove("rotated") ; ele.lastElementChild.classList.add("done")})
//         return ;}
//     }
//     let  t =  setTimeout(()=> {card.style.cssText = "transform : none" ; card.classList.remove("rotated")} , 1300) ;
//     times.push(t) ;
// }))

// function countRotated(){
//     let count = 0 ;
//     cards.forEach(card => {if(card.classList.contains("rotated")) count++ ; if(count==2) return}) ;
//     return count ;
// }

// let level1 = [["Hi", 0],["Hello",0],["example",1],["test",1],["false",2],["worng",2],["beautiful",3],["incrediable",3],["quick",4],["fast4",4]]

// function searchKey(str) {
//     let i = 0 ;
//     while(i<level1.length){
//         if(level1[i][0].toUpperCase() == str.toUpperCase()) return level1[i][1] ;
//         i++ ;
//     }
//     return -1 ;
// }

// async function getData() {
//     try{
//         let response = await fetch("https://api.datamuse.com/words?rel_syn=blue") ;
//         if(!response.ok) throw new Error("Failed to get Data")
//         let data = await response.json() ;
//         console.log(data) ;
//     } catch(err){
//         console.log(err.message) ;
//     }
// }
