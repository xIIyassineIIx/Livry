#Key Features    

Client:

Place delivery orders

Track packages in real-time

View order history and status updates

Administrator:

Manage users, drivers, and mechanics

Oversee all deliveries and operations

Generate reports and analytics

Driver:

View assigned deliveries

Update package status

Access navigation tools for delivery routes

Mechanic:

Manage vehicle maintenance schedules

Update vehicle availability

General:

Role-based dashboards

Real-time location tracking

#Tech Stack

Frontend: Angular 18

Backend: (Specify: Node.js, Firebase, or other)

Database: (Specify: Firestore, MySQL, PostgreSQL, etc.)

Real-time Communication: (Specify: Firebase Realtime DB, Socket.io, etc.)

Tools & Libraries: Angular Material, RxJS, etc.

#Architecture & Code Structure
src/
 ├── app/
 │    ├── components/        # Reusable UI components
 │    ├── pages/             # Role-based pages: client, admin, driver, mechanic
 │    ├── services/          # API calls and business logic
 │    ├── modules/           # Feature modules
 │    └── app.module.ts      # Root module
 ├── assets/                 # Images, icons, styles
 └── environments/           # Environment configuration


Modules & Routing: Separate modules for different roles for cleaner architecture.

Services: Handle API requests, data sharing, and real-time updates.

Guards: Protect routes based on user roles.

#Installation

Clone the repository:

git clone https://github.com/xIIyassineIIx/livry.git


Navigate to the project folder:

cd livry


Install dependencies:

npm install


Start the development server:

ng serve


Open the app in your browser: http://localhost:4200

#Usage

Log in as different roles to explore dashboards.

Place a delivery order as a client.

Track delivery status in real-time.

Admins can manage users, drivers, and deliveries.

Screenshots / Demo

<img width="747" height="569" alt="Screenshot 2025-11-27 210155" src="https://github.com/user-attachments/assets/c05366a5-aaae-4761-9796-0d775a6c79bc" />
<img width="1912" height="902" alt="Screenshot 2025-11-27 210223" src="https://github.com/user-attachments/assets/ca70a906-d0f6-4339-97c7-0d539be518ad" />
<img width="1912" height="910" alt="Screenshot 2025-11-27 210232" src="https://github.com/user-attachments/assets/48cbe0db-ac00-4b9a-8407-196c6a4c415f" />
<img width="1892" height="901" alt="Screenshot 2025-11-27 210347" src="https://github.com/user-attachments/assets/d965e5ca-32db-4d29-b6e6-da8629ecaf29" />
<img width="1896" height="892" alt="Screenshot 2025-11-27 210358" src="https://github.com/user-attachments/assets/74f49341-d581-45e6-8bb7-6c4f9fe10f3c" />
<img width="1435" height="711" alt="Screenshot 2025-11-27 210411" src="https://github.com/user-attachments/assets/e64015d1-f503-48b5-bf64-f3b72c4f303d" />
<img width="1429" height="814" alt="Screenshot 2025-11-27 210451" src="https://github.com/user-attachments/assets/178e5180-ec8a-4497-bce9-8808f05d0167" />
<img width="1455" height="894" alt="Screenshot 2025-11-27 210507" src="https://github.com/user-attachments/assets/3b88ffd8-b613-4ebd-8c5b-05d967e26221" />


there is Homepage, Client Dashboard, Driver Map, Admin Panel ets..

#Testing

Unit Tests:

ng test


End-to-End Tests:

ng e2e




#Roadmap / Future Improvements

Mobile version with Flutter

Advanced analytics for admin

Push notifications for clients and drivers

AI-based route optimization

#Contact
https://www.linkedin.com/in/yassine-akkari/
