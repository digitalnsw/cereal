if( $('#allform').length ){
  $.ajax({
    url: "https://openfisca-nsw-dev.herokuapp.com/variables",
    method: 'GET',
    contentType: 'application/json',
    success: function(result){
      //$("#allform pre").text(JSON.stringify(result, null, '\t'));
      $.each(result, function(i, item) {
          $("#allform table").prepend(
            '<tr class="formRow '+ i + '" style="display:none;">' +
            '<td><small><label for="'+ i + '">' + i + '</label></small></td>' +
            '<td><input name="'+ i + '" class="au-text-input calculationsValue" type="text"></td>' +
            '</tr>'
          );
      });
    }
  });

  var all_form_data = {
      "NRMA_free2go__is_eligible": [
         "birth",
         "is_nsw_resident",
         "is_act_resident",
         "NRMA_free2go__is_NRMA_member",
         "is_australian_citizen",
         "is_permanent_resident"
      ],
      "teenage_education_payments__youth_meets_payment_criteria": [
         "birth",
         "is_enrolled_in_school"
      ],
      "teenage_education_payments__adult_meets_payment_criteria": [
        "is_carer",
        "is_guardian",
        "is_carer_providing_short_term_placement",
        "is_respite_carer",
        "teenage_education_payments__is_family_tax_benefit_recipient_partA_youth15"
      ],
      "will_preparation_eligible_for_free_will_preparation": [
        "is_full_age_pension_recipient",
        "is_veterans_pension_recipient"
      ],
      "nsw_seniors_card_person_is_eligible": [
        "is_permanent_nsw_resident",
        "nsw_seniors_card_works_under_20hrs",
        "birth"
      ],
      "gold_seniors_opal_person_is_eligible": [
        "has_nsw_seniors_card",
        "has_act_seniors_card"
      ],
      "national_parks_seniors_person_is_eligible": [
        "has_any_seniors_card"
      ],
      "family_energy_rebate__person_meets_retail_criteria": [
        "is_nsw_resident",
        "is_energy_account_holder",
        "energy_provider_supply_customer",
        "is_family_tax_benefit_recipient"
      ],
      "family_energy_rebate__person_meets_supply_criteria": [
        "is_nsw_resident",
        "is_energy_account_holder",
        "energy_provider_supply_customer",
        "is_family_tax_benefit_recipient"
      ],
      "gas_rebate__person_meets_retail_criteria": [
        "is_nsw_resident",
        "is_energy_account_holder",
        "energy_provider_supply_customer",
        "energy_bottled_gas_user",
        "gas_rebate__already_issued_in_financial_year",
        "has_health_care_card",
        "has_department_human_services_pensioner_concession_card",
        "has_department_veteran_affairs_pensioner_concession_card",
        "has_department_veteran_affairs_gold_card"
      ],
      "StEPS__child_meets_criteria": [
        "StEPS__already_screened",
        "StEPS__child_is_joining_school",
        "birth"
      ],
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
        '<input value="'+ i + '" class="au-control-input__input calculationsCheckbox" type="checkbox" name="calculations">' +
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
        }
    }

    var query_month = openfisca_this_month(); var query_year = openfisca_this_year();
    var person1 = all_request_data.persons.person1;
    var val = null;

    $.each(all_form_data, function(i, item) {
      //add the calculations we want responses for to the person object
      person1[i] = {[query_month]: null};
      thisparent = i;

      item.forEach(function(entry) {
          val = $( "input[name='" + entry + "']").val();
          person1[entry] = {[query_month]: val};
      });

    });

    $.ajax({
      url: "https://openfisca-nsw-dev.herokuapp.com/calculate",
      data : JSON.stringify(all_request_data),
      method: 'POST',
      contentType: 'application/json',
      success: function(result){
        $('#showResults').html("");
        $.each(all_form_data, function(i, item) {
          $('#showResults').append(
            '<tr><td><small>' + i + '</small></td><td><small>' + result["persons"]["person1"][i][query_month] + '</small></td></tr>'
          );
        });
    }});



    return all_request_data;

  }

}
