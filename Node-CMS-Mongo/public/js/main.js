$(function(){
   //alert('test');
   if($('textarea#ta').length) {
       CKEDITOR.replace('ta');
   }
   
   $('a.confirmDeletion').on('click', function(){
      if (!confirm('Confirm deletion')){
          return false;
      } 
   });
   
   if ($('[data-fancybox]').length) {
       $('[data-fancybox]').fancybox();
   }
});

// slug
var slug = function(str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
    replace(/-+/g, '-').
    replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}

var number_format = function(e, locale) {
    let event = e || window.event;
    let target = event.target;    
    
    // var tmp = target.value.replace(/,/g, "");    
    var tmp = target.value.replace(/[^-,\d]/g, '');
    var val = Number(tmp).toLocaleString(locale);
    
    if (tmp == "") {
        target.value = "";
    } else {
        target.value = val;
    }       
}

var reset_number_format = function(e) {    
    var event = e || window.event;
    var target = event.target;
    var val = target.value.replace(/[,.]/g, "");
    target.value = val;    
}

var only_number = function(e) {
    var numericKeys = "0123456789"; 
    var event = e || window.event;
    
    if (event.charCode == 0) {
        return;
    }

    if (-1 == numericKeys.indexOf(event.key)) {
        // Could notify the user that 0-9 is only acceptable input.
        event.preventDefault();
        return;
    }
}

