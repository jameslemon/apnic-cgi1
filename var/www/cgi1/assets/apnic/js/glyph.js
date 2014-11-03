(function($,_){
    $(function(){
        // Set a random glyph
        var $body = $('body');
        var $glyph = $('#glyph');
        var colours = ["blue" , "darkgreen" , "lightgreen" , "orange" , "purple"];
        
        // Random colour by default, but some sections are themed a particular colour
        var custom_colours = $body.attr('data-theme-colour');
        if(typeof custom_colours !== typeof undefined && custom_colours !== false){
            colours = custom_colours.split(',');
        }
        var colour = _.sample(colours);
        var position = _.random(1, 5);
        var glyph_class = "glyph-" + colour + "-" + position;
        var body_class = "theme-" + colour;
        $glyph.addClass(glyph_class);
        $('body').removeClass('theme-blue theme-darkgreen theme-lightgreen theme-purple theme-orange').addClass(body_class);
    });
})(jQuery,_);
