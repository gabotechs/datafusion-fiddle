export const INIT_DDL = `\
-- Put your schema definition and data insertions here.

CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(20),
  hire_date DATE,
  job_title VARCHAR(50),
  department VARCHAR(50),
  salary DECIMAL(10,2)
);

INSERT INTO employees (id, first_name, last_name, email, phone, hire_date, job_title, department, salary)
VALUES
(1, 'John', 'Doe', 'john.doe@company.com', '123-456-7890', '2020-01-01', 'Manager', 'Sales', 75000.00),
  (2, 'Jane', 'Smith', 'jane.smith@company.com', '987-654-3210', '2019-05-15', 'Engineer', 'Engineering', 85000.00),
  (3, 'Michael', 'Johnson', 'michael.johnson@company.com', '456-789-0123', '2021-03-10', 'Analyst', 'Finance', 65000.00),
  (4, 'Emily', 'Brown', 'emily.brown@company.com', '321-654-9870', '2018-11-01', 'Designer', 'Marketing', 60000.00),
  (5, 'David', 'Wilson', 'david.wilson@company.com', '789-123-4560', '2020-08-20', 'Developer', 'Engineering', 80000.00),
  (6, 'Sarah', 'Taylor', 'sarah.taylor@company.com', '654-987-3210', '2017-06-01', 'Manager', 'Human Resources', 90000.00),
  (7, 'Robert', 'Anderson', 'robert.anderson@company.com', '321-789-6540', '2019-09-05', 'Salesperson', 'Sales', 55000.00),
  (8, 'Jennifer', 'Thomas', 'jennifer.thomas@company.com', '987-321-6540', '2020-02-15', 'Accountant', 'Finance', 70000.00),
  (9, 'William', 'Jackson', 'william.jackson@company.com', '654-123-9870', '2018-07-10', 'Engineer', 'Engineering', 95000.00),
  (10, 'Elizabeth', 'White', 'elizabeth.white@company.com', '123-789-4560', '2021-01-25', 'Coordinator', 'Marketing', 50000.00),
  (11, 'Christopher', 'Harris', 'christopher.harris@company.com', '789-654-1230', '2019-12-01', 'Analyst', 'Finance', 72000.00),
  (12, 'Ashley', 'Martin', 'ashley.martin@company.com', '456-321-9870', '2020-06-18', 'Designer', 'Marketing', 58000.00),
  (13, 'Matthew', 'Thompson', 'matthew.thompson@company.com', '321-456-7890', '2017-09-20', 'Manager', 'Operations', 82000.00),
  (14, 'Amanda', 'Garcia', 'amanda.garcia@company.com', '987-123-6540', '2018-04-05', 'Developer', 'Engineering', 77000.00),
  (15, 'Daniel', 'Martinez', 'daniel.martinez@company.com', '654-789-3210', '2020-11-10', 'Salesperson', 'Sales', 60000.00);
`

export const INIT_SELECT = `\
-- Put your select statement here and hit Ctrl+Enter to submit.

SELECT * FROM employees;
`
