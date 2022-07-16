require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());

// Get all Restaurants
app.get("/api/v1/companies", async (req, res) => {
  try {
    //const results = await db.query("select * from restaurants");
    const companies = await db.query("select * from companies ;");

    res.status(200).json({
      status: "success",
      results: companies.rows.length,
      data: {
        companies: companies.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Get a Restaurant
app.get("/api/v1/companies/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const company = await db.query("select * from companies  where id = $1", [
      req.params.id,
    ]);
    // select * from restaurants wehre id = req.params.id

    const employees = await db.query(
      "select * from employees where company_id = $1",
      [req.params.id]
    );

    res.status(200).json({
      status: "succes",
      data: {
        company: company.rows[0],
        employees: employees.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create a Restaurant

app.post("/api/v1/companies", async (req, res) => {
  console.log(req.body);

  try {
    const results = await db.query(
      "INSERT INTO companies (name, adresse, phone ,tva) values ($1, $2, $3, $4) returning *",
      [req.body.name, req.body.adresse, req.body.phone, req.body.tva]
    );
    console.log(results);
    res.status(201).json({
      status: "succes",
      data: {
        company: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update Restaurants

app.put("/api/v1/companies/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE companies SET name = $1, adresse = $2, phone = $3, tva = $4 where id = $5 returning *",
      [
        req.body.name,
        req.body.adresse,
        req.body.phone,
        req.body.tva,
        req.params.id,
      ]
    );

    res.status(200).json({
      status: "succes",
      data: {
        company: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(req.params.id);
  console.log(req.body);
});

// Delete Restaurant

app.delete("/api/v1/companies/:id", async (req, res) => {
  try {
    const results = db.query("DELETE FROM companies where id = $1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "sucess",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/companies/:id/addEmployee", async (req, res) => {
  try {
    const newEmployee = await db.query(
      "INSERT INTO employees (company_id, firstname, secondname, phone) values ($1, $2, $3, $4) returning *;",
      [req.params.id, req.body.firstname, req.body.secondname, req.body.phone]
    );
    console.log(newEmployee);
    res.status(201).json({
      status: "success",
      data: {
        employee: newEmployee.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
