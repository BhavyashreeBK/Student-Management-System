const form = document.getElementById("studentForm");

if (form) {

    form.addEventListener("submit", function (event) {

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const age = form.age.value;
    const qualification = form.qualification.value;
    const course = form.course.value;
    const subject = form.subject.value;
    const address = form.address.value.trim();

    const gender = document.querySelector('input[name="gender"]:checked');
    const skills = document.querySelectorAll('input[name="skills"]:checked');

    if (name.length < 3) {
        alert("Name must contain at least 3 characters.");
        event.preventDefault();
        return;
    }

    if (!email.includes("@")) {
        alert("Enter a valid email.");
        event.preventDefault();
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits.");
        event.preventDefault();
        return;
    }

    if (age < 16 || age > 100) {
        alert("Age must be between 16 and 100.");
        event.preventDefault();
        return;
    }

    if (!gender) {
        alert("Please select your gender.");
        event.preventDefault();
        return;
    }

    if (qualification === "") {
        alert("Please select a qualification.");
        event.preventDefault();
        return;
    }

    if (course === "") {
        alert("Please select a course.");
        event.preventDefault();
        return;
    }

    if (subject === "") {
        alert("Please select an interested subject.");
        event.preventDefault();
        return;
    }

    if (address === "") {
        alert("Please enter your address.");
        event.preventDefault();
        return;
    }

    if (skills.length === 0) {
        alert("Please select at least one skill.");
        event.preventDefault();
        return;
    }

});
}

const password = document.getElementById("password");
const strengthMessage = document.getElementById("strengthMessage");

if (password) {

    password.addEventListener("input", function () {

        const value = password.value;

        let strength = "";

        if (value.length < 6) {
            strength = "🔴 Weak";
            strengthMessage.style.color = "red";
        }
        else if (
            value.match(/[A-Z]/) &&
            value.match(/[0-9]/) &&
            value.length >= 8
        ) {
            strength = "🟢 Strong";
            strengthMessage.style.color = "green";
        }
        else {
            strength = "🟡 Medium";
            strengthMessage.style.color = "orange";
        }

        strengthMessage.innerHTML = strength;

    });

}

const confirmPassword = document.getElementById("confirmPassword");
const matchMessage = document.getElementById("matchMessage");

if (password && confirmPassword) {

    function checkPasswordMatch() {

        if (confirmPassword.value === "") {
            matchMessage.innerHTML = "";
            return;
        }

        if (password.value === confirmPassword.value) {

            matchMessage.innerHTML = "✅ Passwords Match";
            matchMessage.style.color = "green";

        } else {

            matchMessage.innerHTML = "❌ Passwords Do Not Match";
            matchMessage.style.color = "red";

        }

    }

    password.addEventListener("input", checkPasswordMatch);
    confirmPassword.addEventListener("input", checkPasswordMatch);

}

const address = document.getElementById("address");
const charCount = document.getElementById("charCount");

if (address) {

    address.addEventListener("input", function () {

        let length = address.value.length;

        charCount.innerHTML = `${length} / 15 Characters`;

        if (length > 10) {
            charCount.style.color = "red";
        } else {
            charCount.style.color = "gray";
        }

    });

}

const studentName = document.querySelector('input[name="name"]');
const welcomeMessage = document.getElementById("welcomeMessage");

if (studentName && welcomeMessage) {

    studentName.addEventListener("input", function () {

        if (studentName.value.trim() === "") {

            welcomeMessage.innerHTML = "👋 Welcome!";

        } else {

            welcomeMessage.innerHTML =
                `👋 Welcome, ${studentName.value}!`;

        }

    });

}

// ===============================
// Live Student Search
// ===============================

