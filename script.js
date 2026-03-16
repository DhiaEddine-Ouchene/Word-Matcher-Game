

let cards = document.querySelectorAll(".game .outer .back") ;

let times = [] ;
cards.forEach(card=>card.addEventListener("click",function(){
    if (countRotated() == 2) {
        return
    } ;
    card.style.cssText = "transform : rotateY(180deg)" ;
    card.classList.add("rotated") ;
    if (countRotated() == 2 ){
        let rotatedElements = document.querySelectorAll(".rotated") ;
        if(searchKey(rotatedElements[0].getAttribute("word"))===searchKey(rotatedElements[1].getAttribute("word"))){
        clearTimeout(times.pop()) ; 
        clearTimeout(times.pop()) ;
        rotatedElements.forEach(ele=>{ele.classList.remove("rotated") ; ele.lastElementChild.classList.add("done")})
        return ;}
    }
    let  t =  setTimeout(()=> {card.style.cssText = "transform : none" ; card.classList.remove("rotated")} , 1300) ;
    times.push(t) ; 
}))


function countRotated(){
    let count = 0 ;
    cards.forEach(card => {if(card.classList.contains("rotated")) count++ ; if(count==2) return}) ;
    return count ;
}


let level1 = [["Hi", 0],["Hello",0],["example",1],["test",1],["false",2],["worng",2],["beautiful",3],["incrediable",3],["quick",4],["fast4",4]]

function searchKey(str) {
    let i = 0 ;
    while(i<level1.length){
        if(level1[i][0].toUpperCase() == str.toUpperCase()) return level1[i][1] ;
        i++ ;
    }
    return -1 ;
}


async function getData() {
    try{
        let response = await fetch("https://api.datamuse.com/words?rel_syn=blue") ;
        if(!response.ok) throw new Error("Failed to get Data")
        let data = await response.json() ;
        console.log(data) ;
    } catch(err){
        console.log(err.message) ;
    }
}
getData()


// cards.forEach(card => card.addEventListener("click" , function() {
//    let rotatedElements = document.querySelectorAll(".rotated")
//         console.log(rotatedElements[0].getAttribute("world")) }
// ))