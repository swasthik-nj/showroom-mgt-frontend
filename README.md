# Showroom Management System

This project is a bike showroom management system built with React on the frontend and Node.js, Express, and MongoDB on the backend. It supports user registration, login, bike browsing, bike booking, booking tracking, admin bike management, and sales tracking.

## End-to-End Flow

1. A user registers or logs in through the authentication module.
2. The user browses the bike inventory and opens a bike detail page.
3. When the user books a bike, the backend checks for an existing active booking for the same bike and same user identity.
4. If no duplicate booking exists, a new booking is created with a unique booking ID and initial status history.
5. The admin can view all bookings, update booking tracking stages, and manage the bike inventory.
6. When a booking reaches delivered status, the backend updates the related bike stock, total sales, yearly sales, and delivery timestamp.
7. Sales summary and yearly sales reports are then available through the admin API.

## UML Design

### 1. Flowchart

```mermaid
flowchart TD
	A[Start] --> B[User Register or Login]
	B --> C[Browse Bike List]
	C --> D[Open Bike Details]
	D --> E{Bike Available?}
	E -- No --> F[Show Unavailable Message]
	E -- Yes --> G[Submit Booking Request]
	G --> H{Duplicate Active Booking Exists?}
	H -- Yes --> I[Return Conflict Response]
	H -- No --> J[Create Booking Record]
	J --> K[Store Initial Status History]
	K --> L[Admin Reviews Booking]
	L --> M[Update Tracking Stage]
	M --> N{Delivered?}
	N -- No --> O[Continue Tracking]
	N -- Yes --> P[Record Sale and Reduce Stock]
	P --> Q[Update Sales Summary]
	Q --> R[End]
```

### 2. Use Case View

```mermaid
flowchart LR
	User((User)) --> UC1[Register]
	User --> UC2[Login]
	User --> UC3[View Bikes]
	User --> UC4[Book Bike]
	User --> UC5[Track Booking]

	Admin((Admin)) --> UC6[Manage Bikes]
	Admin --> UC7[View Bookings]
	Admin --> UC8[Update Tracking]
	Admin --> UC9[View Sales]
```

### 3. System Component View

```mermaid
flowchart TB
	Client[React Frontend] --> API[Express REST API]
	API --> Auth[Auth Module]
	API --> Booking[Booking Module]
	API --> Admin[Admin Module]
	Auth --> DB[(MongoDB)]
	Booking --> DB
	Admin --> DB
```

## Detailed UML Diagrams

### 1. Class Diagram

```mermaid
classDiagram
	class User {
		+String username
		+String email
		+String password
		+String phone
		+String refreshToken
		+Date forgotPasswordExpire
		+String emailVarificationToken
		+Date emailVarificationExpiry
		+Boolean isEmailVarified
		+isPasswordCorrect(password)
		+generateAccessToken()
		+generateRefreshToken()
		+generateTempororyToken()
	}

	class Bike {
		+Number id
		+String name
		+String brand
		+Number price
		+Number engine_cc
		+String mileage
		+String fuel_type
		+String transmission
		+String[] color_options
		+Number stock
		+String image
		+String description
		+String bookingStatus
		+Number totalSoldUnits
		+Number totalSalesAmount
		+YearlySale[] yearlySales
	}

	class YearlySale {
		+Number year
		+Number units
		+Number amount
	}

	class Booking {
		+String bookingId
		+BookingUser user
		+BookingBike bike
		+String bookingStatus
		+Boolean isSaleRecorded
		+Date deliveredAt
		+BookingStatusHistory[] statusHistory
	}

	class BookingUser {
		+String userId
		+String username
		+String email
		+String phone
	}

	class BookingBike {
		+Number bikeId
		+String name
		+String brand
		+Number price
		+String image
		+Number engine_cc
		+String mileage
		+String fuel_type
		+String transmission
	}

	class BookingStatusHistory {
		+String status
		+String note
		+Date updatedAt
	}

	class AuthController {
		+registeredUser(req,res)
		+login(req,res)
	}

	class BookingController {
		+createBooking(req,res)
		+getBookingByBookingId(req,res)
		+getUserBikeBooking(req,res)
	}

	class AdminController {
		+addBike(req,res)
		+updateBike(req,res)
		+deleteBike(req,res)
		+getAllBookings(req,res)
		+updateBookingTrackingStatus(req,res)
		+getSalesSummary(req,res)
		+getYearlySalesDetails(req,res)
	}

	Bike "1" *-- "0..*" YearlySale : has
	Booking "1" *-- "1" BookingUser : embeds
	Booking "1" *-- "1" BookingBike : embeds
	Booking "1" *-- "0..*" BookingStatusHistory : tracks
	AuthController ..> User : uses
	BookingController ..> Booking : uses
	AdminController ..> Bike : manages
	AdminController ..> Booking : updates
```

