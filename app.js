"use strict";

const form = document.getElementById("calendarForm");
const shiftFields = document.getElementById("shiftFields");
const shiftRow = document.getElementsByClassName("shiftRow");
const addShiftButton = document.getElementById("addShift");
const removeShiftButton = document.getElementById("removeShift");

const log = document.getElementById("formSubmitted");

// Selecting Inputs from the Row cells
const rows = shiftFields.querySelectorAll(".shiftRow");
const dateInput = rows.querySelector("input[name='day']");
const startTime = rows.querySelector("input[name='startTime']");
const endTime = rows.querySelector("input[name='endTime']");

// Shift Values | Convert Node List to Array, then into K-V pairs
function getShiftData() {
    const shifts = Array.from(rows, (row) => ({
        date: row.querySelector("input[name='day']").value,
        startTime: row.querySelector("input[name='startTime']").value,
        endTime: row.querySelector("input[name='endTime']").value
    }));

    
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

function validateNotInPast(banana) {

    const now = new Date();

    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");

    const today = `${year}-${month}-${date}`;

    banana.setAttribute("min", today);

}


function formSubmission(event) {
    event.preventDefault();
    log.textContent = "Form Submitted. Nice";

    const shifts = getShiftData();
    const scheduleJSON = JSON.stringify({shifts});


}
document.addEventListener("DOMContentLoaded", () => {
    createShiftRow();
    getShiftData();
    addShiftButton.addEventListener("click", createShiftRow);
    removeShiftButton.addEventListener("click", removeShift);

    form.addEventListener("submit", formSubmission);



})