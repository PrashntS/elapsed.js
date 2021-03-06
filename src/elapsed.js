/*
    The MIT License (MIT)

    Copyright (c) 2014 Prashant Sinha

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

/**
 * Elapsed.JS
 * Converts boring Timestamps to something like:
 * "just now", "a few minutes ago", "3 minutes ago" etc.
 * License- 
 * @package: TwoDot7 <https://github.com/PrashntS/TwoDot7>
 * @author: Prashant Sinha <firstname,lastname>@outlook.com, <firstname>@ducic.ac.in
 * @organization: Cluster Innovation Centre, University of Delhi
 * @version: v1.0 20140915
 * @link: https://github.com/PrashntS/elapsed.js
 */
var Elapsed = {

    /**
     * Package initiator.
     */
    ClassHook: "elapsedJS",

    /**
     * HTML5 Standard data container.
     */
    DataHook: "data-elapseJS",

    /**
     * Prevents Multiple runtimes.
     */
    ActionToggle: false,

    /**
     * Time interval between routine calls. See Routine.
     */
    RoutineInterval: 1000,

    /**
     * Enables Debugging Mode.
     */
    ElapsedDEBUG: false,

    /**
     * Main Action. Iterates through ALL elapse elements and converts them into Elapse Objects.
     * @param: none.
     * @return: none.
     */
    action: function() {
        if(Elapsed.ActionToggle) {
            Elapsed.debugMsg("ElapsedJS action is Locked.");
            return;
        }

        Elapses = document.getElementsByClassName(Elapsed.ClassHook);
        
        for (var i = 0; i < Elapses.length; i++) {
            if (i == 0) {
                Elapsed.ActionToggle = true;
                Elapsed.debugMsg("Locked ElapsedJS action.");
            }
            
            var Elapse = Elapses[i];
            try {
                var pastTime = parseInt(Elapse.getAttribute(Elapsed.DataHook));
                var past = new Date(pastTime*1000);

                var now = new Date();
                var timeNow = parseInt(now.getTime()/1000);

                var ago = timeNow - pastTime;

                putTime = function(message) {
                    Elapse.innerHTML = message;
                };

                /**
                 * Text string to be replaced.
                 */
                if (ago < 60) putTime("just now");
                else if (ago < 120) putTime("a few minutes ago");
                else if (ago < 3570) putTime(parseInt(ago/60)+" minutes ago");
                else if (ago < 86400) putTime("today, at "+Elapsed.formatDate(past, "h:mmTT"));
                else if (ago < 172800) putTime("yesterday, at "+Elapsed.formatDate(past, "h:mmTT"));
                else putTime(Elapsed.formatDate(past, "h:mmTT, d MMMM yyyy"));

            } catch (E) {
                Elapsed.debugMsg(E.message);
            }

            if (i == Elapses.length-1) {
                Elapsed.ActionToggle = false;
                Elapsed.debugMsg("Unlocked ElapsedJS action.");
            }
        }
    },

    /**
     * Returns the Prettified Date, according to given .NET style date-time format. 
     * @param: date Date Object, Required. Date Object.
     * @param: format String, Required. .NET Style date-time format.
     * @param: utc Integer, Optional. Optional UTC offset. Default- System default.
     * @return: string. The Date-Time formatted string.
     */
    formatDate: function(date, format, utc) {
        var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        function ii(i, len) {
            var s = i + "";
            len = len || 2;
            while (s.length < len) s = "0" + s;
            return s;
        }

        var y = utc ? date.getUTCFullYear() : date.getFullYear();
        format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
        format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
        format = format.replace(/(^|[^\\])y/g, "$1" + y);

        var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
        format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
        format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
        format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
        format = format.replace(/(^|[^\\])M/g, "$1" + M);

        var d = utc ? date.getUTCDate() : date.getDate();
        format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
        format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
        format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
        format = format.replace(/(^|[^\\])d/g, "$1" + d);

        var H = utc ? date.getUTCHours() : date.getHours();
        format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
        format = format.replace(/(^|[^\\])H/g, "$1" + H);

        var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
        format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
        format = format.replace(/(^|[^\\])h/g, "$1" + h);

        var m = utc ? date.getUTCMinutes() : date.getMinutes();
        format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
        format = format.replace(/(^|[^\\])m/g, "$1" + m);

        var s = utc ? date.getUTCSeconds() : date.getSeconds();
        format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
        format = format.replace(/(^|[^\\])s/g, "$1" + s);

        var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
        format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])f/g, "$1" + f);

        var T = H < 12 ? "AM" : "PM";
        format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
        format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

        var t = T.toLowerCase();
        format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
        format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

        var tz = -date.getTimezoneOffset();
        var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
        if (!utc) {
            tz = Math.abs(tz);
            var tzHrs = Math.floor(tz / 60);
            var tzMin = tz % 60;
            K += ii(tzHrs) + ":" + ii(tzMin);
        }
        format = format.replace(/(^|[^\\])K/g, "$1" + K);

        var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
        format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
        format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

        format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
        format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

        format = format.replace(/\\(.)/g, "$1");

        return format;
    },

    /**
     * If ElapsedDEBUG is true, logs all the Debug data to the console.
     * @param: message, String Required. The Message.
     * @return: none.
     */
    debugMsg: function(message) {
        if (Elapsed.ElapsedDEBUG && message) {
            console.log("ElapsedJS DEBUG: "+message);
        }
    },

    /**
     * Starts the Elapsed Job, and inits the Routine Job.
     * @param: none.
     * @return: none.
     */
    init: function() {
        Elapsed.action();
        Elapsed.routine();
        Elapsed.debugMsg("Initialized ElapsedJS.");
    },

    /**
     * Repeats the Action depending on RoutineInterval.
     * @param: none.
     * @return: none.
     */
    routine: function() {
        window.setInterval(function() {
            Elapsed.debugMsg("Routine Called.");
            Elapsed.action();
        }, Elapsed.RoutineInterval);
    }
};
