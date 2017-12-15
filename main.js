$(function(){
    $(".app").hover(function(){
        // On mouse enter - set description to this description
        $("#description").text(this.dataset.desc);
    },function(){
        // On mouse exit - clear description
        $("#description").text("");
    });
});