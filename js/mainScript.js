let xCoordinate = document.querySelector(".x");
let yCoordinate = document.querySelector(".y");
let rOptions = document.querySelectorAll(".R");


function isNumber(s){
    let n = parseFloat(s.replace(',','.'));
    return !isNaN(n) && isFinite(n);
}


//функция для проверки наличия выбранной checkbox кнопки
function checkSelection(options) {
    for(let i=0; i<options.length; i++){
        if(options[i].checked) return true;
    }
    return false;
}

// проверка значения в поле на попадание в заданный диапазон
function validateField(coordinate,min,max){
    console.log(coordinate.value)
    if(coordinate.value){
        coordinate.value = coordinate.value.replace(',','.');
        if(coordinate.value<min || coordinate.value>max || !isNumber(coordinate.value)){
            return false;
        }
        else{
            return true;
        }
    }
    return false;
}

function getOptions(options){
    let answ = [];
    for(let i=0; i<options.length; i++){
        if(options[i].checked) answ.push(options[i].value);
    }
    return false;
}

function getOption(options){
    for(let i=0; i<options.length; i++){
        if(options[i].checked) return options[i].value;
    }
    return false;
}

// фунция для повторной проверки, что поля заполнены верно, чтобы передать их php скрипту
function validateAll(){
    return validateField(yCoordinate,-5,5)&&validateField(xCoordinate,-5,3) && checkSelection(rOptions);
}

$(document).ready(function(){
    $.ajax({
        url: 'php/load.php',
        method: "POST",
        dataType: "html",
        success: function(data){
            console.log(data);
            $("#result_table>tbody").html(data);
        },
        error: function(error){
            console.log(error);
        },
    })
})

$("#input-form").on("submit", function(event){
    event.preventDefault();

    console.log("Got data for check!" );
    console.log('x: ', xCoordinate.value);
    console.log('y: ', yCoordinate.value);
    console.log('r: ', getOptions(rOptions));

    if(!validateAll()){
        console.log("post canceled")
        let error = ""
        if (!validateField(xCoordinate,-5,3)) error+="X coordinate must be in [-5;3]!\n";
        if (!validateField(yCoordinate,-5,5)) error+="Y coordinate must be in [-5;5]!\n";
        if (!checkSelection(rOptions)) error+="One R value must be checked!";
        alert(error);

        return;
    }

    console.log("data sending...")
    console.log($(this).serialize());
    $.ajax({
        url: 'php/server.php',
        method: "POST",
        data: $(this).serialize() + "&timezone_offset_minutes=" + (new Date().getTimezoneOffset()==0?0:-new Date().getTimezoneOffset()),
        dataType: "html",

        success: function(data){
            console.log(data);
            $(".validate_button").attr("disabled", false);
            $("#result_table>tbody").html(data);
            // console.log(xCoordinate.value/getOption(rOptions) + " "+ yCoordinate.value/getOption(rOptions))
            $("#circle").attr("cx",175 + 130*xCoordinate.value/getOption(rOptions) );   //175 175 - 0; 135 -Ry
            $("#circle").attr("cy",175 - 130*yCoordinate.value/getOption(rOptions) );
        },
        error: function(error){
            alert(error);
            $(".validate_button").attr("disabled", false);
        },
    })
});

$(".reset_button").on("click",function(){
    $.ajax({
        url: 'php/clear.php',
        method: "POST",
        dataType: "html",
        success: function(data){
            $("#result_table>tbody").html(data);
        },
        error: function(error){
            console.log(error);
        },
    })
})