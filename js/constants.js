const ranks = {
    rank1:{                   //45(12*7) + 160(10*16) + 180(8*20) + 94(24*4) 
        levelsNbr : 7 ,
        gridRows : 4 ,
        gridCols : 3 ,
        nbrCards : 12 , //12*7 + 10*16 + 8*20 + 3*24
        time : {
            easy : {min : 1 , sec : 0} , //60000,
            medium : {min : 0 , sec : 45} ,// 45000,
            hard : {min : 0 , sec : 30} ,
        }
    } ,
    rank2:{
        levelsNbr : 10 ,
        gridRows : 4 ,
        gridCols : 4 , 
        nbrCards : 16 ,
        time : {
            easy :{min : 1 , sec : 30} , //90000,
            medium : {min:1 , sec : 15},
            hard : {min :1 , sec : 0},
        }
    } ,
    rank3:{
        levelsNbr : 8 ,
        gridRows : 4 ,
        gridCols : 5 ,
        nbrCards : 20 ,
        time : {
            easy : {min : 1 , sec : 45},
            medium :{min : 1 , sec :30} , //90000,
            hard : {min : 1 , sec : 15},
        }
    } ,
    rank4:{
        levelsNbr : 4 ,
        gridRows : 4 ,
        gridCols : 6 ,
        nbrCards : 24 ,
        time : {
            easy : {min : 2 , sec :0},
            medium : {min : 1 , sec : 45},
            hard : {min : 1 ,sec : 30},
        }
    } 
}

const totalLevels = 39 ;
export{ranks , totalLevels} ;