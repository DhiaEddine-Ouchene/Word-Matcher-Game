import * as data from "./getData.js";
// import * as ui from "./ui.js";
import * as cst from "./constants.js";
import * as sfx from "./sfx.js";

// class Game{
//     constructor(rank,level,time,words,points){
//         this.time = time ;
//         this.words = words ;
//         this.points = points ;
//     } ;
//     setWords(){
//     }
//     flipCards(){
//         let gameBox = document.querySelector("main .game") ;
//         gameBox.setAttribute("data-fliped-cards",0) ;
//         let cards = document.querySelectorAll(".game .outer .back");
//         cards.forEach(card => {
//             card.addEventListener("click",function(){
//                 let flipedNbr = gameBox.getAttribute("data-fliped-cards") ;
//                 if( flipedNbr > 2) return ;
//                 gameBox.setAttribute("data-fliped-cards",++flipedNbr) ;
//                 card.style.cssText = "transform : rotateY(180deg)" ;
//                 card.classList.add("rotated") ;
//                 if(flipedNbr === 2){
//                     let rotatedElements = document.querySelectorAll(".rotated") ;
//                     if(rotatedElements[0].getAttribute("data-key")===rotatedElements[1].getAttribute("data-key")){
//                         rotatedElements[0].classList.add("Locked") ;
//                         rotatedElements[1].classList.add("Locked") ;
//                         let defCard = document.createElement("div") ;
//                         dones++ ;
//                         countPointsFlip(true,dones) ;
//                         defCard.className = "match-card" ;
//                         defCard.innerHTML = `<div class="words">
//                         <span>${rotatedElements[0].getAttribute("word")}</span>
//                         <i class="fa-solid fa-arrows-up-down fa-rotate-270"></i>
//                         <span>${rotatedElements[1].getAttribute("word")}</span>
//                         </div>
//                         <div class="info">
//                         <p class="def">${await data.getDef(rotatedElements[0].getAttribute("word"))}</p>
//                         <button class="more-btn">more<i class="fa-solid fa-angle-down"></i></button>
//                         </div>`
//                         defCardsBox.appendChild(defCard) ;

//                         clearTimeout(times.pop()) ;
//                         clearTimeout(times.pop()) ;
//                         rotatedElements.forEach(ele=>{ele.classList.remove("rotated") ; ele.lastElementChild.classList.add("done")}) ;
//                         return ;
//                     }
//                 }
//             })
//         })
//     }
// }
function initGame(rank, cards) {
  let gameGrid = document.querySelector(".main-game .game");
  gameGrid.innerHTML = "";
  let r = rank.gridRows ;
  let c = rank.gridCols ;
  if(window.innerWidth <= 768 ) [r,c]=[c,r] ;
  gameGrid.style.cssText = `grid-template-rows: repeat(${r} , 1fr) ; grid-template-columns:repeat(${c},1fr)`;
  for (let i = 0; i < rank.nbrCards; i++) {
    let card = document.createElement("div");
    card.className = "outer";
    card.innerHTML = `
            <div class="back" word=${cards[i].word} data-key=${cards[i]["data-key"]} data-flip="0">
              <span class="question-mark"
                ><i class="fa-regular fa-circle-question"></i
              ></span>
              <div class="face pulse">${cards[i].word}</div>
            </div>
          `;
    gameGrid.appendChild(card);
  }
  document.querySelector(".definition .matches").innerHTML = "";
  document.querySelector(".levels > p").innerHTML = ` Match <span class="rest-matches"></span>  pairs to reach the <br /> next level`
  cardsFlip();
}

