# EcoLeaf Exim Website

Simple responsive website for EcoLeaf Exim, a manufacturer and distributor of bagasse products.

## Features

- Responsive homepage
- Company description
- Product catalog
- Why EcoLeaf section
- Contact page/form
- Contact form forwarded to owner's email through Nodemailer
- Environment variables for email credentials
- Comments throughout the code for easier maintenance

## Project structure

ecoleaf-exim/
├── public/
│   ├── index.html
│   ├── contact.html
│   ├── style.css
│   └── script.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md

## Run locally

1. Install Node.js.
2. Open a terminal in this project folder.
3. Run:

   npm install

4. Copy `.env.example` to `.env`.
5. Enter the email configuration in `.env`.
6. Start the website:

   npm start

7. Open:

   http://localhost:3000

## Gmail setup

If using Gmail, enable 2-Step Verification and create a Google App Password. Put the generated App Password in `EMAIL_PASSWORD`.

Do not use or publish your normal Gmail password.

## Company contact information

The website now displays:

- Phone: +91 777 900 3382
- Email: ecoleafexim@gmail.com

The contact form is configured to send submissions to `ecoleafexim@gmail.com` by default. You can override the recipient with the `OWNER_EMAIL` environment variable.

## Before publishing

Make sure the `.env` file contains the Gmail account credentials used to send the form emails.

Replace the emoji product placeholders with real EcoLeaf Exim product photographs.

Update product specifications, MOQ, dimensions, capacities, packaging quantities, and other business information with the company's actual details.

## Deployment

This project can be deployed to a Node.js-compatible hosting service. Make sure the hosting service has the following environment variables:

EMAIL_USER
EMAIL_PASSWORD
OWNER_EMAIL
PORT

Do not upload `.env` to a public repository.