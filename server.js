// ==============================
// Required Packages
// ==============================

const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const Student = require("./models/Student");

// ==============================
// App Configuration
// ==============================

const app = express();
const PORT = 3001;

// ==============================
// MongoDB Connection
// ==============================

mongoose.connect("mongodb://127.0.0.1:27017/studentDB")

.then(() => {

    console.log("✅ MongoDB Connected Successfully");

})

.catch((err) => {

    console.log("❌ MongoDB Connection Failed");

    console.log(err);

});

// ==============================
// Middleware
// ==============================

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static("public"));

// ==============================
// Logging Middleware (Task 8)
// ==============================

app.use((req, res, next) => {

    const currentTime = new Date().toLocaleString();

    console.log(

        `[${currentTime}] ${req.method} ${req.url}`

    );

    next();

});

// ==============================
// View Engine
// ==============================

app.set("view engine", "ejs");
// ==============================
// Rate Limiter (Task 7)
// ==============================

const apiLimiter = rateLimit({

    windowMs: 15 * 60 * 1000, // 15 Minutes

    max: 100,

    message: {

        message: "Too many requests. Please try again later."

    },

    standardHeaders: true,

    legacyHeaders: false

});

// Apply limiter to all API routes

app.use("/api", apiLimiter);

// ==============================
// Pages
// ==============================

// Home Page

app.get("/", (req, res) => {

    res.render("index");

});

// Students Page

app.get("/students", (req, res) => {

    res.render("students");

});

// About Page

app.get("/about", (req, res) => {

    res.render("about");

});

// ==============================
// Test Routes
// ==============================

app.get("/test", (req, res) => {

    res.send("✅ Test route is working");

});

app.get("/hello", (req, res) => {

    res.send("Hello from Express Server!");

});
// ==============================
// Register Student
// ==============================

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

        // ======================
        // Server-side Validation
        // ======================

        if (!name || name.trim().length < 3) {

            return res.send("Name must contain at least 3 characters.");

        }

        if (!email || !email.includes("@")) {

            return res.send("Invalid Email Address.");

        }

        if (!phone || phone.length !== 10) {

            return res.send("Phone number must contain exactly 10 digits.");

        }

        if (age < 16 || age > 100) {

            return res.send("Age must be between 16 and 100.");

        }

        // ======================
        // Save Student
        // ======================

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
       clearStudentCache();
        console.log("✅ Student Registered:", student.name);

        // ======================
        // Success Page
        // ======================

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

    }

    catch (err) {

        console.log(err);

        res.status(500).send("Error while registering student.");

    }

});
// ==============================
// Edit Student Page
// ==============================

app.get("/edit/:id", async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);

        if (!student) {

            return res.status(404).send("Student not found.");

        }

        res.render("editStudent", {

            student

        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Error loading edit page.");

    }

});

// ==============================
// REST API
// ==============================

// Get All Students

app.get("/api/students", async (req, res) => {

    try {

        const students = await Student.find();

        res.status(200).json(students);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Error fetching students."

        });

    }

});

// ==============================
// Get Student By ID
// ==============================

app.get("/api/students/:id", async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);

        if (!student) {

            return res.status(404).json({

                message: "Student not found."

            });

        }

        res.status(200).json(student);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Error fetching student."

        });

    }

});
// ==============================
// Add Student API
// ==============================

app.post("/api/students", async (req, res) => {

    try {

        const student = new Student({

            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            age: req.body.age,
            password: req.body.password,
            gender: req.body.gender,
            qualification: req.body.qualification,
            course: req.body.course,
            subject: req.body.subject,
            address: req.body.address,
            skills: req.body.skills

        });

        await student.save();

        res.status(201).json({

            success: true,

            message: "Student added successfully.",

            student

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Error adding student."

        });

    }

});

// ==============================
// Update Student API
// ==============================

app.put("/api/students/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndUpdate(

            req.params.id,

            {

                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                gender: req.body.gender,
                qualification: req.body.qualification,
                course: req.body.course,
                subject: req.body.subject,
                address: req.body.address,
                skills: req.body.skills

            },

            {

                new: true,

                runValidators: true

            }

        );

        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found."

            });

        }
        clearStudentCache();
        res.status(200).json({

            success: true,

            message: "Student updated successfully.",

            student

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Error updating student."

        });

    }

});
// ==============================
// Delete Student API
// ==============================

app.delete("/api/students/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found."

            });

        }
         clearStudentCache();
        res.status(200).json({

            success: true,

            message: "Student deleted successfully."

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Error deleting student."

        });

    }

});

// ==============================
// External API
// Task 7
// ==============================

app.get("/api/sample-student", async (req, res) => {

    try {

        const response = await axios.get("https://randomuser.me/api/");

        const user = response.data.results[0];

        res.json({

            name: `${user.name.first} ${user.name.last}`,

            email: user.email,

            phone: user.phone,

            gender: user.gender === "male" ? "Male" : "Female",

            address: `${user.location.city}, ${user.location.country}`

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Unable to fetch sample student."

        });

    }

});
// ==============================
// Task 8 - Background Task
// ==============================

// Background task runs every 30 seconds

setInterval(async () => {

    try {

        const totalStudents = await Student.countDocuments();

        console.log("----------------------------------------");
        console.log("📌 Background Task Running...");
        console.log(`👨‍🎓 Total Students : ${totalStudents}`);
        console.log(`🕒 Time : ${new Date().toLocaleString()}`);
        console.log("----------------------------------------");

    } catch (err) {

        console.log("Background Task Error");

        console.log(err);

    }

}, 30000);


// ==============================
// Task 8 - Server Cache
// ==============================

// Simple in-memory cache

let studentCache = null;

let cacheTime = null;

const CACHE_DURATION = 30000; // 30 Seconds


// Cached API

app.get("/api/cache/students", async (req, res) => {

    try {

        const now = Date.now();

        if (

            studentCache &&

            cacheTime &&

            (now - cacheTime) < CACHE_DURATION

        ) {

            console.log("📦 Returning Cached Data");

            return res.json({

                success: true,

                source: "Cache",

                students: studentCache

            });

        }

        console.log("💾 Fetching Students From MongoDB");

        const students = await Student.find();

        studentCache = students;

        cacheTime = now;

        res.json({

            success: true,

            source: "MongoDB",

            students

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Cache Error"

        });

    }

});
// ==============================
// Task 8 - Clear Cache Function
// ==============================

function clearStudentCache() {

    studentCache = null;
    cacheTime = null;

    console.log("🗑️ Student Cache Cleared");

}
// ==============================
// 404 Handler
// ==============================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "404 - Page Not Found"

    });

});
// ==============================
// Global Error Handler
// ==============================

app.use((err, req, res, next) => {

    console.error("Global Error:");

    console.error(err.stack);

    res.status(500).json({

        success: false,

        message: "Internal Server Error"

    });

});

// ==============================
// Server Start
// ==============================

app.listen(PORT, () => {

    console.log("");
    console.log("==============================================");
    console.log("🎓 Student Management System");
    console.log("==============================================");
    console.log(`🚀 Server Running : http://localhost:${PORT}`);
    console.log("📦 MongoDB Status : Connected");
    console.log("🛡️ Rate Limiter   : Enabled");
    console.log("📋 Logging        : Enabled");
    console.log("⚙️ Background Job : Running Every 30 Seconds");
    console.log("💾 Cache          : Enabled");
    console.log("🌐 External API   : Random User API");
    console.log("==============================================");
    console.log("");

});