function cardsFlip() {
  let gameBox = document.querySelector("main .game");
  gameBox.setAttribute("data-fliped-cards", 0);
  let restPairs = document.querySelector(".levels .rest-matches") ;
  let restPairsP = document.querySelector(".levels > p")
  let cards = document.querySelectorAll(".game .outer .back");
  let defCardsBox = document.querySelector(".definition .matches");
  let rotatedCards = [];
  let dones = 0; // stream of donnes
  restPairs.innerHTML = getCardsNbr() / 2 ;
  cards.forEach((card) =>
    card.addEventListener("click", async function () {
    if (card.classList.contains("Locked") || card.classList.contains("rotated")) return;
    
    let flipedNbr = +gameBox.getAttribute("data-fliped-cards");
    if (flipedNbr >= 2) return; // block any click beyond 2
    sfx.playFlip();                          // on every card click
    gameBox.setAttribute("data-fliped-cards", ++flipedNbr);
      if (flipedNbr <= 2) {
        let nbrFlips = card.getAttribute("data-flip");
        card.setAttribute("data-flip", ++nbrFlips);
        rotatedCards.push(card);
        card.style.cssText = "transform : rotateY(180deg)";
        card.classList.add("rotated");
        if (flipedNbr == 2) {
          // gameBox.style.cssText += "pointer-events: none";
          let rotatedElements = document.querySelectorAll(".rotated");

          if (
            rotatedElements[0].getAttribute("data-key") ===
            rotatedElements[1].getAttribute("data-key") 
          ) {
            rotatedCards = [];
            rotatedElements[0].classList.add("Locked");
            rotatedElements[1].classList.add("Locked");
            let defCard = document.createElement("div");
            dones++;
            countPointsFlip(true, dones);
            rotatedElements.forEach((ele) => {
              ele.classList.remove("rotated");
              ele.lastElementChild.classList.add("done");
              ele.lastElementChild.style.setProperty("--animationColor","#A3E635") ;
            });
            gameBox.setAttribute("data-fliped-cards", 0);
            flipedNbr = 0;
            if (dones === 3){dones = 0; sfx.playBonus(); } else {sfx.playMatch()} //3 sccssive true => initiat stream of donnes to 0
            let restMatchesNbr = parseInt(restPairs.innerHTML) ;
            if (restMatchesNbr - 1 === 0) {
              restPairsP.innerHTML = ""
            } else{
            restPairs.innerHTML = `${--restMatchesNbr} more`
            }
            defCard.className = "match-card";
            defCard.innerHTML = `<div class="words">
                <span>${rotatedElements[0].getAttribute("word")}</span>
                <i class="fa-solid fa-arrows-up-down fa-rotate-270"></i>
                <span>${rotatedElements[1].getAttribute("word")}</span>
                </div>
                <div class="info">
                <p class="def">${await data.getDef(rotatedElements[0].getAttribute("word"))}</p>
                    <button class="more-btn">more<i class="fa-solid fa-angle-down"></i></button>
                    </div>`;
            defCardsBox.appendChild(defCard);
            // setTimeout(()=>{rotatedCards.forEach(rCard =>{rCard.style.cssText="transform : none";rCard.classList.remove("rotated")}) ;} , 500) ;
            // gameBox.style.cssText += "pointer-events: all";
            return;
          }
          dones = 0;
          setTimeout(() => {
            rotatedCards.forEach((rCard) => {
              rCard.style.cssText = "transform : none";
              rCard.classList.remove("rotated");
            });
            // gameBox.style.cssText += "pointer-events: all";
            gameBox.setAttribute("data-fliped-cards", 0);
            flipedNbr = 0;
          }, 500);
          countPointsFlip(false, dones);
          sfx.playWrong();

        }
      }
    }),
  );



  function countRotated() {
    let count = 0;
    cards.forEach((card) => {
      if (card.classList.contains("rotated")) count++;
      if (count == 2) return;
    });
    return count;
  }
}

function countDone() {
  let cards = document.querySelectorAll(".game .outer .back");
  let count = 0;
  cards.forEach((card) => {
    if (card.classList.contains("Locked")) count++;
  });
  return count;
}

