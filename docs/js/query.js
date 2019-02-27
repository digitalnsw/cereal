




$( document ).ready(function() {

  var data = {
    "persons": {
       "parent1":{
          "is_guardian": {
              "2019-02": true
          },
          "active_kids__is_eligible": {"2019-02": null}
      },
      "child1": {
          "is_nsw_resident": {"2019-02":true},
          "is_enrolled_in_school": {"2019-02": true},
          "birth": {"ETERNITY": "2014-01-01"},
          "active_kids__child_meets_criteria": {"2019-02": null},
          "active_kids__voucher_amount": {"2019-02": "100"},
          "has_valid_medicare_card": {"2019-02": true}
      }
    },
    "families": {
        "family1": {
            "parents": ["parent1"],
            "children": ["child1"]
        }
    }
  
  };

  $("button").click(function(){
    $.ajax({
      url: "https://openfisca-nsw-staging.herokuapp.com/calculate",
      data : JSON.stringify(data),
      method: 'POST',
      contentType: 'application/json',
      success: function(result){
      $('#response').text(result);
        console.log(result)

    }});
  });
});