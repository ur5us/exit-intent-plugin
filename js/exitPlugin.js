
(function($){
    //$.fn.extend({ 
        var globalSettings;
        var nbAppeared=0;
        var maxAppearence;


        var methods = {
            
            init : function(option) {
                globalSettings = $.extend({}, {
                 'location'         : 'center',
                 'animation-in'     : 'show',
                 'animation-out'    : 'hide',
                 'speed'            : 'normal',
                 'overlayColor'     : '#ff3399',
                 'overlayOpacity'   : '0.5',
                 'nbTimepopupCanApear':1,
                 'cookieLife'       :30,
                 'width'            : '800',
                 'height'           : '200',
                 'exitWindow'      :'medium'
                 }, option);

                 var justAppeared=false;
                 var lastmousex=-1;
                 var lastmousey=-1;
                 var lastmousetime;
                 var mousetravel = 0;
                 var pageWidth = $(window).width();
                 var pageheight = $(window).height();
                 var yOffset= $(window).scrollTop();

                 var mousey, mousex;
                 maxAppearence=parseInt(globalSettings['nbTimepopupCanApear'],10);

                 var overlayId=this;
                $(overlayId).hide();

                 changePosision();
                 colorOverlay();
                 createCookie();

                 var exitWindow=resizeExitWindow();



               if(nbAppeared<=maxAppearence){



                    $(document).mousemove(function(e) {
                        mousex = e.pageX;
                        mousey = e.pageY;

                        if (lastmousex > -1)
                            mousetravel = Math.max( Math.abs(mousex-lastmousex), Math.abs(mousey-lastmousey) );

                        lastmousex = mousex;
                        lastmousey = mousey;
                    });

                    $(document).on("mouseleave", function(){
                        var yOffset = $(window).scrollTop();
                        
                       if((mousey < yOffset+20 && mousetravel > 9  && mousex<exitWindow) || (mousey <yOffset+20 && mousetravel > 9  && mousex >pageWidth-exitWindow)) {
                            if(justAppeared===false){
                                updateCookie();
                                justAppeared=true;
                                showOverlay(overlayId);
                            }
                       }
                    });
                
                    $("#closeExitIntentOverlay").on("click", function(){
                            hideOverlay(overlayId);
                            return false;
                    });

                    // screen resising-----------------------

                    $(window).bind("resize", function(){
                        changePosision();
                        colorOverlay();
                        resizeExitWindow();
                    });

                }

                


            },
            show : function(animationType,animationSpeed) {
                 var overlayId=this;
                 if(animationType){globalSettings['animation-in']=animationType;}
                 if(animationSpeed){globalSettings['speed']=animationSpeed;}
                 showOverlay(overlayId);

            },
            hide : function(animationType,animationSpeed) {
                var overlayId=this;
                 if(animationType){globalSettings['animation-out']=animationType;}
                 if(animationSpeed){globalSettings['speed']=animationSpeed;}
                hideOverlay(overlayId);
             },
            setPosition : function(newPosition) {
                if(newPosition){globalSettings['location']=newPosition;}
                changePosision();
             },
            colorTheOverlay : function(newColor,newAlpha) {
                if(newColor){globalSettings['overlayColor']=newColor;}
                if(newAlpha){globalSettings['overlayOpacity']=newAlpha;}
                colorOverlay();
             },
            checkCookies : function( ) {
                updateCookie();
             },
             resetCookie : function() {
                deleteCookieFunction();
                createCookie();
             },
             screenResize : function() {
                changePosision();
                colorOverlay();
                resizeExitWindow();
             }
        };


        function showOverlay(overlayId){
            if(isNaN(parseInt(globalSettings["speed"],10))){
              if(globalSettings["animation-in"]=='show'){$(overlayId).show(globalSettings["speed"]);}
              else if(globalSettings["animation-in"]=='fadeIn'){$(overlayId).fadeIn(globalSettings["speed"]);}
            }else{
                if(globalSettings["animation-in"]=='show'){$(overlayId).show(parseInt(globalSettings["speed"],10));}
              else if(globalSettings["animation-in"]=='fadeIn'){$(overlayId).fadeIn(parseInt(globalSettings["speed"],10));}
            }
        }

        function hideOverlay(overlayId){
            if(isNaN(parseInt(globalSettings["speed"],10))){
              if(globalSettings["animation-out"]=='hide'){$(overlayId).hide(globalSettings["speed"]);}
              else if(globalSettings["animation-out"]=='fadeOut'){$(overlayId).fadeOut(globalSettings["speed"]);}
            }else{
                if(globalSettings["animation-out"]=='hide'){$(overlayId).hide(parseInt(globalSettings["speed"],10));}
              else if(globalSettings["animation-out"]=='fadeOut'){$(overlayId).fadeOut(parseInt(globalSettings["speed"],10));}
            }
            
            $(overlayId).animate({opacity:0});
        }

        function colorOverlay(){
            $('.overlayContent').css('position','fixed');
            $("#overlay").css({
                    "position" : "fixed",
                    "left" : 0,
                    "top" : 0
                });
            $("#overlay").css('width', '100%');
            $("#overlay").css('height', '100%');
            if(globalSettings["overlayColor"]!='none'){
                $("#overlay").css('background', globalSettings["overlayColor"]);
                $("#overlay").css('opacity', globalSettings["overlayOpacity"]);
            }
        }


        function changePosision(){
            var imageHeight = globalSettings['height'];
            var imageWidth = globalSettings['width'];
            pageWidth = $(window).width();
            pageHeight = $(window).height();

            if(globalSettings["location"]=="center")  {
                $(".overlayContent").css({
                    "position" : "absolute",
                    "left" : pageWidth / 2 - imageWidth / 2,
                    "top" : pageHeight /2 - imageHeight / 2
                });
            }
            else if (globalSettings["location"]=="top"){
                $(".overlayContent").css({
                    "position" : "absolute",
                    "left" : pageWidth / 2 - imageWidth / 2,
                    "top" : 0
                });
            }
             else if (globalSettings["location"]=="right"){
                $(".overlayContent").css({
                    "position" : "absolute",
                    "left" : pageWidth - imageWidth,
                    "top" : pageHeight /2 - imageHeight / 2
                });
            }
             else if (globalSettings["location"]=="bottom"){
                $(".overlayContent").css({
                    "position" : "absolute",
                    "left" : pageWidth / 2 - imageWidth / 2,
                    "top" : pageHeight - imageHeight
                });
            }
             else if (globalSettings["location"]=="left"){
                $(".overlayContent").css({
                    "position" : "absolute",
                    "left" : 0,
                    "top" : pageHeight /2 - imageHeight / 2
                });
            }

        }

        function updateCookie(){
            $.cookie.raw = true;
            if(!$.cookie('exit-intent-cookie')){
                 createCookie();
            }else{
                nbAppeared+=1;
                deleteCookieFunction();
                $.cookie('exit-intent-cookie', nbAppeared, { expires: globalSettings['cookieLife'], path: '/' });
            }
        }

        function createCookie(){
            $.cookie.raw = true;
            if(!$.cookie('exit-intent-cookie')){
                 $.cookie('exit-intent-cookie', 1, { expires: globalSettings['cookieLife'], path: '/' });
                 nbAppeared=1;
            }else{
                nbAppeared= parseInt($.cookie('exit-intent-cookie'),10);
                return;
            }
        }

        function deleteCookieFunction(){
            if($.cookie('exit-intent-cookie')){
                $.cookie("exit-intent-cookie", null);
            }else{
                return;
            }
        }

        function resizeExitWindow(){
            var tempNumber;
            if(globalSettings['exitWindow']=='tiny'){tempNumber=parseInt(pageWidth/12,10);}
            else if(globalSettings['exitWindow']=='small'){tempNumber=parseInt(pageWidth/6,10);}
            else if(globalSettings['exitWindow']=='medium'){tempNumber=parseInt(pageWidth/3,10);}
            else if (globalSettings['exitWindow']=='large'){tempNumber=parseInt(pageWidth/2,10);}
            return tempNumber;
        }


     $.fn.exit_intent = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
             return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
             return methods.init.apply( this, [method] );
        } else {
             $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }

    };

    //});
})(jQuery);