// function verifyLevel(rank){
// cards.forEach(card => card.addEventListener("click",function(){
//     if(countDone() == rank.nbrCards){
//     }

// }))
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
// getData()

// let gameTime ;
let secs ;
function timeDecrement(min, sec, callback,step) {
  let m = document.querySelector(".time .min");
  let s = document.querySelector(".time .sec"); 
  let startBtn =   document.querySelector(".btns .start") ;
  startBtn.style.cssText = "pointer-events : none" ;
  m.innerHTML = `0${min}`;
  s.innerHTML = sec < 10 ? `0${sec}` : sec;
  // let mins = setInterval(()=>{
  //     m.innerHTML-- ;
  //     if (mins = 0) clearInterval(mins) ;
  // },60000) ;
    secs = setInterval(() => {
    if (countDone() == getCardsNbr()) {
      clearInterval(secs);
      let defMin = min - m.innerHTML;
      let defSec = sec - s.innerHTML;
      if (defSec < 0) {
        defMin--;
        defSec += 60;
      }
      callback(defMin, defSec, min * 60 + sec,step);
      startBtn.style.cssText = "pointer-events : all" ;
    }
    if (s.innerHTML > 0) {
      s.innerHTML = s.innerHTML <= 10 ? `0${--s.innerHTML}` : --s.innerHTML;
      if (s.innerHTML <= 10 && m.innerHTML == 0) {
        document.querySelector(".time").style.color = "red";
      }
    } else {
      if (m.innerHTML > 0) {
        s.innerHTML = 59;
        m.innerHTML = `0${--m.innerHTML}`;
      } else {
        clearInterval(secs);
        callback(min, sec, min * 60 + sec,step);
        startBtn.style.cssText = "pointer-events : all" ;
      }
    }
  }, 1000);
}
function getCardsNbr() {
  let gamePlan = document.querySelector(".main-game .game");
  return gamePlan.children.length;
}

function popup(defmin, defSec, time ,step) {
  let popupBox = document.querySelector(".popup");
  let timeTaken = document.querySelector(".popup .stat-time span");
  let levelsBar = document.querySelector(".path .bar") ;
  let matches = document.querySelector(".popup .stat-matches span");
  // let gameScore = document.querySelector(".score-box .score .points");
  // let trueTime = defmin * 60 + defSec;
  levelsBar.style.width = `${(step.currentLevel/cst.totalLevels)*100}%` ;
  document.querySelector(".progress .title .level").innerHTML = `Level ${step.currentLevel} / ${cst.totalLevels}`
  timeTaken.innerHTML = `<span class="min">${"0" + defmin}</span>:<span class="sec" >${defSec < 10 ? "0" + defSec : defSec}</span>`;
  matches.innerHTML = `${countDone()}/${getCardsNbr()}`;
  document.querySelector(".popup-bg").style.display = "block";
  popupBox.style.display = "block";

  if (countDone() < getCardsNbr()) {
    popupBox.firstElementChild.firstElementChild.setAttribute(
      "src",
      "../assets/FailedGame.svg",
    );
    popupBox.firstElementChild.firstElementChild.style.cssText =
      "width : 4em ; margin-bottom : 1.4em";
    popupBox.firstElementChild.lastElementChild.innerHTML = "Game Over";
    popupBox.firstElementChild.lastElementChild.style.cssText =
      "color:red ;     text-shadow: 0 0 7px red";
    popupBox.lastElementChild.firstElementChild.innerHTML = `<i class="fa-solid fa-arrow-rotate-right"></i>Try Again`;
    popupBox.lastElementChild.firstElementChild.style =
      "display:flex ; align-items:center ; justify-content : center ; gap : 1em";
      nextGame(false,step) ;
    } else {
      popupBox.firstElementChild.lastElementChild.innerHTML = `LEVEL ${step.currentLevel <10 ? "0"+step.currentLevel : step.currentLevel} COMPLETE !`
      nextGame(true,step)
    }
    setPointComplete(time);
}

