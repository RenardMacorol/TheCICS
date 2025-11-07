# TheCICS - Thesis Repository Knowledge Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A centralized digital repository system designed to streamline thesis management and accessibility for NEU students and faculty members.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technical Requirements](#technical-requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Team](#team)
* [Contact](#contact)
* [Changelog](#changelog)

---

## Overview

**TheCICS** addresses the increasing challenge of managing and accessing research outputs within academic institutions. This system offers a structured digital repository where students and faculty can upload, categorize, and retrieve thesis documents efficiently.  

The frontend is built with **React**, **Vite**, and **Tailwind CSS**, while **Supabase** provides backend services such as authentication, database management, and file storage.

---

## Features

🔍 **Advanced Search Capabilities**
- Keyword and full-text search
- Department and year filtering
- Author-based lookup
- Tag and topic categorization

📄 **Document Management**
- PDF upload and preview
- Metadata and citation management
- Version control
- Automated organization by department/year

🔒 **Security & Access Control**
- Supabase-based authentication
- Role-based access (admin, faculty, student)
- Secure file storage
- Activity logging for audit trail

🎯 **User Experience**
- Responsive and accessible UI
- Modern, minimal design with Tailwind CSS
- Fast, real-time updates powered by Supabase
- Mobile-first optimization

---

## Technical Requirements

### Server Requirements
- Node.js 20+
- npm or pnpm
- Supabase account (for backend)
- Optional: Docker for containerized deployment

### Frontend Dependencies
- React 19
- Vite 6
- Tailwind CSS 4
- Supabase JS SDK
- React Router DOM 7
- Lucide React (for icons)
- TypeScript (for static typing)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[repository-url].git
   cd thesis-repo
