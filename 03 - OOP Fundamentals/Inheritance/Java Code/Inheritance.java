// =============================================================================
// INHERITANCE (Java twin of inheritance.cpp) — an "is-a" hierarchy: every role
// IS-AN Employee, reusing shared identity and specializing monthlySalary().
//
// Build & run:
//   javac Inheritance.java
//   java Inheritance
// =============================================================================
import java.util.ArrayList;
import java.util.List;

abstract class Employee {
    protected String name;   // visible to subclasses, hidden from outside
    protected int id;

    Employee(String name, int id) {
        this.name = name;
        this.id = id;
    }
    String getName() { return this.name; }
    int getId() { return this.id; }
    abstract double monthlySalary();   // each role MUST override
    abstract String role();
}

// "A FullTimeEmployee IS-A Employee" — paid a fixed monthly figure.
class FullTimeEmployee extends Employee {
    private double monthly;
    FullTimeEmployee(String name, int id, double monthly) {
        super(name, id);
        this.monthly = monthly;
    }
    double monthlySalary() { return this.monthly; }
    String role() { return "Full-time"; }
}

// "A Contractor IS-A Employee" — paid by the hour.
class Contractor extends Employee {
    private double rate;
    private int hours;
    Contractor(String name, int id, double hourlyRate, int hours) {
        super(name, id);
        this.rate = hourlyRate;
        this.hours = hours;
    }
    double monthlySalary() { return this.rate * this.hours; }
    String role() { return "Contractor"; }
}

// A Manager reuses FullTimeEmployee and EXTENDS it with a team bonus.
class Manager extends FullTimeEmployee {
    private double bonus;
    Manager(String name, int id, double monthly, double bonus) {
        super(name, id, monthly);
        this.bonus = bonus;
    }
    double monthlySalary() {
        return super.monthlySalary() + this.bonus;   // call the base, then add
    }
    String role() { return "Manager"; }
}

public class Inheritance {
    public static void main(String[] args) {
        List<Employee> staff = new ArrayList<Employee>();
        staff.add(new FullTimeEmployee("Aarav", 1, 90000));
        staff.add(new Contractor("Bhavna", 2, 1200, 160));
        staff.add(new Manager("Chetan", 3, 120000, 30000));

        double payroll = 0;
        for (Employee e : staff) {
            System.out.println(e.getId() + "  " + e.getName()
                + "  (" + e.role() + ")  ->  Rs " + e.monthlySalary());
            payroll += e.monthlySalary();
        }
        System.out.println("Total monthly payroll: Rs " + payroll);
    }
}
