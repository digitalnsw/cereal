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
    ],
    "StEPS__child_meets_criteria": [
      "StEPS__already_screened",
      "StEPS__child_is_joining_school",
      "birth"
    ]
};

var request_data_structure = {
    "persons": {
       "person1":{}
    },
    "families": {
        "family1": {
            "parents": ["person1"],
        }
    }
}
var query_month = "2020-01";


if( $('#inputform').length ){
  $.ajax({
    url: "https://openfisca-nsw-dev.herokuapp.com/variables",
    method: 'GET',
    contentType: 'application/json',
    success: function(result){
      $.each(result, function(i, item) {
          $("#inputform table").prepend(
            '<tr class="formRow '+ i + '" style="display:none;">' +
            '<td><small><label for="'+ i + '">' + i + '</label></small></td>' +
            '<td><input name="'+ i + '" class="au-text-input calculationsValue" type="text"></td>' +
            '</tr>'
          );
      });
    }
  });

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


  $( "#goBtn" ).click(function() {
    all_request_data(); return false;
  });


  all_request_data = function() {
    var all_request_data = request_data_structure;
//    var query_month = openfisca_this_month(); var query_year = openfisca_this_year();
    var data_location = all_request_data.persons.person1;
    var val = null;

    $.each(all_form_data, function(i, item) {
      //add the calculations we want responses for to the person object
      if ($(".chk_" + i).is(':checked')){
        data_location[i] = {[query_month]: null};
        thisparent = i;
        item.forEach(function(entry) {
            val = $( "input[name='" + entry + "']").val();
            data_location[entry] = {[query_month]: val};
        });
      }
    });
    $("#package").html(JSON.stringify(all_request_data, null, '\t'));

    $.ajax({
      url: "https://openfisca-nsw-dev.herokuapp.com/calculate",
      data : JSON.stringify(all_request_data),
      method: 'POST',
      contentType: 'application/json',
      success: function(result){
        $('#showResults').html("");
        $("#response").html(result);
        $.each(all_form_data, function(i, item) {
          //alert(i);
          if($('.chk_'+i).is(":checked")){
            $('#showResults').append(
              '<tr><td><small>' + i + '</small></td><td><small><strong>' + result["persons"]["person1"][i][query_month] + '</strong></small></td></tr>'
            );
          }
        });
    }});



    return all_request_data;

  }

}
