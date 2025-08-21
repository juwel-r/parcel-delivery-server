## **Parcel Delivery API – Comprehensive Reference**

### **1️⃣ Project Overview**

* Backend API for parcel delivery system (like Pathao Courier / Sundarban).
* Tech Stack: **Node.js**, **Express.js**, **Mongoose**, **JWT**, **bcrypt**, **Zod**.
* Focus: **Secure, modular, role-based system** with sender, receiver, and admin roles.
* Key Features:

  * Parcel creation, tracking, and status updates.
  * Role-based access control.
  * Parcel history with embedded status logs.
  * Fee calculation (weight-based).
  <!-- * Optional: Delivery agent/hub assignment. -->

---

### **2️⃣ Roles & Permissions**

| Role         | Permissions                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------ |
| **Sender**   | Create parcel, cancel (before dispatch), view own parcels & status logs, swap roles              |
| **Receiver** | View incoming parcels, confirm delivery (after transit), view delivery history, swap roles       |
| **Admin**    | View/manage all users & parcels, block/unblock parcels, update status|
| **Public**   | Track parcel by tracking ID (no login needed)                                                    |

**Role-based logic**

* Sender → can only send parcels to existing receivers.
* Only parcel owner + admin → can cancel parcel.
* Only receiver + admin → can mark parcel status as delivered.
* Sender/Receiver → can swap roles.
* Blocked or deleted users → can use public tracing only.

---

### **3️⃣ Authentication & Security**

* **JWT-based** login system.
* Passwords hashed via **bcryptjs**.
* Access token & refresh token system implemented.
* `AppError` custom error handling class.
* Middleware for:

  * Role-based authorization.
  * Validation using **Zod** schemas.

**Auth Routes**

```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
POST /api/v1/auth/reset-password
```

---

### **4️⃣ Users**

* Roles: `admin`, `sender`, `receiver`.
* A System Admin auto-created on server startup.
* User Routes:

```text
GET /api/v1/users/                # All users
GET /api/v1/users/:id             # Get user by ID
PATCH /api/v1/users/:id           # Update user
DELETE /api/v1/users/:id          # Delete user
```

* Optional search/fields/filter/sort implemented for users.
* Only allowed actions per role.

---

### **5️⃣ Parcel Design**

**Parcel Fields**

* `type` (document, package, etc.)
* `weight`
* `senderId`
* `receiverId` (must exist)
* `pickupAddress`
* `deliveryAddress`
* `weight` 
* `fee` (calculated based on weight)
* `deliveryDate`
* `trackingId` (format: `TRK-YYYYMMDD-xxxxxx`)
* `statusLogs` (array of subdocuments)

  * Each log: `status`, `timestamp`, `updatedBy`, `location`, `note`

**Parcel Status Flow**

* `Requested → Approved → Dispatched → In Transit → Delivered`
* Only allowed transitions enforced.

**Parcel Routes**

```text
POST   /api/v1/parcels/create                # Sender creates parcel
GET    /api/v1/parcels/                      # Admin: all parcels
GET    /api/v1/parcels/:id                   # Parcel details
GET    /api/v1/parcels/sender/:id            # Sender parcels
GET    /api/v1/parcels/receiver/:id          # Receiver incoming parcels
GET    /api/v1/parcels/receiver/:id/delivered
GET    /api/v1/parcels/receiver/:id/upcoming
GET    /api/v1/parcels/:trackingId/history   # Tracking info: public route
PATCH  /api/v1/parcels/:id/update
PATCH  /api/v1/parcels/:id/cancel
PATCH  /api/v1/parcels/:id/deliver
PATCH  /api/v1/parcels/:id/block
```

**Parcel Rules**

* Sender can cancel **only before dispatch**.
* Receiver can deliver **only after transit**.
* Only owner/admin can cancel or block.
* Parcel cannot be deleted; status changes tracked.
* Fee automatically calculated based on weight.
* Status logs embedded inside parcel.
* Public tracking allowed via tracking ID.


* Optional search/fields/filter/sort implemented for users.
* Only allowed actions per role.

---

### **6️⃣ Status & Tracking**

* Stored as subdocument in parcel.
* Fields:

  * `status`
  * `timestamp`
  * `updatedBy`
  * `location`
  * `note`

* Search/filter possible by (Parcel):

* `pickup Address`
* `delivery Address`
* `delivery Date`
* `type`
* `details`
* `current Status`

* Search/filter possible by (User):

  * `name`
  * `email`
  * `phone`
  * `address`
  * `role`
  * `isActive`


---

### **7️⃣ Validation & Business Logic**

* Zod validation for all input data.
* Only existing receivers allowed for parcel creation.
* Only permitted role actions allowed (sender/receiver/admin).
* Swap roles feature for sender/receiver.
* Access token & refresh token implemented.
* Custom error responses with `AppError`.

---

### **8️⃣ Optional / Bonus Features**

* Fee calculation (weight-based)
* Parcel tracking via tracking ID
* Filtering, sorting, and search in user & parcel lists
* Role swapping between sender & receiver
* Parcel logs and history

---

### **9️⃣ Project Structure**

```text
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── parcel/   # includes status log internally
├── middlewares/
├── config/
├── utils/
├── app.ts
```

---

### **🔧 Packages Used**

```json
"dependencies": {
  "bcryptjs", "cookie-parser", "cors", "dotenv", "express",
  "http-status-codes", "jsonwebtoken", "mongoose", "zod"
},
"devDependencies": {
  "@eslint/js", "@types/cookie-parser", "@types/cors", "@types/dotenv",
  "@types/express", "@types/http-status-codes", "@types/jsonwebtoken",
  "@types/mongoose", "eslint", "ts-node-dev", "typescript", "typescript-eslint"
}
```

---

### **🔁 API Design Notes**

* RESTful endpoints.
* Proper HTTP status codes & error messages.
* Embedded status logs returned with parcel details.
* Sorting, filtering, search available for parcels and users.
* JWT & role-based middleware used across all endpoints.

---
