Authentication & User Management
Authentication
POST /api/auth/login - User login

POST /api/auth/logout - User logout

POST /api/auth/refresh-token - Refresh access token

POST /api/auth/forgot-password - Request password reset

POST /api/auth/reset-password - Reset password with token

User Management
GET /api/users - Get all users (Super Admin only)

POST /api/users - Create new user (Super Admin/Company Admin)

GET /api/users/{id} - Get user details

PUT /api/users/{id} - Update user details

DELETE /api/users/{id} - Delete user (Super Admin/Company Admin)

PUT /api/users/{id}/change-password - Change password

PUT /api/users/{id}/change-status - Activate/Deactivate user

Super Admin Dashboard Endpoints
Company Management
GET /api/companies - Get all companies

POST /api/companies - Create new company

GET /api/companies/{id} - Get company details

PUT /api/companies/{id} - Update company

DELETE /api/companies/{id} - Delete company

PUT /api/companies/{id}/change-status - Activate/Deactivate company

System Configuration
GET /api/configurations - Get all system configurations

POST /api/configurations - Create new configuration

PUT /api/configurations/{id} - Update configuration

DELETE /api/configurations/{id} - Delete configuration

Audit Logs
GET /api/audit-logs - Get all audit logs

GET /api/audit-logs/{id} - Get specific audit log

Company Admin Dashboard Endpoints
Department Management
GET /api/departments - Get all departments

POST /api/departments - Create new department

GET /api/departments/{id} - Get department details

PUT /api/departments/{id} - Update department

DELETE /api/departments/{id} - Delete department

Designation Management
GET /api/designations - Get all designations

POST /api/designations - Create new designation

GET /api/designations/{id} - Get designation details

PUT /api/designations/{id} - Update designation

DELETE /api/designations/{id} - Delete designation

Employee Management
GET /api/employees - Get all employees

POST /api/employees - Create new employee

GET /api/employees/{id} - Get employee details

PUT /api/employees/{id} - Update employee

DELETE /api/employees/{id} - Delete employee

POST /api/employees/import - Bulk import employees

GET /api/employees/reports - Generate employee reports

Attendance Management
GET /api/attendances - Get all attendance records

POST /api/attendances - Create attendance record

GET /api/attendances/{id} - Get specific attendance record

PUT /api/attendances/{id} - Update attendance record

DELETE /api/attendances/{id} - Delete attendance record

POST /api/attendances/import - Bulk import attendance

GET /api/attendances/reports - Generate attendance reports

Leave Management
GET /api/leaves - Get all leave requests

POST /api/leaves - Create leave request

GET /api/leaves/{id} - Get specific leave request

PUT /api/leaves/{id} - Update leave request

PUT /api/leaves/{id}/approve - Approve leave request

PUT /api/leaves/{id}/reject - Reject leave request

GET /api/leaves/balances - Get leave balances

GET /api/leaves/reports - Generate leave reports

Payroll Management
GET /api/payrolls - Get all payroll records

POST /api/payrolls - Create payroll record

GET /api/payrolls/{id} - Get specific payroll record

PUT /api/payrolls/{id} - Update payroll record

DELETE /api/payrolls/{id} - Delete payroll record

POST /api/payrolls/process - Process payroll

GET /api/payrolls/reports - Generate payroll reports

Service Manager Dashboard Endpoints
Team Management
GET /api/teams - Get all teams

GET /api/teams/{id} - Get team details

GET /api/teams/{id}/members - Get team members

POST /api/teams/{id}/members - Add team member

DELETE /api/teams/{id}/members/{memberId} - Remove team member

Task Management
GET /api/tasks - Get all tasks

POST /api/tasks - Create new task

GET /api/tasks/{id} - Get task details

PUT /api/tasks/{id} - Update task

DELETE /api/tasks/{id} - Delete task

PUT /api/tasks/{id}/assign - Assign task

PUT /api/tasks/{id}/status - Update task status

GET /api/tasks/reports - Generate task reports

Performance Management
GET /api/performances - Get all performance reviews

POST /api/performances - Create performance review

GET /api/performances/{id} - Get performance review details

PUT /api/performances/{id} - Update performance review

GET /api/performances/employee/{employeeId} - Get employee performance

GET /api/performances/reports - Generate performance reports

Employee Dashboard Endpoints
Employee Self-Service
GET /api/me/profile - Get own profile

PUT /api/me/profile - Update own profile

GET /api/me/attendance - Get own attendance

POST /api/me/attendance/clock-in - Clock in

POST /api/me/attendance/clock-out - Clock out

GET /api/me/leaves - Get own leave requests

POST /api/me/leaves - Request leave

GET /api/me/leaves/balance - Get own leave balance

GET /api/me/payrolls - Get own payroll records

GET /api/me/payrolls/{id} - Get specific payroll record

GET /api/me/tasks - Get own tasks

PUT /api/me/tasks/{id}/status - Update task status

GET /api/me/performances - Get own performance reviews

Document Management
GET /api/me/documents - Get own documents

POST /api/me/documents - Upload document

DELETE /api/me/documents/{id} - Delete document

Common Endpoints
Announcements
GET /api/announcements - Get all announcements

POST /api/announcements - Create announcement (Admin only)

GET /api/announcements/{id} - Get announcement details

PUT /api/announcements/{id} - Update announcement (Admin only)

DELETE /api/announcements/{id} - Delete announcement (Admin only)

Notifications
GET /api/notifications - Get all notifications

GET /api/notifications/unread - Get unread notifications

PUT /api/notifications/{id}/read - Mark as read

DELETE /api/notifications/{id} - Delete notification

Settings
GET /api/settings - Get settings

PUT /api/settings - Update settings (Admin only) api endpionts