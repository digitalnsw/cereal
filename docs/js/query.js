

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