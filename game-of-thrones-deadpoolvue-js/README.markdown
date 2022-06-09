# Game of Thrones Deadpool - Vue.js

A Pen created on CodePen.io. Original URL: [https://codepen.io/chasebank/pen/MRGYRO](https://codepen.io/chasebank/pen/MRGYRO).

### No-Spoiler version here: [codepen.io/chasebank/pen/zXePrK](zXePrK)

Browse through the main characters (still among the living), and mark your prediction for who will survive the whole series.

* 1 point if your prophecy holds true.
* 10 points extra credit (optional) if you correctly predict death AND the killer.

Data is persisted to your device via localStorage. Check back after each episode to see how your points stack up.

**Some info about how the game works and the dev**
Everything's powered by Vue.js (go vue!)

Data and progress is persisted through localStorage. So, unless you (or your memory-starved device) clears your browser data, you should be able to close and return to the game without issue.

Your saved predictions are compared with character's current status, which is stored inside the app (way toward the bottom, so reduce the chance of spoilers, plus there's a spoiler warning in the code). Originally this was stored in a Firebase database, but somehow I was burning up my daily quota, so I had to move that data into the app itself.

When entering a predicted killer's name, there's an auto-suggestion helper. Most of that data comes from the open-source [An API of Ice And Fire](https://github.com/joakimskoog/AnApiOfIceAndFire), which I combined with some custom "non-character" names (ie. Ghost, The Night King) that weren't included in that API.
