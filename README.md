# MinitMoney

MinitMoney is a financial management application that allows users to register, create transactions, and perform money transfers using mock exchange rates. Built using Node.js, Prisma for ORM, and MySQL for the database, it offers secure authentication with JWT and supports the following key features:

- **User registration and login** using JWT.
- **Transaction creation and retrieval**, including details like exchange rates, fees, and net amounts.
- **Send money flow** with mock exchange rates to simulate real-world transactions.
- **ZAR -> USD = 0.055, ZAR -> KES = 7.1**

## Features
- User registration and login with secure JWT-based authentication.
- Create and retrieve financial transactions with detailed information (recipient, amount, currency, exchange rates, etc.).
- Simulate sending money with adjustable mock exchange rates and transaction fees.
- Robust database management with Prisma and MySQL.
  
## Tech Stack
- **Backend**: Node.js
- **Database**: MySQL (managed with Prisma)
- **Authentication**: JWT (JSON Web Token)
- **ORM**: Prisma
- **Environment Configuration**: .env file

---

## Setup Instructions

Follow these steps to set up and run the project locally:

### Prerequisites

Make sure you have the following software installed on your machine:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **npm** (Node Package Manager): Comes installed with Node.js
- **MySQL**: [Download MySQL](https://dev.mysql.com/downloads/)
- **Prisma CLI**: `npm install -g prisma` (for migrations and DB management)(https://www.prisma.io/)

### Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/DevBrightMinds/minitmoney.git

cd minitmoney
```

### Install Dependencies 

```bash
npm install 
```

### Create a MYSQL DB in your host machine 

- Using MySQL Workbench or similar - create a mysql db - name it minitmoneydb or anything you want
- Remeber to update the DB name accordingly should you name it something other than minitmoneydb

### Create a .env file and add the following info on it

link up the fields with information required, db, user, password etc

- **DATABASE=minitmoneydb**
- **DB_USERNAME=** 
- **DB_PASSWORD=**
- **DB_HOST=localhost**
- **DB_PORT=3306**
- **BCRYPT_SALT_NUM=12**
- **APPPORT=5500**
- **CRYPT_CODE=@MINITMONEY@SVC**
- **REFRESHTOKENSECRET=**
- **TOKENSECRET=**
- **DATABASE_URL="mysql://<DB_USERNAME>:<DB_PASSWORD>@localhost:3306/minitmoneydb"**

### Running a migration

``` bash
npx prisma generate
```

``` bash
npx prisma migrate dev --name init
```

- **Your examplary / Suggested Models used to build the App**

``` bash
model User {
    id Int @id @default(autoincrement())
    email String @unique
    password String
    sessions Session[]
    createdAt DateTime @default(now())
    transactions Transaction[]
}

model Session {
    id Int @id @default(autoincrement())
    user User @relation(fields: [userId], references: [id])
    userId Int
    token String
    createdAt DateTime @default(now())
}

model Transaction {
    id Int @id @default(autoincrement())
    user User @relation(fields: [userId], references: [id])
    userId Int
    recipient String
    amount Float
    currency String
    exchangeRate Float
    fee Float
    netAmount Float
    createdAt DateTime @default(now())
}
```

### Should you wish to Seed the DB

```bash 
-- SQL Seed Data for MinitMoney

-- Inserting a sample user
INSERT INTO `User` (`email`, `password`, `createdAt`)
VALUES 
  ('user@example.com', '$2a$12$Xn8uXk9QJbczJsp8DgB9JeRJjFfAkPJBxkc7SKyxHcXsCkZyQxhQm', NOW());

-- Inserting a sample transaction
INSERT INTO `Transaction` (`userId`, `recipient`, `amount`, `currency`, `exchangeRate`, `fee`, `netAmount`, `createdAt`)
VALUES 
  (1, 'recipient@example.com', 100.0, 'USD', 1.2, 2.0, 98.0, NOW());

-- You can add more seed data as needed...
```

Then run this command to execute the seeing 

```bash
mysql -u <your_username> -p <your_database_name> <prisma/seed.sql>
```

With the 'seed.sql' being a file that you will create - containing the SQL commands above

### To run the app

for dev

```bash
npm run dev
```

to build a prod ENV or a distribution files for PROD

```bash
npm run build
```

to run the prod env

```bash
npm run start
```

### API Docs in Swagger 

On your web browser, enter http://localhost:5500/api-docs/ 