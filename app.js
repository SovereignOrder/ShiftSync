"use strict";

const form = document.getElementById("calendarForm");
const shiftFields = document.getElementById("shiftFields");
const shiftRow = document.getElementsByClassName("shiftRow");
const addShiftButton = document.getElementById("addShift");
const removeShiftButton = document.getElementById("removeShift");

const log = document.getElementById("formSubmitted");

// Selecting Inputs from the Row cells



// Shift Values | Convert Node List to Array, then into K-V pairs
function getShiftData() {
    const rows = shiftFields.querySelectorAll(".shiftRow");
    const shifts = Array.from(rows, (row) => ({
        date: row.querySelector("input[name='day']").value,
        startTime: row.querySelector("input[name='startTime']").value,
        endTime: row.querySelector("input[name='endTime']").value
    }));

    return shifts;


}


function createShiftRow() {
    // <div> and <input> elements
    const shiftDiv = document.createElement("div");
    const dateInput = document.createElement("input");
    const startTime = document.createElement("input");
    const endTime = document.createElement("input");

    // Labels
    const dateLabel = document.createElement("label");
    const startLabel = document.createElement("label");
    const endLabel = document.createElement("label");
    dateLabel.textContent = "Shift Date";
    startLabel.textContent = "Start Time";
    endLabel.textContent = "End Time";

    // Date
    dateInput.setAttribute("type", "date");
    dateInput.setAttribute("name", "day");
    dateInput.setAttribute("required", "");
    dateInput.setAttribute("id", "date");
    validateNotInPast(dateInput);


    // Start Time
    startTime.setAttribute("type", "time");
    startTime.setAttribute("name", "startTime");
    startTime.setAttribute("required", "");
    startTime.setAttribute("step", "900");

    // End Time
    endTime.setAttribute("type", "time");
    endTime.setAttribute("name", "endTime");
    endTime.setAttribute("required", "");
    endTime.setAttribute("step", "900");

    shiftDiv.setAttribute("class", "shiftRow");

    /*
     * <div class="shiftRow">
     *      <label>
     *          Shift Date
     *          <input type="date">
     *      </label>
    */
    dateLabel.appendChild(dateInput);
    startLabel.appendChild(startTime);
    endLabel.appendChild(endTime);

    shiftDiv.appendChild(dateLabel);
    shiftDiv.appendChild(startLabel);
    shiftDiv.appendChild(endLabel);

    shiftFields.appendChild(shiftDiv);

    addShiftButton.scrollIntoView();






}

function removeShift() {
    const shiftRows = document.querySelectorAll(".shiftRow");

    if (shiftRows.length > 1) {
        shiftRows[shiftRows.length - 1].remove();
    }
}

function validateNotInPast(dateInput) {

    const now = new Date();

    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${day}`;

    dateInput.setAttribute("min", today);

}




function formSubmission(event) {
    // console.log("test");
    event.preventDefault();
    // log.textContent = "Form Submitted. Nice";

    // Creates JSON format
    const shifts = getShiftData();
    const icsContent = createICS(shifts);
    // const scheduleJSON = JSON.stringify({ shifts }, null, 2);
    // console.log(scheduleJSON);

    console.log(icsContent);
    downloadICS(icsContent);

}


function formatLocalICSDate(date, time) {
    const formattedDate = date.replaceAll("-", "");
    const formattedTime = time.replace(":", "");

    return `${formattedDate}T${formattedTime}00`;


}

function formatUTCICSDate(date) {


    return date
        .toISOString()
        .replaceAll("-", "")
        .replaceAll(":", "")
        .replace(/\.\d{3}Z$/, "Z");
}

function createICS(shifts) {

    const proId = "-//SovereignOrder//CalGeneration//EN"
    
    const dtStamp = formatUTCICSDate(new Date());

    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        `PRODID:${proId}`
    ];

    shifts.forEach(shift => {
        const uid = crypto.randomUUID() + "@github.com/SovereignOrder";
        const start = formatLocalICSDate(
            shift.date,
            shift.startTime
        );

        const end = formatLocalICSDate(
            shift.date,
            shift.endTime
        );

        // Treat end time before start time as overnight shift
        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }

        lines.push(
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${dtStamp}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            "SUMMARY: Work",
            "END:VEVENT",
        );
    });

    lines.push("END:VCALENDAR");

    return lines.join("\r\n");
}

function downloadICS(icsContent) {
    const calendarFile = new Blob(
        [icsContent],
        {
            type: "text/calendar;charset=utf-8"
        });

    const calendarFileURL = URL.createObjectURL(calendarFile);

    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", calendarFileURL);
    downloadLink.setAttribute("download", "work-schedule.ics");

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(calendarFileURL);


}

document.addEventListener("DOMContentLoaded", () => {
    createShiftRow();

    addShiftButton.addEventListener("click", createShiftRow);
    removeShiftButton.addEventListener("click", removeShift);

    form.addEventListener("submit", formSubmission);

})