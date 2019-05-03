$( "#clearBtn" ).click(function() {
  $(".formRow").hide();
  $( ".calculationsCheckbox" ).prop( "checked", false );
  return false;
});
openfisca_this_month = function() {
  function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }
  return  openfisca_this_year() + '-' + pad(new Date().getMonth() +1, 2);
}

openfisca_this_year = function() {
  return new Date().getFullYear();
}



$( document ).ready(function() $('#').hide();
});
