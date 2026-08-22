"use strict";

const form = document.getElementById("calendarForm");
const shiftFields = document.getElementById("shiftFields");
const shiftRow = document.getElementsByClassName("shiftRow");
const addShiftButton = document.getElementById("addShift");
const removeShiftButton = document.getElementById("removeShift");
const eventTitle = document.getElementById("eventTitle");

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

function isDuplicate(shift1, shift2) {
    return (
        shift1.date === shift2.date &&
        shift1.startTime === shift2.startTime &&
        shift1.endTime === shift2.endTime
    );
}

function findDuplicateShift(shifts) {
    const rows = document.querySelectorAll(".shiftRow");

    for (let i = 0; i < shifts.length; i++) {
        for (let j = i + 1; j < shifts.length; j++) {

            if (isDuplicate(shifts[i], shifts[j])) {
                rows[i].classList.add("duplicateShift");
                rows[j].classList.add("duplicateShift");
                return shifts[j];
            }
        }
    }

    return null;
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

function showLayoutDebug() {
    const row = document.querySelector(".shiftRow");
    const labels = [...document.querySelectorAll(".shiftRow > label")];

    const rowRect = row.getBoundingClientRect();
    const rowCenter = (rowRect.left + rowRect.right) / 2;

    let output = `
Viewport: ${window.innerWidth}

ROW
left: ${rowRect.left.toFixed(1)}
right: ${rowRect.right.toFixed(1)}
width: ${rowRect.width.toFixed(1)}
center: ${rowCenter.toFixed(1)}
`;

    labels.forEach((label, i) => {
        const input = label.querySelector("input");

        const labelRect = label.getBoundingClientRect();
        const inputRect = input.getBoundingClientRect();

        const style = getComputedStyle(input);

        output += `

FIELD ${i + 1}

Label:
left: ${labelRect.left.toFixed(1)}
right: ${labelRect.right.toFixed(1)}
width: ${labelRect.width.toFixed(1)}
center: ${((labelRect.left + labelRect.right) / 2).toFixed(1)}

Input:
left: ${inputRect.left.toFixed(1)}
right: ${inputRect.right.toFixed(1)}
width: ${inputRect.width.toFixed(1)}
center: ${((inputRect.left + inputRect.right) / 2).toFixed(1)}

CSS:
box-sizing: ${style.boxSizing}
computed width: ${style.width}
padding-left: ${style.paddingLeft}
padding-right: ${style.paddingRight}
border-left: ${style.borderLeftWidth}
border-right: ${style.borderRightWidth}
margin-left: ${style.marginLeft}
margin-right: ${style.marginRight}
`;
    });

    const oldDebug = document.getElementById("layoutDebug");

    if (oldDebug) {
        oldDebug.remove();
    }

    const debug = document.createElement("pre");
    debug.setAttribute("id", "layoutDebug");
    debug.textContent = output;

    document.body.appendChild(debug);
}


function formSubmission(event) {

    // console.log("test");
    event.preventDefault();
    // log.textContent = "Form Submitted. Nice";

    // Creates JSON format
    const shifts = getShiftData();
    const duplicate = findDuplicateShift(shifts);

    if (duplicate) {
        return;
    }


    // const scheduleJSON = JSON.stringify({ shifts }, null, 2);
    // console.log(scheduleJSON);
    const icsContent = createICS(shifts);

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

        let endDate = shift.date;

        // Treat end time before start time as overnight shift
        if (shift.endTime <= shift.startTime) {
            const date = new Date(shift.date);

            date.setUTCDate(date.getUTCDate() + 1);

            endDate = date.toISOString().split("T")[0];
        }

        const end = formatLocalICSDate(
            endDate,
            shift.endTime
        );

        lines.push(
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${dtStamp}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${eventTitle.value.trim() || "Work"}`,
            "END:VEVENT",
        );

        console.log(uid);
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
    downloadLink.setAttribute("download", "shiftsync-schedule.ics");

    document.body.appendChild(downloadLink);

    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(calendarFileURL);

    // setTimeout(() => {
    //     downloadLink.remove();
    //     URL.revokeObjectURL(calendarFileURL);
    // }, 5000);



}
// When the user corrects their duplicate, it removes the red border
// Event Propagation 
shiftFields.addEventListener("change", () => {
    const duplicateRows = document.querySelectorAll(".duplicateShift");
    const shifts = getShiftData();
    
    duplicateRows.forEach(row => {
        row.classList.remove("duplicateShift");
    })

    findDuplicateShift(shifts);



})

document.addEventListener("DOMContentLoaded", () => {
    createShiftRow();

    // setTimeout(() => {
    //     showLayoutDebug();
    // }, 500)


    addShiftButton.addEventListener("click", createShiftRow);
    removeShiftButton.addEventListener("click", removeShift);



    form.addEventListener("submit", formSubmission);

})