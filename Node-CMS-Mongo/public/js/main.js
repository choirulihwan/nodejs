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
   
});