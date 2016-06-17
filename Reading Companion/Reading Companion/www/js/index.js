// Global Variables
var jsonData = null;
var totalChapters = 0;
var chapterID = -1;
var questionID = -1;
var answerID = -1;
var currentScore = 0;
var deScore = 0;
var vScore = 0;
var evScore = 0;
var contextGrp = null;
var keyGrpLen = 0;
var ansKey = [];
var ansFlag = 0;
var ansFlag1 = 0;
var ansFlag2 = 0;
var correctAns = -1;
var selectedAnswer = -1;
var queFormat = -1;
var jsonObj = [];
var boolCheck = 0;



$(document).on('mobileinit', function () {
    // Override default jQuery Mobile settings
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
});


$(document).ready(function () {
    // Attach FastClick to disable 300ms touch delay
    FastClick.attach(document.body);

    // Disable touch scrolling on the home page
    $("#home_page").on('touchmove', function (ev) {
        ev.preventDefault();
    });

    // Disable touch scrolling on the questions page
    $("#questions_page").on('touchmove', function (ev) {
        ev.preventDefault();
    });

    $(document).on('deviceready', onDeviceReady);
    // document.addEventListener('deviceready', this.onDeviceReady, false);

});


function onDeviceReady() {
    // AJAX call to get JSON data containing the chapters and question	
    $.ajax({
        url: "../sample.json",
        dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    }).done(ajaxSuccess).fail(ajaxError);


}


function ajaxSuccess(data) {
    // Save the json data returned to the jsonData global variable
    jsonData = data;

    // Bind event listener to the start button if the JSON data is successfully saved
    if (jsonData != null) {
        $("#start_btn").on('click', addAllChapters);
    }

}


function ajaxError(error) {
    alert("Failed to get the chapters data");
}


function addAllChapters() {
  //  alert("In Chapters page ");
    // Reset all chapters in the list
    if ($("#chapters").children().length > 0) {
        $("#chapters li").remove();
    }

    // Get the total chapters from the chapters array and assign it to totalChapters global variable
    totalChapters = jsonData.book2.length;

    for (var i = 0; i < totalChapters; i++) {
        // Create a new list item containing each chapters
        var chapter = "<li><a href='#questions_page' class='chapter' id='" + i + "' data-transition='flip'>" + jsonData.book2[i].chapterId + "</a></li>";

        // Append each chapter to the chapters list
        $("#chapters").append(chapter);
    }

    // Attach click event listener to all added chapters
    $("#chapters li a.chapter").on('click', addAllQuestions);

    // Refresh the listview widget
    $("#chapters").listview().listview('refresh');
 //   alert("Chapters page over");
}


function addAllQuestions(ev) {
    answerID = -1;
    // Change the chapter title inside the <p> element
    $("#chapter").html(ev.currentTarget.innerHTML);

    // Reset all questions in the list
    if ($("#questions").children().length > 0) {
        $("#questions li").remove();
    }

    $("#questions").empty();

    // Get the selected chapter's ID and assign it to questionID global variable
    ChapterID = $(this).attr('id');
    questionID = $(this).attr('id');

 //   alert("In Questions page " + ChapterID + " " + questionID);

    // Get the total answers for the selected question
    var totalQuestions = jsonData.book2[questionID].questions.length;

    for (var i = 0; i < totalQuestions; i++) {
        // Create a new list item containing each answers
        var answer = "<li data-icon='false'><a href='#answers_page' class='answer' id='" + i + "' data-transition='flip'>" + jsonData.book2[questionID].questions[i].question + "</a></li>";

        // Append each answer to the answers list
        $("#questions").append(answer);
    }

    // Attach click event listener to all added questions
    $("#questions li a.answer").on('click', addAllAnswers);

    // Refresh the listview widget
    $("#questions").listview().listview('refresh');
 //   alert("Questions page over");

}

