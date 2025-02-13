# TheCICS - Thesis Repository Knowledge Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A centralized digital repository system designed to streamline thesis management and accessibility for NEU students and faculty members.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technical Requirements](#technical-requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

## Overview

TheCICS addresses the growing challenge of managing and accessing research papers within academic institutions. This system provides a structured approach to storing, categorizing, and retrieving thesis documents, enabling efficient knowledge sharing across the university community.

## Features

🔍 Advanced Search Capabilities
- Topic-based filtering
- Author search functionality
- Year-specific queries
- Keyword matching
- Full-text search integration

📄 Document Management
- PDF preview system
- Automated citation generation
- Version control
- Metadata management

🔒 Security & Access Control
- NEU student/faculty authentication
- Role-based permissions
- Secure document storage
- Activity logging

🎯 User Experience
- Responsive design
- Intuitive interface
- Mobile optimization
- Accessibility compliance

## Technical Requirements

### Server Requirements
- PHP 8.0+
- MySQL 8.0+
- Composer
- Node.js (for frontend development)

### Development Dependencies
- Tailwind CSS
- Laravel Framework
- Elasticsearch (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/[repository-url].git
   ```
   
2. Set up the environment:
   ```bash
   cp .env.example .env
   composer install
   php artisan migrate
   ```

3. Configure the database:
   ```php
   // .env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=thecics_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. Install frontend dependencies:
   ```bash
   npm install
   npm run dev
   ```

## Usage

### Authentication
Users must authenticate using valid NEU credentials before accessing the system.

### Document Upload Process
1. Navigate to the upload section
2. Fill required metadata fields:
   - Title
   - Authors
   - Department
   - Keywords
   - Abstract
3. Attach PDF document
4. Submit for review

### Search Functionality
- Use the main search bar for quick queries
- Apply filters for advanced searching
- Browse by department/year for categorized access

## Contributing

Pull requests are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Add tests
5. Submit pull request

Please ensure all contributions align with our coding standards and include proper documentation.

## License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.

## Team
- [Macorol] - Scrum Master
- [Mancera] 
- [Macalanda]
- [Salenga]
- [Cabanilla]
  
## Contact

For questions or concerns, please contact:
[Renard Macorol](rmacorol18@gmail.com)

## Changelog

v0.0.0 - Planning
- Finalized System Design
- Finalized Primary Assets
- Static Implementation

