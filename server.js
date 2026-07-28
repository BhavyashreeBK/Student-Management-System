const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const PORT = 3001;

// ======================
// MongoDB Connection
// ======================

mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ======================
// Middleware
// ======================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

// ======================
// Pages
// ======================

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/students", (req, res) => {
    res.render("students");
});

app.get("/about", (req, res) => {
    res.render("about");
});

// ======================
// Register Student
// ======================

app.post("/submit", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            age,
            password,
            gender,
            qualification,
            course,
            subject,
            address,
            skills
        } = req.body;

        if (!name || name.length < 3) {
            return res.send("Name must contain at least 3 characters.");
        }

        if (!email.includes("@")) {
            return res.send("Invalid Email");
        }

        if (!phone || phone.length !== 10) {
            return res.send("Phone number must contain 10 digits.");
        }

        if (age < 16 || age > 100) {
            return res.send("Age must be between 16 and 100.");
        }

        const student = new Student({
            name,
            email,
            phone,
            age,
            password,
            gender,
            qualification,
            course,
            subject,
            address,
            skills
        });

        await student.save();

        res.render("success", {
            name,
            email,
            phone,
            age,
            password,
            gender,
            qualification,
            course,
            subject,
            address,
            skills
        });

    } catch (err) {

        console.log(err);
        res.status(500).send("Error saving student.");

    }

});
console.log("Reached before edit route");

app.get("/test", (req, res) => {
    res.send("Test route is working");
});

// ======================
// Edit Page
// ======================

app.get("/hello", (req, res) => {
    res.send("Hello");
});

app.get("/edit/:id", async (req, res) => {
    try {
        console.log("ID:", req.params.id);
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.send("Student not found");
        }

        res.render("editStudent", { student });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading edit page");
    }
});
// ======================
// REST API
// ======================

// Get All Students

app.get("/api/students", async (req, res) => {

    try {

        const students = await Student.find();

        res.json(students);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// Get Single Student

app.get("/api/students/:id", async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json(student);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// Add Student

app.post("/api/students", async (req, res) => {

    try {

        const student = new Student(req.body);

        await student.save();

        res.status(201).json(student);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// Update Student

app.put("/api/students/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json(student);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// Delete Student

app.delete("/api/students/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }


});


console.log("Registered routes:");

app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(
            Object.keys(middleware.route.methods)[0].toUpperCase(),
            middleware.route.path
        );
    }
});
// ======================
// Server
// ======================

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});