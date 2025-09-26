# SyncSpace

![SyncSpace Logo](https://raw.githubusercontent.com/prodot-com/SyncSpace/main/Frontend/src/assets/favicon.svg)

SyncSpace is a powerful and intuitive web application designed to streamline team collaboration, task management, and administrative oversight. It provides a centralized platform for creating and managing teams, assigning and tracking tasks, and ensuring seamless communication through real-time notifications.

## Live Link
https://sync-space-dun.vercel.app/

## ✨ Features

* **User Authentication & Authorization:** Secure login and registration with role-based access control (Admin, Member).
* **Dynamic Dashboard:** Personalized dashboards for users to view relevant tasks and team information.
* **Team Management:**
    * **Create/Edit Teams:** Admins can easily create new teams and modify their details (name, description).
    * **Manage Members (Admin Only):** Admins have full control to add or remove users from any team.
    * **View Members (All Users):** All authenticated users can view the members of any team for transparency.
* **Task Management:** (Assuming this is present or planned)
    * Create, assign, update, and track tasks within teams or individually.
    * Real-time updates to task status and assignments.
* **Real-time Notifications:**
    * Users receive instant notifications for important updates (e.g., new tasks, team changes).
    * Unread notification count displayed in the header.
    * Clicking a notification marks it as read and navigates to the relevant content.
* **User Profile Management:**
    * Users can edit their personal profiles (name, email, skills, portfolio, rate).
    * Secure password change functionality.
* **Admin Panel:** (Assuming this is present or planned, based on `Admin/${currentUser._id}` route)
    * Dedicated section for administrators to manage users, roles, and other system-wide settings.
* **Responsive Design:** Optimized for a seamless experience across various devices.
* **Instant UI Updates:** All changes (team creation, edits, member management, notifications) reflect immediately in the UI without needing a page refresh.

## 🚀 Technologies Used

* **Frontend:** React.js, React Router DOM, Axios
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT (JSON Web Tokens)
