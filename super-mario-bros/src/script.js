/*
  Burak Kaya
  Mario Box-Shadow
  http://burakkaya.com/lab/mario/
*/
$(function () {

            var roadXPos = 32;
            for (i = 0; i < 40; i++) {
                if ([(i * roadXPos) - 2] >= 638) {
                    $("#gameScreen").append('<div class="road" style="left:' + [((i - 20) * roadXPos) - 2] + 'px;bottom:32px;"></div>');
                } else {
                    $("#gameScreen").append('<div class="road" style="left:' + [(i * roadXPos) - 2] + 'px;"></div>');
                }
            }
			
			$("#sliderButton").toggle(function(){
				$(this).addClass("off").html("OFF");
				$("#gameScreen div:not(#sliderContainer)").addClass("disabled");
			},function(){
				$(this).removeClass("off").html("ON");
				$("#gameScreen div:not(#sliderContainer)").removeClass("disabled");
			})

});

    