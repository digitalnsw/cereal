

$( document ).ready(function() {

  //DATEPICKER
  $( function() {
    $( "#datepicker" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
  } );

  $('#debug').hide();

  $('#show_debug').click(function(){
    $('#debug').toggle();
  });

  $("#run_query").click(function(){
    var data = request_data();

    // $("#request").text(JSON.stringify(data, null, '\t'));
    
    $('#response,#result_title').text('Asking Rules as Code to calculate....');

    $.ajax({
      url: "https://openfisca-nsw-staging.herokuapp.com/calculate",
      data : JSON.stringify(data),
      method: 'POST',
      contentType: 'application/json',
      success: function(result){
        $("#response").text(JSON.stringify(result, null, '\t'));
        var eligible = result['persons']['parent1']['active_kids__is_eligible']['2019-02'];
        if (eligible) {
          $('#result_title').text('You are eligible for 1 or more vouchers');
        }
        else {
          $('#result_title').text("Based on what you've told us, you're not eligible for vouchers this year.");
        }
        $('#result').show();
    }});
  });
});

request_data = function() {
  var request_data = {
      "persons": {
         "parent1":{
            "is_guardian": {},
            "active_kids__is_eligible": {}
        },
        "child1": {
            "is_nsw_resident": {},
            "is_enrolled_in_school": {},
            "birth": {},
            "age": {},
            "active_kids__child_meets_criteria": {},
            "active_kids__voucher_amount": {},
            "has_valid_medicare_card": {},
            "active_kids__already_issued_in_calendar_year": {}
          }
      },
      "families": {
          "family1": {
              "parents": ["parent1"],
              "children": ["child1"]
          }
      }
    
  }

  var query_date = openfisca_this_month();
  var parent1 = request_data.persons.parent1;
  var child1 = request_data.persons.child1;

  // Our input:
  parent1.is_guardian[query_date] = ($("input[name='applicantRelationship']:checked").val()=='yes');
  child1.birth.ETERNITY = $( "#datepicker" ).datepicker().val();
  child1.is_nsw_resident[query_date] = ($("input[name='childResidence']:checked").val()=='yes');
  child1.is_enrolled_in_school[query_date] = ($("input[name='childEducation']:checked").val()=='yes');
  child1.has_valid_medicare_card[query_date] = $('#child_has_medicare-0').is(':checked');
  child1.active_kids__already_issued_in_calendar_year[query_date] = $('#first_voucher-0').is(':checked');
  
  // The output we want from Open Fisca
  parent1.active_kids__is_eligible[query_date] = null;
  child1.age[query_date] = null;
  child1.active_kids__child_meets_criteria[query_date] = null;
  child1.active_kids__voucher_amount[query_date] = null;

  return request_data;
}

openfisca_this_month = function() {
  function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }
  return  new Date().getFullYear() + '-' + pad(new Date().getMonth() +1, 2);
}