### 2. Use Case Diagram

```mermaid
flowchart TB
	User((User))
	Admin((Admin))

	subgraph ShowroomSystem[Showroom Management System]
		UC1([Register])
		UC2([Login])
		UC3([View Bike Catalog])
		UC4([View Bike Details])
		UC5([Create Booking])
		UC6([Track Booking Status])
		UC7([Manage Bikes])
		UC8([View All Bookings])
		UC9([Update Tracking Status])
		UC10([Record Delivery and Sale])
		UC11([View Sales Summary])
	end

	User --> UC1
	User --> UC2
	User --> UC3
	User --> UC4
	User --> UC5
	User --> UC6

	Admin --> UC7
	Admin --> UC8
	Admin --> UC9
	Admin --> UC11

	UC5 -. include .-> UC2
	UC9 -. include .-> UC10
	UC10 -. include .-> UC11
```

### 3. Sequence Diagram

```mermaid
sequenceDiagram
	autonumber
	actor U as User
	participant FE as Frontend (React)
	participant API as Backend API (Express)
	participant BK as BookingController
	participant AD as AdminController
	participant DB as MongoDB

	U->>FE: Login(email,password)
	FE->>API: POST /api/v1/auth/login
	API->>DB: Find user and verify password
	DB-->>API: User document
	API-->>FE: Access token + user data

	U->>FE: Submit booking(user,bike)
	FE->>API: POST /api/v1/bookings
	API->>BK: createBooking()
	BK->>DB: Check duplicate active booking
	DB-->>BK: Not found
	BK->>DB: Insert booking with statusHistory=[confirmed]
	DB-->>BK: Booking created
	BK-->>FE: Booking success with bookingId

	actor A as Admin
	A->>FE: Update booking tracking to delivered
	FE->>API: PATCH /api/v1/admin/bookings/:bookingId/tracking
	API->>AD: updateBookingTrackingStatus()
	AD->>DB: Fetch booking and bike
	DB-->>AD: Booking + Bike
	AD->>DB: Update bike stock and sales
	AD->>DB: Update booking statusHistory and deliveredAt
	DB-->>AD: Updated records
	AD-->>FE: Tracking update success
	FE-->>A: Show delivered status and updated summary
```

### 4. Activity Diagram

```mermaid
flowchart TD
	S([Start]) --> A[User opens application]
	A --> B{Authenticated?}
	B -- No --> C[Register or Login]
	C --> D[Authentication success]
	B -- Yes --> E[Load bike catalog]
	D --> E
	E --> F[Select bike and view details]
	F --> G{Already booked by same user?}
	G -- Yes --> H[Show existing booking info]
	G -- No --> I[Create booking with confirmed status]
	I --> J[Add statusHistory entry]
	J --> K[Admin reviews booking queue]
	K --> L{Update stage}
	L -- confirmed/reaching-showroom --> M[Append tracking history]
	M --> K
	L -- delivered --> N[Validate bike stock]
	N --> O[Reduce stock and record sale]
	O --> P[Mark booking delivered]
	P --> Q[Update yearly and total sales]
	Q --> R[Display final booking state]
	H --> R
	R --> T([End])
```

## Data Model

The backend uses MongoDB collections that behave like tables in a relational system. The main collections are users, bikes, and bookings.

### User Collection

| Attribute | Type | Description |
| --- | --- | --- |
| username | String | Unique username for login and display |
| email | String | Unique email address, stored in lowercase |
| password | String | Hashed password |
| phone | String | User phone number |
| refreshToken | String | Refresh token for session renewal |
| forgotPasswordExpire | Date | Expiry time for password reset flow |
| emailVarificationToken | String | Hashed email verification token |
| emailVarificationExpiry | Date | Expiry time for email verification token |
| isEmailVarified | Boolean | Email verification status |
| createdAt | Date | Automatically added timestamp |
| updatedAt | Date | Automatically added timestamp |

