

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
        var eligible = result['persons']['parent1']['active_kids__is_eligible'][openfisca_this_month()];
        if (eligible) {
          $('#result_title').text('You are eligible for 1 or more vouchers');
        }
        else {
          $('#result_title').text("Based on what you've told us, you're not eligible for vouchers this year.");
        }
        $('#result').show();
    }});
  });


  if( $('#allform').length ){
    $.ajax({
      url: "https://openfisca-nsw-staging.herokuapp.com/variables",
      method: 'GET',
      contentType: 'application/json',
      success: function(result){
        //$("#allform pre").text(JSON.stringify(result, null, '\t'));
        $.each(result, function(i, item) {
            $("#allform table").prepend(
              '<tr class="formRow '+ i + '" style="display:none;">' +
              '<td><label for="'+ i + '">' + i + '</label></td>' +
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
        ]
    }


    $.each(all_form_data, function(i, item) {
        $("#whichpolicy").prepend(
          '<label class="au-control-input '+ i + '">' +
          '<input value="'+ i + '" class="au-control-input__input calculationsCheckbox" type="checkbox" name="calculations">' +
          '<span class="au-control-input__text">' + i + '</span>' +
          '</label>'
        );
    });

    $( ".calculationsCheckbox" ).click(function() {
      //alert(all_form_data[$(this).val()]);
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
      all_request_data();
      return false;
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

      var query_month = openfisca_this_month();
      var query_year = openfisca_this_year();
      var person1 = all_request_data.persons.person1;
      var val = null;

      $.each(all_form_data, function(i, item) {
        //add the calculations we want responses for to the person object
        person1[i] = {[query_month]: null};
        thisparent = i;

        item.forEach(function(entry) {
            val = $( "input[name='" + entry + "']").val();
            console.log(entry + ' is ' + val);
            person1[entry] = {[query_month]: val};
            //person1[entry][query_month] = val;
        });

      });
      $("pre").html(JSON.stringify(all_request_data, null, '\t'));

      $.ajax({
        url: "https://openfisca-nsw-staging.herokuapp.com/calculate",
        data : JSON.stringify(all_request_data),
        method: 'POST',
        contentType: 'application/json',
        success: function(result){
          $('#showResults').html("");
          $.each(all_form_data, function(i, item) {
            $('#showResults').append(
              '<p>' + i + ': ' + result["persons"]["person1"][i][query_month] + '</p>'
            );
          });
      }});



      return all_request_data;

    }

  }


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

  var query_month = openfisca_this_month();
  var query_year = openfisca_this_year();
  var parent1 = request_data.persons.parent1;
  var child1 = request_data.persons.child1;

  // Our input:
  parent1.is_guardian[query_month] = ($("input[name='applicantRelationship']:checked").val()=='yes');
  child1.birth.ETERNITY = $( "#datepicker" ).datepicker().val();
  child1.is_nsw_resident[query_month] = ($("input[name='childResidence']:checked").val()=='yes');
  child1.is_enrolled_in_school[query_month] = ($("input[name='childEducation']:checked").val()=='yes');
  child1.has_valid_medicare_card[query_month] = $('#child_has_medicare-0').is(':checked');
  // (note this variable is set for the whole year)
  child1.active_kids__already_issued_in_calendar_year[query_year] = $('#first_voucher-0').is(':checked');

  // The output we want from Open Fisca
  parent1.active_kids__is_eligible[query_month] = null;
  child1.age[query_month] = null;
  child1.active_kids__child_meets_criteria[query_month] = null;
  child1.active_kids__voucher_amount[query_month] = null;

  return request_data;
}

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


///////FORM MULTI PAGE NAVIGATION////////

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "inline";
    $('html, body').animate({ scrollTop: 0 }, 'smooth');
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    //document.getElementById("nextBtn").innerHTML = "Submit";
    document.getElementById("nextBtn").style.display = "none";
    $('html, body').animate({ scrollTop: 0 }, 'smooth');
  // } else {
  //   document.getElementById("nextBtn").innerHTML = "Next";
  }
  // ... and run a function that displays the correct step indicator:
  //fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  //if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}


// function fixStepIndicator(n) {
//   // This function removes the "active" class of all steps...
//   var i, x = document.getElementsByClassName("step");
//   for (i = 0; i < x.length; i++) {
//     x[i].className = x[i].className.replace(" active", "");
//   }
//   //... and adds the "active" class to the current step:
//   x[n].className += " active";
// }