function getTime(rank) {
  let mins = document.querySelector(".time .min");
  let secs = document.querySelector(".time .sec");
  return +mins.innerHTML * 60 + +secs.innerHTML;
}
// console.log(getTime())
function getDifficulty() {
  return document.querySelector(".diff-levels .active").innerHTML;
}
// base : 100pts
// first : 300pts : second : 200pts
// false : -20 ;
// time :  1/4 :*2 ; 1/3*1.5 ; 1/2*1.25 ;
// dificulty : hard : *2 ; midium : *1.5 ;
let bonusId  ;
function addBonus(points, bonus) {
  let currentTarget = points.dataset.targetScore ? +points.dataset.targetScore : +points.innerHTML;
  let newTarget = currentTarget + bonus;
  points.dataset.targetScore = newTarget;

  if (points.dataset.intervalId) {
    clearInterval(points.dataset.intervalId);
  }

  bonusId = setInterval(() => {
    let current = +points.innerHTML;
    if (current < newTarget) {
      current = Math.min(current + 5, newTarget);
    } else if (current > newTarget) {
      current = Math.max(current - 5, newTarget);
    }
    points.innerHTML = current;
    
    if (current === newTarget) {
      clearInterval(bonusId);
      delete points.dataset.intervalId;
      delete points.dataset.targetScore;
    }
  }, 10);
  points.dataset.intervalId = bonusId;
}

function countPointsFlip(done, nbrDons) {
  let score = document.querySelector(".score-box .score ");
  
  let bonus;
  let points = document.querySelector(".score-box .score .points");
  let rotatedElements = document.querySelectorAll(".rotated");
  if (done) {
    if (
      rotatedElements[0].getAttribute("data-flip") == 1 &&
      rotatedElements[1].getAttribute("data-flip") == 1
    ) {
      bonus = 300;
    } else if (
      rotatedElements[0].getAttribute("data-flip") <= 2 &&
      rotatedElements[1].getAttribute("data-flip") <= 2
    ) {
      bonus = 200;
    } else {
      bonus = 100;
    }
    if (nbrDons === 3) {
      bonus *= 3;
      score.lastElementChild.classList.add("show-score");
      setTimeout(
        () => score.lastElementChild?.classList.remove("show-score"),
        800,
      );
      nbrDons == 0;
    }
    // points.innerHTML = +points.innerHTML + bonus ;
    addBonus(points, bonus);
  } else {
    // points.innerHTML = +points.innerHTML -20 ;
    let currentTarget = points.dataset.targetScore ? +points.dataset.targetScore : +points.innerHTML;
    if(currentTarget > 20)  addBonus(points, -20);
  }
}