### Bike Collection

| Attribute | Type | Description |
| --- | --- | --- |
| id | Number | Unique bike identifier |
| name | String | Bike name |
| brand | String | Manufacturer name |
| price | Number | Bike price |
| engine_cc | Number | Engine capacity |
| mileage | String | Mileage value |
| fuel_type | String | Fuel type |
| transmission | String | Transmission type |
| color_options | String[] | Available color options |
| stock | Number | Available units in inventory |
| image | String | Image URL |
| description | String | Detailed bike description |
| bookingStatus | String | Current booking state: pending, confirmed, in-transit, delivered, cancelled |
| totalSoldUnits | Number | Total units sold |
| totalSalesAmount | Number | Total sales amount |
| yearlySales | Object[] | Year-wise sales summary |
| createdAt | Date | Automatically added timestamp |
| updatedAt | Date | Automatically added timestamp |

### YearlySales Embedded Object

| Attribute | Type | Description |
| --- | --- | --- |
| year | Number | Sales year |
| units | Number | Units sold in that year |
| amount | Number | Sales amount for that year |

### Booking Collection

| Attribute | Type | Description |
| --- | --- | --- |
| bookingId | String | Unique booking reference ID |
| user | Object | Embedded user snapshot |
| bike | Object | Embedded bike snapshot |
| bookingStatus | String | Booking status: confirmed, processing, in-transit, reaching-showroom, delivered, cancelled |
| isSaleRecorded | Boolean | Indicates whether sale has been recorded |
| deliveredAt | Date | Delivery completion time |
| statusHistory | Object[] | Booking status history timeline |
| createdAt | Date | Automatically added timestamp |
| updatedAt | Date | Automatically added timestamp |

### Booking User Snapshot

| Attribute | Type | Description |
| --- | --- | --- |
| userId | String | Optional reference to the user account |
| username | String | Username at booking time |
| email | String | Email at booking time |
| phone | String | Phone number at booking time |

### Booking Bike Snapshot

| Attribute | Type | Description |
| --- | --- | --- |
| bikeId | Number | Bike identifier |
| name | String | Bike name |
| brand | String | Bike brand |
| price | Number | Bike price at booking time |
| image | String | Bike image URL |
| engine_cc | Number | Engine capacity |
| mileage | String | Mileage at booking time |
| fuel_type | String | Fuel type |
| transmission | String | Transmission type |

### Booking Status History Object

| Attribute | Type | Description |
| --- | --- | --- |
| status | String | Status entry for the booking timeline |
| note | String | Optional message for the update |
| updatedAt | Date | Time when the status was added |

## Key Process Summary

| Step | System Action |
| --- | --- |
| Authentication | Register and login users, then issue access and refresh tokens |
| Booking | Validate user and bike data, prevent duplicate active bookings, create a booking |
| Tracking | Admin moves booking forward through confirmed, reaching-showroom, and delivered stages |
| Delivery | On delivered, update bike stock, sales totals, and yearly sales records |
| Reporting | Admin views all bookings and sales summaries |

## Main API Routes

| Module | Route | Purpose |
| --- | --- | --- |
| Auth | /api/v1/auth/register | Register a new user |
| Auth | /api/v1/auth/login | Log in an existing user |
| Booking | /api/v1/bookings | Create a booking |
| Booking | /api/v1/bookings/user-bike | Get a user bike booking |
| Booking | /api/v1/bookings/:bookingId | Get booking by booking ID |
| Admin | /api/v1/admin/bikes | Manage bike inventory |
| Admin | /api/v1/admin/bookings | View all bookings |
| Admin | /api/v1/admin/bookings/:bookingId/tracking | Update booking tracking status |
| Admin | /api/v1/admin/sales/summary | View sales summary |
| Admin | /api/v1/admin/sales/yearly | View yearly sales details |

## Notes

- MongoDB collections are modeled like database tables, but the implementation uses Mongoose schemas.
- Booking records store a snapshot of user and bike data so historical booking details remain stable even if the main records change later.
- When a booking is marked delivered, the backend automatically updates inventory and sales reporting data.
