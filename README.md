# TheCICS - Thesis Repository Knowledge Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A centralized digital repository system designed to streamline thesis management and accessibility for NEU students and faculty members.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technical Requirements](#technical-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Docker Deployment](#docker-deployment-optional)
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)
- [Contact](#contact)
- [Changelog](#changelog)

---

## Overview

**TheCICS** addresses the increasing challenge of managing and accessing research outputs within academic institutions.  
This system offers a structured digital repository where students and faculty can upload, categorize, and retrieve thesis documents efficiently.

The frontend is built with **React**, **Vite**, and **Tailwind CSS**, while **Supabase** provides backend services such as authentication, database management, and file storage.

---

## Features

### 🔍 Advanced Search Capabilities
- Keyword and full-text search  
- Department and year filtering  
- Author-based lookup  
- Tag and topic categorization  

### 📄 Document Management
- PDF upload and preview  
- Metadata and citation management  
- Version control  
- Automated organization by department/year  

### 🔒 Security & Access Control
- Supabase-based authentication  
- Role-based access (admin, faculty, student)  
- Secure file storage  
- Activity logging for audit trail  

### 🎯 User Experience
- Responsive and accessible UI  
- Modern, minimal design with Tailwind CSS  
- Fast, real-time updates powered by Supabase  
- Mobile-first optimization  

---

## Technical Requirements

### Server Requirements
- **Node.js** 20+  
- **npm** or **pnpm**  
- **Supabase** account (for backend)  
- **Docker** (optional, for containerized deployment)

### Frontend Dependencies (High-Level)
- **React** 19  
- **Vite** 6  
- **Tailwind CSS** 4  
- **Supabase JS SDK**  
- **React Router DOM** 7  
- **Lucide React** (for icons)  
- **TypeScript** (for static typing)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[repository-url].git
   cd thesis-repo


2. **Install dependencies**

   ```bash
   npm install
   ```

   or (if using pnpm)

   ```bash
   pnpm install
   ```

3. **Create a `.env` file**

   ```bash
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Access the app at: [http://localhost:5173](http://localhost:5173)

---

## Usage

### Authentication

Users must log in with valid NEU credentials or through Supabase-managed authentication to access the repository.

### Document Upload Workflow

1. Navigate to the **Upload Section**
2. Fill in required metadata fields:

   * Title
   * Author(s)
   * Department
   * Year
   * Keywords
   * Abstract
3. Attach the PDF document
4. Submit for review or publication

### Search & Retrieval

* Use the main search bar for quick queries
* Apply filters for refined search results
* Browse by department, topic, or year

---

## Docker Deployment (Optional)

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build and Run

```bash
docker build -t thecics .
docker run -p 8080:80 thecics
```

Then visit: [http://localhost:8080](http://localhost:8080)

---

## Contributing

Pull requests are welcome!
To contribute:

1. Fork the repository
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```
3. Implement and test your changes
4. Commit and push:

   ```bash
   git commit -m "Add new feature"
   git push origin feature/your-feature
   ```
5. Submit a Pull Request

Please follow project coding standards and include documentation updates when applicable.

---

## License

This project is licensed under the **MIT License** — see [LICENSE.md](LICENSE.md) for details.

---

## Team

| Role         | Name               |
| ------------ | ------------------ |
| Scrum Master | **Renard Macorol** |
| Developer 1  | **Cabanilla**      |
| Developer 2  | **Macalanda**      |
| Analyst      | **Mancera**        |
| Tester       | **Salenga**        |

---

## Contact

📧 **[rmacorol18@gmail.com](mailto:rmacorol18@gmail.com)**

---
