// Try because you never know when jquery might not be around
try{
    // When document is ready
    $(function() {


        // Make active colour stay lit on top level menu when hovering over child links
        $(".site-top-nav-level2").hover(
            function(){ // Mouse over
                $(this).parents('div:first').children('a:first').addClass('hover');
            },
            function(){ // Mouse leave
                $(this).parents('div:first').children('a:first').removeClass('hover');
            }
        );


        $('.ie8 [placeholder]').focus(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur().parents('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        })
    });

});



// Press J for Next K for Previous widget
(function(){

    var items = $("div.sub-page-link");
    
    if( items.length > 0 ){
    
        var keycodes = { J : "78" , N : "74" , P : "80" , K : "75" };
    
        $(document).keydown(function(e){
            if( $('input:focus').length == 0 ){  // So we don't bug someone filling in a form
                var keypressed = e.which;
   
                // If the user pressed a key we're intrested in 
                if( (keypressed == keycodes.J) || (keypressed  == keycodes.N) || 
                    (keypressed == keycodes.P) || (keypressed == keycodes.K)
                ){

                    // Assume J and N pressed by default, so we're going forward
                    var forward = true;  

                    // Check if we're going backwards
                    if( (keypressed == keycodes.P) || (keypressed == keycodes.K) ) {
                        forward = false;
                    }
        
                    var top_of_window = $(window).scrollTop();
                    var padding = 10;
    
                    items.each(function(index, item){
    
                        var top_of_item = $(item).offset().top;
    
                        // If we are going forward, and the top of the window is higher than the top of the item
                        if( forward && ( top_of_window + 50 < top_of_item) ){
                            $("html, body").stop().animate({ scrollTop: top_of_item });
                             return false;
                        }
                        // If we are going backwards, and the top of the window is higher than the top of the item
                        // .. and we're not at the last item
                        else if( !forward && ( top_of_window - 50 < top_of_item) && index != 0 ){
                             var top_of_previous_item = $(items[(index - 1)]).offset().top;
                             $("html, body").stop().animate({ scrollTop: top_of_previous_item });
                             return false;
                        }
                    });
                } 
            }
        }); 
        $('body').append('<div id="previous-next-key">Press <strong>J</strong> for next <strong>K</strong> for previous</div>');
        $('head').append('<style>#previous-next-key{position:fixed;bottom:7px;right:0;color:gray;width:15em;}#previous-next-key strong{color:#666;}@media (max-width: 1600px) {#previous-next-key{visibility:hidden;}}</style>');
    } 
}).call(this);


}catch(e){console.log(e)}


