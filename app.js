"use strict";

const form = document.getElementById("calendarForm");
const shiftFields = document.getElementById("shiftFields");
const shiftRow = document.getElementsByClassName("shiftRow");
const addShiftButton = document.getElementById("addShift");
const removeShiftButton = document.getElementById("removeShift");

function createShiftRow() {
    const shiftDiv = document.createElement("div");
    const dateInput = document.createElement("input");
    const startTime = document.createElement("input");
    const endTime = document.createElement("input");

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

    shiftDiv.appendChild(dateInput);
    shiftDiv.appendChild(startTime);
    shiftDiv.appendChild(endTime);
    
    shiftFields.appendChild(shiftDiv);




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
document.addEventListener("DOMContentLoaded", () => {
    createShiftRow();
    addShiftButton.addEventListener("click", createShiftRow);
    removeShiftButton.addEventListener("click", removeShift);




})