function addAllAnswers(ev) {
//    alert("Again entering answers page");
    boolCheck = 0;
    if (answerID == -1) {
        answerID = $(this).attr('id');
    }

    $("#answer1").html(ev.currentTarget.innerHTML);
    $("#answers_page h1 #MyHeaderID").text("Question: #" + (parseInt(answerID, 10) + 1));

    // Reset all questions in the list
    if ($("#answers").children().length > 0) {
        $("#answers li").remove();
    }
    $("#answers").empty();
    queFormat = jsonData.book2[questionID].questions[answerID].questionFormat;

    // Get the correct answer of the selected question
    correctAns = jsonData.book2[questionID].questions[answerID].answerId;
    contextGrp = jsonData.book2[questionID].questions[answerID].contextGroup;

    keyGrpLen = jsonData.book2[questionID].questions[answerID].keys1.length;
    for (var j = 0; j < keyGrpLen; j++) {
        ansKey[j] = jsonData.book2[questionID].questions[answerID].keys1[j];
    }

    if (queFormat == 1 || queFormat == 2) {
        // Get the total answers for the selected question
        var totalAnswers = jsonData.book2[questionID].questions[answerID].answers.length;
        for (var i = 0; i < totalAnswers; i++) {
            // Create a new list item containing each answers
            var answer1 = "<li data-icon='false'><a href='#answers_page' class='answer1' id='" + i + "' data-answer='" + correctAns + "' >" + jsonData.book2[questionID].questions[answerID].answers[i] + "</a></li>";
            // Append each answer to the answers list

            $("#answers").append(answer1);
        }

        if (queFormat == 2) {
            $("#answers").append('<br>');
            var label = document.createElement('label');
            label.textContent = "Please enter the first 3 words of the sentence that shows your answer is correct."
            $("#answers").append(label);
            var input = document.createElement('input');
            input.name = "sub1";
            input.type = "text";
            $("#answers").append(input);
        }
    } else if (queFormat == 3) {
        var input = document.createElement('input');
        input.name = "sub1";
        input.type = "text";
        $("#answers").append(input);
    } else if (queFormat == 4) {
        var input = document.createElement('input');
        input.name = "sub1";
        input.type = "text";
        $("#answers").append(input);
        $("#answers").append('<br>');
        $("#answers").append('<br>');
        var subQuestion = jsonData.book2[questionID].questions[answerID].subQuestion;
        $("#answers").append(subQuestion);

        var input1 = document.createElement('input');
        input1.name = "sub2";
        input1.type = "text";
        $("#answers").append(input1);
    }

    //   answerID = parseInt(answerID, 10) + 1;
    // Attach click event listener to all added questions
    $("#answers li a.answer1").on('click', testClick);
    $('.showNxtPage').on('click', nextQuestion);

    // Refresh the listview widget
    $("#answers").listview().listview('refresh');


}

function testClick() {
    selectedAnswer = $(this).attr('id');
}


function checkOption() {
    if (selectedAnswer == correctAns) {
        ansFlag1 = 1;
    }
}

function checkTextn(textName) {
    var text_value = $('input:text[name=' + textName + ']').val();
    for (var k = 0; k < ansKey.length; k++) {
        if (text_value.toLowerCase().indexOf(ansKey[k].toLowerCase()) >= 0) {
            ansFlag2 = 1;
        }
    }
}


function checkAnswer() {
    ansFlag = 0;
    ansFlag1 = 0;
    ansFlag2 = 0;
    deScore = 0;
    vScore = 0;
    evScore = 0;
    switch (queFormat) {
        case "1":
            checkOption();
            ansFlag = ansFlag1;
            break;
        case "2":
            checkOption();
            checkTextn("sub1");
            if (ansFlag1 == 1 && ansFlag2 == 1) {
                ansFlag = 1;
            }
            break;
        case "3":
            checkTextn("sub1");
            if (ansFlag2 == 1) {
                ansFlag = 1;
            }
            break;
        case "4":
            checkTextn("sub1");
            if (ansFlag2 == 1) {
                ansFlag2 = 0;
                checkTextn("sub2");
                if (ansFlag2 == 1) {
                    ansFlag = 1;
                }
            }
            break;
    }

    if (ansFlag == 1) {
        if (contextGrp == "7De") {
            deScore++;
            currentScore++;
            createJSON("7De", deScore);
        } else if (contextGrp == "7V") {
            vScore++;
            currentScore++;
            createJSON("7V", vScore);
        } else if (contextGrp == "7Ev") {
            evScore++;
            currentScore++;
            createJSON("7Ev", evScore);
        }

    }

    // Format the currentScore to percentage format (%)
    var formatedScore = currentScore;

    // Assign the formated currentScore to the span element containing the score
    $(".score").html(formatedScore + "%");

}


