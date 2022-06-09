$ ->
  $document = $ (document)
  @$body = $document.find "body"  
    
# opening screen -----------------------------
  @$openingScreen = $document.find ".js-opening"
  @$playScreen = $document.find ".js-play"
  
  @$startButtonOS = @$openingScreen.find ".js-start"
  @$messageOS = @$openingScreen.find ".js-message"
  
  startButtonOS = =>
    @$startButtonOS.addClass "is-hidden"
    @$messageOS.removeClass "is-hidden"
    @$openingScreen.addClass "has-message"
  @$startButtonOS.on "click", => startButtonOS()
  
  @$continueButtonOS = @$openingScreen.find ".js-continue"
  @$continueButtonOS.on "click", =>
    @$openingScreen.addClass "is-hidden"
    @$playScreen.removeClass "is-hidden"
    @$openingScreen.removeClass "has-message"
    showDuelInfo()
 
# play screen -----------------------------  
  
  @$messagePS = @$playScreen.find ".js-message"
  @$duelButton = $document.find ".js-duel"
  @$drawButton = $document.find ".js-draw"
  @$sheriff = $document.find ".js-sheriff"
  @$opponent = $document.find ".js-opponent"
  @$resultPS = $document.find ".js-result"
  @result
  @$timer
  @dueling = false
  @level = 1
  @gameOver = false
  @noHonor = 1
  @totalTime = 0
  
  restart = =>
    # completely restarts game
    @level = 1
    @noHonor = 0
    @dueling = false
    @gameOver = false
    @totalTime = 0
    resetMessages()
    @$outroScreen.addClass "is-hidden"
    @$playScreen.addClass "is-hidden"
    @$openingScreen.removeClass "is-hidden"
    @$startButtonOS.removeClass "is-hidden"
    @$messageOS.addClass "is-hidden"
    @$body.removeClass "game-over"
    @$body.removeClass "game-end"
    @$sheriff.removeClass "is-dead"
    @$sheriff.removeClass "is-gone"
    
  death = =>
    @totalTime = 0
    @$opponent.addClass "is-shooting"
    @$sheriff.addClass "is-dead"
    setTimeout (=>
      @$sheriff.addClass "is-gone"
      @$opponent.removeClass "is-shooting"
      @$resultPS.html "Game Over"
      @$duelButton.removeClass "is-hidden"
      @level = 1
      @gameOver = true
      @$body.addClass "game-over"
      return
    ), 200
   
  win = =>
    @totalTime = @totalTime + @result
    @$sheriff.addClass "is-shooting"
    @$opponent.addClass "is-dead"
    @$resultPS.html("Justice served in " + @result.toFixed(3) + " seconds")
    @level++
    @$resultContinue.removeClass "is-hidden"
    setTimeout (=>
      @$sheriff.removeClass "is-shooting"
      @$sheriff.addClass "is-armed"
      return
    ), 200
    setTimeout (=>
      @$sheriff.removeClass "is-armed"
      return
    ), 1000
    
  @$resultContinue = $document.find ".js-result-continue"
  @$resultContinue .on "click", =>
    @$resultContinue.addClass "is-hidden"
    resetMessages()
    # if won the game
    if @level == 4
      enterOutro()
    # continue as normal
    else
      showDuelInfo()
  
  reset = =>
    # stops game if no reaction
    death()
    clearInterval @$timer
    @$duelButton.removeClass "is-hidden"
    @$drawButton.addClass "is-hidden"
    
  showDuelInfo = =>
    @$opponent.removeClass "is-armed"
    @$opponent.removeClass "is-dead"
    @$opponent.removeClass "opponent--1"
    @$opponent.removeClass "opponent--2"
    @$opponent.removeClass "opponent--3"
    @$opponent.addClass "opponent--" + @level
    switch @level
      when 3
        @$messagePS.html "Big Gilly Boulder craves the job of whippin' a squirt like you. He's a slick artist on the draw! Watch out"
      when 2
        @$messagePS.html "Name's Goldie Gaia. She runs the saloon even if she has to send you to the bone yard with your boots on."
      else
        @$messagePS.html "Pumpgun Ed ain't no man to monkey with. Yuh figure, this big fella lays yuh 'cross the hitch-rack an' fan yuh to a frazzle"
    @$duelButton.removeClass "is-hidden"
    
  resetMessages = =>
    @$messagePS.html ""
    @$resultPS.html ""   
    
  enterDuelMode = =>
    @$duelButton.addClass "is-hidden"
    @$drawButton.removeClass "is-hidden"
    resetMessages()
    @delay = (Math.floor(Math.random()*(6 -1)+1)) * 1000

    # start duel
    @$duel = setTimeout ( =>
      @dueling = true
      # style start
      @$opponent.addClass "is-armed"

      # start timer
      startTime = Date.now()
      @$timer = setInterval((=>
        elapsedTime = Date.now() - startTime
        # announce result
        @result = (elapsedTime / 1000)
        if @result > 2
          reset()
        return
      ), 10)
    ), @delay
    
    
  noHonor = =>
    # if clicked to early
    clearInterval @$duel
    @$duelButton.removeClass "is-hidden"
    @$drawButton.addClass "is-hidden"
    switch @noHonor
      when 1
        noHonorMessage = "You don't want to be too sudden with the trio. They gotta draw first."
        @noHonor++
      when 2
        noHonorMessage = "You're sure playin' with luck. Yuh best go an' rustle your blankets."
        @noHonor++
      else
        random = Math.floor(Math.random() * (4 - 1) ) + 1;
        switch random
          when 1
            noHonorMessage = "Mixin' it with some chance! An' this time o' day!"
          when 2
            noHonorMessage = "Happened kinda sudden, didn't yer?"
          else
            noHonorMessage = "What the devil! What fer kind of a thing shows no honour in a fast draw."   
    @$resultPS.html noHonorMessage     
   
  # Duel button
  @$duelButton.on "click", =>
    if @gameOver
      restart()
    else
      enterDuelMode()

# Draw button
  @$drawButton.on "click", =>
    if @dueling
      # good draw
      clearInterval @$timer
      @$opponent.removeClass "is-armed"
      @$drawButton.addClass "is-hidden"
      switch @level
        when 3
          if @result < 0.33
            win()
          else
            death()
        when 2
          if @result < 0.4
            win()
          else
            death()
        else
          if @result < 2
            win()
          else
            death()
    else
      # failed draw
      noHonor()
    @dueling = false
    
# Outro screen -----------------------------  
  @$outroScreen = $document.find ".js-outro"
  @$saveAndQuitButton = @$outroScreen.find ".js-save-and-quit"
  @$totalTime = @$outroScreen.find ".js-total-time"
  enterOutro = =>
    @$totalTime.html "Total time: " + @totalTime.toFixed(3) + "seconds"
    @$playScreen.addClass "is-hidden"
    @$outroScreen.removeClass "is-hidden"
    @$body.addClass "game-end"
    @$totalTime = 0
    
  @$saveAndQuitButton .on "click", =>
    restart()