async function getWords() {
    try{
        let response = await fetch("../synonyms_1000.json") ;
        if(!response.ok) throw new Error("Fail to get Words")
        let data = await response.json() ;
        return data ;
    }catch(err){
        console.log(err.message)
    }
}

async function getDef(word){
    try{
        let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`) ;
        if(!response.ok) throw new Error("Fail to get Definition")
        let data = await response.json() ;
        return data[0].meanings[0].definitions[0].definition ;
    }catch(err){
        console.log(err.message)
    }
}
export{getDef , getWords}