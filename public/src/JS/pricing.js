$(function() {
  $("#sizingarea").draggable({ containment: "#sizeDesign", scroll: false }).resizable({containment: "#sizeDesign"});
});

function calculatePrice(){
  var shirts = parseInt($("#numOfShirts").val());
  var usesWhiteInk = $("#whiteInk").is(":checked");
  var doubleSided = $("#doubleSided").is(":checked");
  var justInk = $("#justInk").is(":checked");
  var isCircular = $("#circle").is(":checked");

  if(shirts < 1){
    swal("Oops!", "Enter a valid number of shirts", "error");
  }
  else if(shirts > 50){
    swal("Oops!", "We don't normally do orders that large", "error");
  }
  else if(!justInk && $("#selected p").length === 0){
    swal("Oops!", "Select a shirt type", "error");
  }
  else if(!justInk && !$('input:radio[name=material]').is(':checked')){
    swal("Oops!", "Select a material type", "error");
  }
  else{
    var price = 0.0;

    if(!justInk){
      var typeOfShirt = $("#selected p")[0].innerText;
      var materialType = $('input[name=material]:checked').val();

      //Add t-shirt costs
      if(typeOfShirt === "T-Shirt"){
        if(materialType === "cotton") price += 9;
        else if(materialType === "fiftyfifty") price += 9;
        else if(materialType === "triblend") price += 12;
      }
      else if(typeOfShirt === "Long Sleeve"){
        if(materialType == "cotton") price += 11;
        else if(materialType == "fiftyfifty") price += 12;
        else if(materialType == "triblend") price += 15;
      }
      else if(typeOfShirt === "Crew Neck"){
        if(materialType == "cotton") price += 13;
        else if(materialType == "fiftyfifty") price += 15;
        else if(materialType == "triblend") price += 26;
      }
      else if(typeOfShirt === "Hoodie"){
        if(materialType == "fiftyfifty") price += 14;
        else if(materialType == "triblend") price += 20;
      }

      price += calculateInkPrice(usesWhiteInk, isCircular);
      if(doubleSided){
        price += calculateInkPrice(usesWhiteInk, isCircular);
        price++;
      }
    }
    else{
      price = 3.0 + calculateInkPrice(usesWhiteInk, isCircular);
      if(doubleSided){
        price += 1 + calculateInkPrice(usesWhiteInk, isCircular);
      }
    }

    swal("Your shirt" + (shirts == 1 ? "" : "s") + " will cost approximately $" + Math.round(price * shirts));
  }
}

function selectShirt(i){
  if(!$("#justInk").is(":checked")){
    $(".shirtType").removeAttr('id');
    $(".shirtType").eq(i).attr('id', "selected");

    if(i == 3){
      $("#cotton").css({
        "filter": "blur(2px)",
        "cursor": "not-allowed"
      });
      $("#cotton").prop('disabled', true);
      $("#cotton").prop('checked', false);
    }
    else{
      $("#cotton").css({
        "filter": "blur(0)",
        "cursor": "default"
      });
      $("#cotton").prop('disabled', false);
    }
  }
}

function calculateInkPrice(usesWhiteInk, isCircular){
  var price = 0;
  var inkPrice = 7.0 / 22.0;

  if(usesWhiteInk){
    inkPrice = 1.25;
    price++;
  }

  var dpi_x = document.getElementById('dpi').offsetWidth;
  var dpi_y = document.getElementById('dpi').offsetHeight;

  var width = $("#sizingarea").width() / dpi_x;
  var height = $("#sizingarea").height() / dpi_y;

  if(isCircular){
    inkArea = 3.1415 * width / 2 * height / 2;
  }
  else{
    inkArea = width * height;
  }

  price += inkPrice * inkArea;
  return price;
}

$("#justInk").change(function(){
   if($(this).is(':checked')){
     $("#chooseShirt").addClass("disabled");
     $("#chooseMaterial").addClass("disabled");
   }
   else{
     $("#chooseShirt").removeClass("disabled");
     $("#chooseMaterial").removeClass("disabled");
   }
});

$("#circle").change(function(){
   if($(this).is(':checked')){
     $("#sizingarea").addClass("circle");
   }
   else{
     $("#sizingarea").removeClass("circle");
   }
});
