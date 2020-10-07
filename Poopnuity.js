// ==UserScript==
// @name        Poopnuity
// @namespace   http://tampermonkey.net/
// @version     0.9.0
// @description Makes going to school a little less painful. 
// @author      BabyShart
// @match       *://*.core.learn.edgenuity.com/*
// @include     *://student.edgenuity.com/*
// @grant       none
// ==/UserScript==

/******************************************************************************************************************************************************************
------ User Info ------
If you want to look at more things like this, go to our subreddit at reddit.com/r/edgenuity.
Inspired by EATH_WORK234 and just how horrible Edgenuity is as software, a pedagological tool, at effectiveness, etc. 

If this becomes popular (100+ installs) here are the top priority features:
0. Dev stuff - Repository, autoupdates, CI/CD, contact original devs to avoid duplicating effort, etc. 
1. Floating Dashboard for quick changes in script settings
2. Automatically fill in the correct answers
3. Themes (If poop is too brown, try our new upgraded unicorn poop! Now with Sparkles! )
...
99. Collect Cease and desist orders, use them as toilet paper, and send them back. 

----- Developer Info -----
Built on top of the "edgenuity next clicker" which can be found at https://greasyfork.org/en/scripts/19842-edgenuity-next-clicker
Built on top of the "Edgenuity Master Controller" which can be found at https://greasyfork.org/en/scripts/395817-edgenuity-master-controller-mainmenu-mod/code

--- Program Info ---

variable "pageload" is set to an interval every 1 second (1000ms)
variable "current_frame" will only get the current frame if it has been completed.  It will not actually get the current frame.
variable "nextactivity" and "nextactivity_disabled" are for the next button at the bottom. It will turn to the next acitivty and the next lesson after a quiz.
variable "alreadyPlayedCheck" is specific to the code for the auto-completion of the vocab.
variable current_page is unused as of right now because of a bug

*********************************************************************************************************************************************************************/

// ----- User Settings ----- //

// Default = true
// Description: Adds some poop to an otherwise shitty program
var enablePoop = true;
var enableLegacy = true;

// Default = true (If problems occur, try turning this off by replacing true with false)
// Description: This will allow the user to check boxes, complete assignments, or skip instructions as the speaker is talking as in the intro buttons. 
// Bugs:
// May cause "Unable to load video file." error (You can change skip_speaking_intros if this problem occurs).
var skip_speaking_intros = true;

// Default = true (If problems occur, try turning this off by replacing true with false)
// Description: This will automatically click the next button
// Bugs:
// Untested if left at false
// MAJOR: After Direct Instructions, it will get stuck in a loop at going to the next assignment.  This must be fixed!
var is_auto_clicking = true;

// Default = true (If problems occur, try turning this off by replacing true with false)
// Description: This will fill out textboxes for Vocabulary automatically using an exploit found by /u/Turtlemower.  
// The code for this part of the script was created by /u/Mrynot88 and has been greatly appreciated.
var autodefi = true;

// ------- Below is code ------- //
var e;
function triggerEvent(el, type) {
    if ('createEvent' in document) {
        e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    } else {
        // IE 8
        e = document.createEventObject();
        e.eventType = type;
        el.fireEvent('on' + e.eventType, e);
    }
}

(function () {
    'use strict';

    var pageload, nextclicker, nextslide_button, nextactivity, nextactivity_disabled;
    var current_frame;
    var alreadyPlayedCheck;
    var current_page;
    function loadpage() {
        if (skip_speaking_intros) {
            var invis = document.getElementById("invis-o-div");
            var error_message_delete = document.getElementById("uid1_errorMessage");
            if (invis) {
                invis.parentElement.removeChild(invis);
            }
            if (error_message_delete) {
                error_message_delete.parentElement.removeChild(error_message_delete);
            }
        }

        if (is_auto_clicking) {
            pageload = setInterval(function () {
                current_page = document.getElementById("activity-title");
                nextactivity = document.getElementsByClassName("footnav goRight")[0];
                nextactivity_disabled = document.getElementsByClassName("footnav goRight disabled")[0];
                if (nextactivity && !nextactivity_disabled) {
                    nextactivity.click();
                    clearInterval(pageload);
                    setTimeout(loadpage, 1000);
                }
                current_frame = document.getElementsByClassName("FrameCurrent FrameComplete")[0];
                nextslide_button = document.getElementsByClassName("FrameRight")[0];
                if (nextslide_button && current_frame) {
                    nextclicker = setInterval(function () {
                        nextslide_button.click();
                        setTimeout(function () {
                        }, 500);
                    }, 500);
                    clearInterval(pageload);
                }
            }, 1000);
        }

        if (autodefi) { // This is for the auto-completition of the vocab
            setInterval(function () {
                var normalTextBox = document.getElementsByClassName("word-textbox word-normal")[0];
                var correctTextBox = document.getElementsByClassName("word-textbox word-correct")[0];
                var normalTextButton = document.getElementsByClassName("plainbtn alt blue selected")[0];
                var firstDefButton = document.getElementsByClassName("playbutton vocab-play")[0];
                var nextButton = document.getElementsByClassName("uibtn uibtn-blue uibtn-arrow-next")[0];
                if (normalTextBox && !correctTextBox) {
                    normalTextBox.value = normalTextButton.innerHTML;
                    alreadyPlayedCheck = false;
                    triggerEvent(normalTextBox, "keyup");
                }
                if (correctTextBox && !alreadyPlayedCheck) {
                    firstDefButton.click();
                    alreadyPlayedCheck = true;
                }
                if (nextButton && correctTextBox) {
                    nextButton.click();
                }
            }, 2000);
        };

        if (window.location.href.split(".")[0] == "https://student") {
            setTimeout(function () { 
                if(enableLegacy)
                {
                    document.getElementsByClassName("btn-primary enrollment-card-btn-next btn d-flex align-items-baseline")[0].click(); 
                }
                if(enablePoop){
                    var els = document.getElementsByClassName("course-logo-bug");
                    Array.prototype.forEach.call(els, function(el) {
                        el.src = "https://cdn.discordapp.com/attachments/763384710051004456/763524629590442024/Z.png";
                    });

                    document.getElementsByClassName("footer")[0].style.display = "none";
                    document.getElementsByClassName("navbar-expand-md")[0].style.backgroundColor = "brown";
                    document.getElementsByClassName("edgenuity-logo-top")[0].style.display = "none";
                    document.getElementsByClassName("edgenuity-logo-bottom")[0].src = "https://cdn.discordapp.com/attachments/763384710051004456/763524378721386517/9k.png";
                    var logo = document.getElementsByClassName("navbar-brand")[0];
                    var newLogo = document.createElement("span");
                    newLogo.textContent = "Poopnuity";
                    logo.removeChild(logo.firstChild);
                    logo.appendChild(newLogo);

                    var grades = document.getElementsByClassName("course-grade-text");
                    Array.prototype.forEach.call(grades, function(el) {
                        el.textContent = "100";
                    });
                    var gradeLabels = document.getElementsByClassName("course-grade-label");
                    Array.prototype.forEach.call(gradeLabels, function(el) {
                        el.textContent = "Chance of Diarrhea";
                    });

                    var titles = document.getElementsByClassName("card-title");
                    Array.prototype.forEach.call(titles, function(el) {
                        el.title = "Poop " + el.title;
                    });
                }
            }, 1000);
        }
    }
    loadpage();
})();
