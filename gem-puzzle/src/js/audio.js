function playSound(play) {

    const audio = document.querySelector('.audio');
    if (!audio) return;  
    audio.currentTime = 0;
    if(play){
      audio.play();
    }else{
      audio.pause();
    }
}