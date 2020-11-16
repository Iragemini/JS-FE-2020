function saveGame (user, moves, time, sizeGem, arr) {
    if(!localStorage.getItem("savedGame")){
        localStorage.setItem("savedGame", JSON.stringify([]));
    }
    let saveArr = JSON.parse(localStorage.getItem("savedGame"));
    saveArr.push({'user': user, 'time': time, 'sizeGem': sizeGem, 'moves': moves, 'arr': arr});
    localStorage.setItem("savedGame", JSON.stringify(saveArr));
}