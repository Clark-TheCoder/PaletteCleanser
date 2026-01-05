let enterBtn = document.getElementById("enter-btn");
let selectedSeason = null;

function getSelectedSeason() {
  return selectedSeason;
}

function setSelectedSeason(season) {
  selectedSeason = season;
  return selectedSeason;
}

const userInput = document.querySelectorAll("input");

userInput.forEach((inputField) => {
  inputField.addEventListener("click", () => handleUserInput(inputField.id));
});

function handleUserInput(inputField) {
  setSelectedSeason(inputField);
  console.log(getSelectedSeason());
  if (selectedSeason !== null) {
    enterBtn.disabled = false;
  }
}
