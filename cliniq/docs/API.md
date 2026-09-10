# ClinIQ API Documentation

## Base URL

```
Development: https://localhost:5001/api
Production: https://api.cliniq.com/api
```

## Authentication

All API endpoints (except login/register) require JWT authentication.

### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
X-Tenant-Id: <tenant-guid> (optional, derived from token)
```

## Endpoints

### Authentication

#### Login
```http
POST /api/v1/auth/login
```

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh-token-here",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "id": "user-guid",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["Admin"]
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
```

Request:
```json
{
  "refreshToken": "refresh-token-here"
}
```

---

### Patients

#### List Patients
```http
GET /api/v1/patients
```

Query Parameters:
- `page` (int): Page number (default: 1)
- `pageSize` (int): Items per page (default: 10)
- `search` (string): Search term
- `sortBy` (string): Sort field
- `sortOrder` (string): asc/desc

Response:
```json
{
  "items": [
    {
      "id": "patient-guid",
      "mrn": "MRN-001",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "gender": "Male",
      "phone": "1234567890"
    }
  ],
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 10
}
```

#### Get Patient
```http
GET /api/v1/patients/{id}
```

Response:
```json
{
  "id": "patient-guid",
  "mrn": "MRN-001",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "bloodGroup": "O+",
  "phone": "1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "0987654321",
  "emergencyContactRelation": "Spouse"
}
```

#### Create Patient
```http
POST /api/v1/patients
```

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "bloodGroup": "O+",
  "phone": "1234567890",
  "email": "john@example.com",
  "address": "123 Main St"
}
```

#### Update Patient
```http
PUT /api/v1/patients/{id}
```

#### Delete Patient
```http
DELETE /api/v1/patients/{id}
```

#### Search Patients
```http
GET /api/v1/patients/search?term=john
```

---

### Appointments

#### List Appointments
```http
GET /api/v1/appointments
```

Query Parameters:
- `date` (date): Filter by date
- `doctorId` (guid): Filter by doctor
- `patientId` (guid): Filter by patient
- `status` (int): Filter by status

#### Create Appointment
```http
POST /api/v1/appointments
```

Request:
```json
{
  "patientId": "patient-guid",
  "doctorId": "doctor-guid",
  "appointmentDate": "2024-01-15",
  "startTime": "09:00:00",
  "endTime": "09:30:00",
  "appointmentType": "NewConsultation",
  "notes": "First visit"
}
```

#### Check In
```http
POST /api/v1/appointments/{id}/checkin
```

#### Cancel Appointment
```http
POST /api/v1/appointments/{id}/cancel
```

Request:
```json
{
  "reason": "Patient request"
}
```

#### Get Available Slots
```http
GET /api/v1/appointments/slots?doctorId={id}&date={date}
```

Response:
```json
[
  {
    "startTime": "09:00:00",
    "endTime": "09:30:00",
    "isAvailable": true
  },
  {
    "startTime": "09:30:00",
    "endTime": "10:00:00",
    "isAvailable": false
  }
]
```

---

### OPD (Outpatient)

#### Get Today's Queue
```http
GET /api/v1/opd/queue
```

Query Parameters:
- `doctorId` (guid): Filter by doctor

Response:
```json
[
  {
    "id": "queue-item-guid",
    "tokenNumber": 1,
    "patientName": "John Doe",
    "status": "Waiting",
    "priority": "Normal",
    "checkInTime": "2024-01-15T09:00:00Z"
  }
]
```

#### Add to Queue
```http
POST /api/v1/opd/queue
```

Request:
```json
{
  "patientId": "patient-guid",
  "doctorId": "doctor-guid",
  "appointmentId": "appointment-guid",
  "priority": "Normal"
}
```

#### Call Next Patient
```http
POST /api/v1/opd/queue/call-next?doctorId={id}
```

#### Start Consultation
```http
POST /api/v1/opd/consultations/{queueItemId}/start
```

#### Complete Consultation
```http
POST /api/v1/opd/consultations/{id}/complete
```

Request:
```json
{
  "diagnosis": "Common cold",
  "notes": "Patient has mild symptoms",
  "prescriptions": [
    {
      "medicationName": "Paracetamol",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "duration": "5 days"
    }
  ],
  "followUpDate": "2024-01-22"
}
```

---

### IPD (Inpatient)

#### Get Admissions
```http
GET /api/v1/ipd/admissions
```

Query Parameters:
- `status` (int): Filter by status
- `wardId` (guid): Filter by ward

#### Admit Patient
```http
POST /api/v1/ipd/admissions
```

Request:
```json
{
  "patientId": "patient-guid",
  "bedId": "bed-guid",
  "admittingDoctorId": "doctor-guid",
  "attendingDoctorId": "doctor-guid",
  "admissionType": "Elective",
  "diagnosis": "Appendicitis",
  "isEmergency": false
}
```

#### Discharge Patient
```http
POST /api/v1/ipd/admissions/{id}/discharge
```

Request:
```json
{
  "dischargeSummary": "Patient recovered well",
  "followUpInstructions": "Follow up in 2 weeks",
  "medications": []
}
```

#### Transfer Bed
```http
POST /api/v1/ipd/admissions/{id}/transfer
```

Request:
```json
{
  "newBedId": "bed-guid",
  "reason": "Patient requested private room"
}
```

#### Get Available Beds
```http
GET /api/v1/ipd/beds/available
```

Query Parameters:
- `wardId` (guid): Filter by ward

---

### Billing

#### List Invoices
```http
GET /api/v1/billing/invoices
```

#### Create Invoice
```http
POST /api/v1/billing/invoices
```

Request:
```json
{
  "patientId": "patient-guid",
  "dueDate": "2024-02-15",
  "lineItems": [
    {
      "description": "Consultation Fee",
      "quantity": 1,
      "unitPrice": 500,
      "itemType": "Service"
    }
  ],
  "discountAmount": 50,
  "taxRate": 10
}
```

#### Record Payment
```http
POST /api/v1/billing/invoices/{id}/payments
```

Request:
```json
{
  "amount": 500,
  "paymentMethod": "Cash",
  "referenceNumber": "REF-001"
}
```

#### Void Invoice
```http
POST /api/v1/billing/invoices/{id}/void
```

Request:
```json
{
  "reason": "Duplicate entry"
}
```

---

### Doctors

#### List Doctors
```http
GET /api/v1/doctors
```

#### Get Doctor Schedule
```http
GET /api/v1/doctors/{id}/schedule
```

Query Parameters:
- `startDate` (date): Start date
- `endDate` (date): End date

---

### Reports

#### Revenue Report
```http
GET /api/v1/reports/revenue
```

Query Parameters:
- `startDate` (date): Start date
- `endDate` (date): End date

#### Patient Statistics
```http
GET /api/v1/reports/patients/statistics
```

#### Bed Occupancy
```http
GET /api/v1/reports/beds/occupancy
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API requests are rate limited:
- **Authenticated users**: 1000 requests per minute
- **Unauthenticated**: 100 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1704067200
```

---

## Versioning

API version is specified in the URL path:
- `/api/v1/` - Version 1 (current)

Deprecated versions will be supported for 6 months after a new version release.