function nextQuestion(ev) {
    if (boolCheck == 0) {
        checkAnswer();
    }

    var totalQuestions = jsonData.book2[answerID].questions.length;
 //   alert(answerID + "total questions " + totalQuestions);
    if (parseInt(answerID, 10) == (parseInt(totalQuestions, 10) - 1)) {
        //if ($("#questions").length == 1) {
   //     alert("Questions over");
        boolCheck = 1;
        $("#chapters li a#" + questionID).closest('li').remove();

        $(":mobile-pagecontainer").pagecontainer('change', '#chapters_page', {
            transition: "flip",
            reverse: true
        });
   //     alert("Should not come here");
    } else {
        boolCheck = 0;
        answerID = parseInt(answerID, 10) + 1;
        $("#answer2").html(jsonData.book2[questionID].questions[answerID].question);
        $("#answers_next").empty();
        queFormat = jsonData.book2[questionID].questions[answerID].questionFormat;
     //   alert(answerID + "queFormat " + queFormat);

        // Get the correct answer of the selected question
        correctAns = jsonData.book2[questionID].questions[answerID].answerId;
        contextGrp = jsonData.book2[questionID].questions[answerID].contextGroup;

        keyGrpLen = jsonData.book2[questionID].questions[answerID].keys1.length;
        for (var j = 0; j < keyGrpLen; j++) {
            ansKey[j] = jsonData.book2[questionID].questions[answerID].keys1[j];
        }

        if (queFormat == 1 || queFormat == 2) {
            // Get the total answers for the selected question
            var totalAnswers = jsonData.book2[questionID].questions[answerID].answers.length;
            for (var i = 0; i < totalAnswers; i++) {
                // Create a new list item containing each answers
                var answer2 = "<li data-icon='false'><a href='#next_answers_page' class='answer2' id='" + i + "' data-answer='" + correctAns + "' >" + jsonData.book2[questionID].questions[answerID].answers[i] + "</a></li>";
                // Append each answer to the answers list

                $("#answers_next").append(answer2);
            }

            if (queFormat == 2) {
                $("#answers_next").append('<br>');
                var label = document.createElement('label');
                label.textContent = "Please enter the first 3 words of the sentence that shows your answer is correct."
                $("#answers_next").append(label);
                var input = document.createElement('input');
                input.type = "text";
                input.name = "sub1";
                $("#answers_next").append(input);
            }
        } else if (queFormat == 3) {
            var input = document.createElement('input');
            input.name = "sub1";
            input.type = "text";
            $("#answers_next").append(input);
        } else
            //switch (queFormat) {
            //    case "1":
            //        constructOptions();
            //        break;
            //    case "2":
            //        constructOptions();
            //        var txt = "Please enter the first 3 words of the sentence that shows your answer is correct."
            //        constructTextBoxes(txt);
            //        break;
            //    case 3:
            //        constructTextBoxes(null);
            //        break;
            //}
            if (queFormat == 4) {
                var input = document.createElement('input');
                input.name = "sub1";
                input.type = "text";
                $("#answers_next").append(input);
                $("#answers_next").append('<br>');
                $("#answers_next").append('<br>');
                var subQuestion = jsonData.book2[questionID].questions[answerID].subQuestion;
                $("#answers_next").append(subQuestion);

                var input1 = document.createElement('text');
                input1.name = "sub2";
                input1.type = "text";
                $("#answers_next").append(input1);
            }

        //   answerID = parseInt(answerID, 10) + 1;
        // Attach click event listener to all added questions
        $("#answers_next li a.answer2").on('click', testClick);
        $('.showNxtPage').on('click', nextQuestion);

        // Refresh the listview widget
        $("#answers_next").listview().listview('refresh');

    }
}

function createJSON(contextGrp, score) {
    //  $("input[class=output]").each(function () {
    item = {}
    var questionId = jsonData.book2[questionID].questions[answerID].queId;
    item["questionId"] = questionId;
    item["contextGrp"] = contextGrp;
    if (queFormat == 1 || queFormat == 2) {
        var stuAnswer = jsonData.book2[questionID].questions[answerID].answers[selectedAnswer];
        item["studentResponse"] = stuAnswer;
    }
    item["score"] = score;
    //var email = $(this).val();

    //item["title"] = id;
    //item["email"] = email;

    jsonObj.push(item);
    //   });
    jsonString = JSON.stringify(jsonObj)
    console.log(jsonString);
}
