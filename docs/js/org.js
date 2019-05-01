if( $('#orgform').length ){
  $.ajax({
    url: "https://openfisca-nsw-dev.herokuapp.com/variables",
    method: 'GET',
    contentType: 'application/json',
    success: function(result){
      //$("#allform pre").text(JSON.stringify(result, null, '\t'));
      $.each(result, function(i, item) {
          $("#orgform table").prepend(
            '<tr class="formRow '+ i + '" style="display:none;">' +
            '<td><small><label for="'+ i + '">' + i + '</label></small></td>' +
            '<td><input name="'+ i + '" class="au-text-input calculationsValue" type="text"></td>' +
            '</tr>'
          );
      });
    }
  });

  var all_form_data = {
      "art_union__game_meets_criteria": [
        "total_prize_value_of_all_prizes_from_gaming_activity",
        "gross_proceeds_from_gaming_activity",
        "is_art_union",
        "proceeds_to_benefitting_organisation"
      ],
      "draw_lottery__game_meets_criteria": [
        "gross_proceeds_from_gaming_activity",
        "proceeds_to_benefitting_organisation",
        "total_prize_value_of_all_prizes_from_gaming_activity",
        "is_not_for_profit",
        "is_charity"
      ],
      "guessing_competition__game_meets_criteria": [
        "is_charity",
        "is_not_for_profit",
        "total_prize_value_of_all_prizes_from_gaming_activity",
        "proceeds_to_benefitting_organisation",
        "gross_proceeds_from_gaming_activity"
      ],
      "no_draw_lottery__game_meets_criteria": [
        "is_charity",
        "is_not_for_profit",
        "total_prize_value_of_all_prizes_from_gaming_activity",
        "proceeds_to_benefitting_organisation",
        "gross_proceeds_from_gaming_activity",
        "number_of_tickets"
      ]
  }


  $.each(all_form_data, function(i, item) {
      $("#whichpolicy").prepend(
        '<label class="au-control-input '+ i + '">' +
        '<input value="'+ i + '" class="au-control-input__input calculationsCheckbox chk_'+ i + '" type="checkbox" name="calculations" >' +
        '<span class="au-control-input__text"><small>' + i + '</small></span>' +
        '</label>'
      );
  });

  $( ".calculationsCheckbox" ).click(function() {
    $.each(all_form_data[$(this).val()], function(i, item) {
      $("tr."+item).show();
    });
  });


  $( "#clearBtn" ).click(function() {
    $(".formRow").hide();
    $( ".calculationsCheckbox" ).prop( "checked", false );
    return false;
  });
  $( "#goBtn" ).click(function() {
    all_request_data(); return false;
  });


  all_request_data = function() {
    var all_request_data = {
        "persons": {
           "person1":{}
        },
        "families": {
            "family1": {
                "parents": ["person1"],
            }
        },
        "organisations": {
            "org1": {
            }
        }
    }

//    var query_month = openfisca_this_month(); var query_year = openfisca_this_year();
    var query_month = "2020-01"
    var org1 = all_request_data.organisations.org1;
    var val = null;

    $.each(all_form_data, function(i, item) {
      //add the calculations we want responses for to the person object
      if ($(".chk_" + i).is(':checked')){
        org1[i] = {[query_month]: null};
        thisparent = i;
        item.forEach(function(entry) {
            val = $( "input[name='" + entry + "']").val();
            org1[entry] = {[query_month]: val};
        });
      }
    });
    //$("pre").html(JSON.stringify(all_request_data, null, '\t'));

    $.ajax({
      url: "https://openfisca-nsw-dev.herokuapp.com/calculate",
      data : JSON.stringify(all_request_data),
      method: 'POST',
      contentType: 'application/json',
      success: function(result){
        $('#showResults').html("");
        $.each(all_form_data, function(i, item) {
          //alert(i);
          $('#showResults').append(
            '<tr><td><small>' + i + '</small></td><td><small><strong>' + result["organisations"]["org1"][i][query_month] + '</strong></small></td></tr>'
          );
        });
    }});



    return all_request_data;

  }

}
