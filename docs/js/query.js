

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

    var is_guardian = ($("input[name='applicantRelationship']:checked").val()=='yes');
    var is_enrolled_in_school = ($("input[name='childEducation']:checked").val()=='yes');
    var is_nsw_resident = ($("input[name='childResidence']:checked").val()=='yes');
    var active_kids__already_issued_in_calendar_year = $('#first_voucher-0').is(':checked');
    var child_has_medicare = $('#child_has_medicare-0').is(':checked');
    var birth = $( "#datepicker" ).datepicker().val();
     


    var data = {
      "persons": {
         "parent1":{
            "is_guardian": {
                "2019-02": is_guardian
            },
            "active_kids__is_eligible": {"2019-02": null}
        },
        "child1": {
            "is_nsw_resident": {"2019-02": is_nsw_resident},
            "is_enrolled_in_school": {"2019-02": is_enrolled_in_school},
            "birth": {"ETERNITY": birth},
            "active_kids__child_meets_criteria": {"2019-02": null},
            "active_kids__voucher_amount": {"2019-02": null},
            "has_valid_medicare_card": {"2019-02": child_has_medicare},
            "active_kids__already_issued_in_calendar_year": {"2019-02": active_kids__already_issued_in_calendar_year}
        }
      },
      "families": {
          "family1": {
              "parents": ["parent1"],
              "children": ["child1"]
          }
      }
    
    };

    $('#result').hide();
    $("#request").text(JSON.stringify(data, null, '\t'));
    
    $('#response').text('Fetching....');

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