function setPointComplete(gameTime) {
  let Popuppoints = document.querySelector(".popup .stat-points span");
  let points = document.querySelector(".score-box .score .points");
  let defFactor;
  switch (getDifficulty()) {
    //  easy medium hard
    case "Easy":
      defFactor = 0.75;
      break;
    case "Medium":
      defFactor = 1;
      break;
    case "Hard":
      defFactor = 1.5;
      break;
  }
  let trueTime = document.querySelector(".popup .stat-time span");
  trueTime =
    +trueTime.firstElementChild.innerHTML * 60 +
    +trueTime.lastElementChild.innerHTML;
  let bonusFacotr =
    trueTime <= gameTime / 4
      ? 2
      : trueTime <= gameTime / 3
        ? 1.5
        : trueTime <= gameTime / 2
          ? 1.25
          : 1;

  let finalScore = points.dataset.targetScore ? +points.dataset.targetScore : +points.innerHTML;
  Popuppoints.innerHTML = finalScore * bonusFacotr * defFactor;
  if(+localStorage.getItem("best-score")< +Popuppoints.innerHTML){ localStorage.setItem("best-score",Popuppoints.innerHTML) 
  document.querySelector(".High-score-box .High-score").innerHTML =  Popuppoints.innerHTML }
  document.querySelector(".score-box .score .points").innerHTML = finalScore;
}

 function nextGame(doneGame,step){
  let nextButton = document.querySelector(".btns .level") ;
  // let gameTime = cst.ranks[`rank${step.currentRank}`]["time"][`${getDifficulty().toLocaleLowerCase()}`] ;
  // gameTime = gameTime.min*60000 + gameTime.sec*1000 ;
  let startBtn =   document.querySelector(".btns .start") ;
    nextButton.onclick = function(){
      if(doneGame){
        step.currentWord += cst.ranks[`rank${step.currentRank}`].nbrCards ;
        step.currentLevel++ ;
        if (step.currentLevel > cst.ranks[`rank${step.currentRank}`].levelsNbr){
        step.currentLevel = 1 ;
        step.currentRank++ ;
        if(step.currentRank===5) {
          step.currentRank = 1 ;
          step.currentLevel =1 ;
          step.currentWord = 0 ;
        }
       }
      } else{
        document.querySelector(".popup").style.display = "none";
        document.querySelector(".popup-bg").style.display = "none";
        document.querySelector(".score-box .score .points").innerHTML = "0";
        document.querySelector(".time").style.color = " white  ";
        startBtn.click() ;
        return ;
      }
      document.querySelector(".time").style.color = " white";
      document.querySelector(".score-box .score .points").innerHTML = "0";
      document.querySelector(".popup").style.display = "none";
      document.querySelector(".popup-bg").style.display = "none";
      startBtn.click() ;
      localStorage.setItem("step",JSON.stringify(step)) ;
      // await data.getWords().then(cards => cards.slice(step.currentWord , step.currentWord+cst.ranks[`rank${step.currentRank}`].nbrCards)).then(cards => initGame(cst.ranks[`rank${step.currentRank}`],cards))
      // timeDecrement(cst.ranks[`rank${step.currentRank}`]["time"][`${game.getDifficulty().toLowerCase()}`].min,cst.ranks[`rank${step.currentRank}`]["time"][`${game.getDifficulty().toLowerCase()}`].sec,game.popup,step) ;
      // blockStart(gameTime) ;
    }
}

// function blockStart(time){
//   let startBtn =   document.querySelector(".btns ".start) ;
//   startBtn.style.cssText = "pointer-events : none" ;
//       setTimeout(() => {
//           startBtn.style.cssText = "pointer-events : all"  ;
//       }, time);
// }

  function randomizeCards(cards){
    for(let i  =0 ; i<cards.length ; i++){
      let pos = Math.trunc(Math.random()*100) % cards.length ;
      [cards[i],cards[pos]] = [cards[pos] , cards[i]] ;
    }
    return cards ;
  }
function showLevel(step){
    let level = document.querySelector(".col-2 .levels .game-stat h3") ;
    let rank = document.querySelector(".col-2 .levels .game-stat h2") ;
    let bar = document.querySelector(".path .progress-bar") ;
    level.innerHTML = `Level ${step.currentLevel < 10 ? "0"+step.currentLevel : step.currentLevel}` ;
    rank.innerHTML = `Rank ${step.currentRank < 10 ? "0"+step.currentRank : step.currentRank}` ;
    console.log(step.currentLevel)
    bar.style.width = `${(step.currentLevel/cst.ranks[`rank${step.currentRank}`].levelsNbr)*100}%`

}
function soundEnabled(){
  let setings = JSON.parse(localStorage.getItem("setings")) ;
  return setings.soundEffects ;
}
function musicEnabled(){
  let setings = JSON.parse(localStorage.getItem("setings")) ;
  return setings.music ; 
}
export { initGame, countDone, timeDecrement, popup ,getDifficulty , randomizeCards , showLevel ,soundEnabled , musicEnabled , secs , bonusId };
