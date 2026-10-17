
// =============================================================================
// INHERITANCE — an "is-a" relationship that lets a subclass reuse and specialize
// a base class. Use it for genuine specialization, NOT just to share code
// (prefer composition for code reuse — see SOLID, section 05).
//
// Domain: employees in a company. Every Employee shares identity + the idea of
// monthly pay, but each role computes pay differently and may add its own data.
//
// Run:
//   node inheritance.js
// =============================================================================

// Base class: common properties and behaviour for every employee
class Employee {
  constructor(name, id) {
    // Shared employee identity
    this.name = name;
    this.id = id;
  }

  // Shared behaviour inherited by all subclasses
  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  // Specialized behaviour: subclasses are expected to override these methods
  // JavaScript doesn't enforce abstract methods automatically
  monthlySalary() {
    throw new Error("monthlySalary() must be implemented by a subclass");
  }

  role() {
    throw new Error("role() must be implemented by a subclass");
  }
}

// "A FullTimeEmployee IS-A Employee"
// Paid a fixed monthly salary
class FullTimeEmployee extends Employee {
  constructor(name, id, monthly) {
    // Pass common properties to the parent class
    super(name, id);

    // Full-time employee's monthly salary
    this.monthly = monthly;
  }

  // Override the salary calculation
  monthlySalary() {
    return this.monthly;
  }

  // Return the employee's role
  role() {
    return "Full-time";
  }
}

// "A Contractor IS-A Employee"
// Paid according to hourly rate multiplied by hours worked
class Contractor extends Employee {
  constructor(name, id, hourlyRate, hours) {
    // Initialize name and id through the parent constructor
    super(name, id);

    this.rate = hourlyRate;
    this.hours = hours;
  }

  // Calculate monthly pay based on hours worked
  monthlySalary() {
    return this.rate * this.hours;
  }

  role() {
    return "Contractor";
  }
}

// A Manager IS-A FullTimeEmployee
// Reuses the full-time salary and adds a team bonus
class Manager extends FullTimeEmployee {
  constructor(name, id, monthly, bonus) {
    // Initialize inherited employee data and monthly salary
    super(name, id, monthly);

    // Additional property specific to a manager
    this.bonus = bonus;
  }

  // Override salary calculation to include the bonus
  monthlySalary() {
    // Call the inherited salary method, then add the bonus
    return super.monthlySalary() + this.bonus;
  }

  // Manager has its own role
  role() {
    return "Manager";
  }
}

// =============================================================================
// MAIN PROGRAM
// =============================================================================

// Store different employee objects in one array
const staff = [
  new FullTimeEmployee("Aarav", 1, 90000),
  new Contractor("Bhavna", 2, 1200, 160),
  new Manager("Chetan", 3, 120000, 30000)
];

// Initialize total monthly payroll
let payroll = 0;

// Process every employee using the same methods
for (const employee of staff) {
  // Each object uses its own role() and monthlySalary() implementation
  console.log(
    `${employee.getId()}  ${employee.getName()}  (${employee.role()})  ->  Rs ${employee.monthlySalary()}`
  );

  // Add the employee's salary to the total
  payroll += employee.monthlySalary();
}

// Display total monthly payroll
console.log(`Total monthly payroll: Rs ${payroll}`);

// JavaScript automatically manages object memory through garbage collection.
// We don't need to manually delete the employee objects.
