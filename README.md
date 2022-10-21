# Address Book Maintenance

A rest api to maintain your address book or contact information.

**_Whats you get with this API project_**

-   Secure Sign Up and Login with JWT Authentication.
-   Secure API endpoints.
-   Add contacts of yours.
-   Import / Export your contact list.
-   Update / Delete your contact.

## Author

-   [Bilas Halder](https://github.com/Bilas-Halder)

## Roadmap

**_To use this project in your system follow the folloing steps_**

-   Install [Node JS](https://nodejs.org/en/download/) in your system.

-   Clone [this](https://github.com/Bilas-Halder/Address-Book-Maintenance-NodeJS) repository.

-   Add .env file in root directory.

-   Add environment variables in .env file.

```bash
    DB_URI=Your-mongodb-uri
    TOKEN_SECRET=Your-JWT-TOKEN-SECRET(preferred-> min-length=64)
```

-   Run following commands for development

```bash
    npm install --save
    npm run dev
```

-   Run following commands for server

```bash
    npm install
    npm start
```

## ⚠️ Notice

**_This project is currently running in a free tier service on [rendar.com](https://render.com/)_**

```
    - There maybe a delay on your first hit on the live link of this rest api.
    - Because the server stop for every 15 minute of inactivity.
    - So please be patient and wait for your first response.
    - Then enjoy the lightening fast rest api.
```

## Tech Stack

**Server:** NodeJS, ExpressJS

**Database:** Mongodb, Mongoose

## API Reference

**_Live Link : https://addressbookmaintenance.onrender.com_**

#### Current Version - 1

```http
  https://addressbookmaintenance.onrender.com/api/v1
```

#### Sign UP

```http
  POST live-link/api/v1/users/signup
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `name`     | `string` | **Required**. |
| `email`    | `string` | **Required**. |
| `password` | `string` | **Required**. |

_JSON Response_

```
User Info.
```

#### Login

```http
  POST live-link/api/v1/users/login
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `email`    | `string` | **Required**. |
| `password` | `string` | **Required**. |

_JSON Response_

```
User Info with a JWT authentication token.
```

**_⚠️ Notice_**

```
from now on every other API will need a header named Authentication
```

**_⚠️ Header_**
| Parameter | Type | Description |
| :-------- | :------- | :-------------------------------- |
| `Authentication` | `string` | **Required**. Bearer your-JSON-Web-Token-from-login|

#### Get Current user details

```http
  GET live-link/api/v1/users
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of item to fetch |

_JSON Response_

```
Current User Info.
```

#### Update Current User Account

```http
  PUT live-link/api/v1/users/${id}
```

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `id`      | `string` | **Required**. ID of current user |

#### Delete Current User Account

```http
  DELETE live-link/api/v1/users
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `email`    | `string` | **Required**. |
| `password` | `string` | **Required**. |

### Contact APIs

#### Get a single contact

```http
  GET live-link/api/v1/contacts/${id}
```

| Parameter | Type     | Description                     |
| :-------- | :------- | :------------------------------ |
| `id`      | `string` | **Required**. ID of the contact |

_JSON Response_

```
Contact details.
```

#### Get a contact lists

```http
  GET live-link/api/v1/contacts
```

| Parameter   | Type      | Description                                                                                                                                                                                                     |
| :---------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`  | **_Optional_**. Will match the \_id                                                                                                                                                                             |
| `firstName` | `string`  | **_Optional_**. Will match with First Name.                                                                                                                                                                     |
| `lastName`  | `string`  | **_Optional_**. Will match with Last Name.                                                                                                                                                                      |
| `email`     | `string`  | **_Optional_**. Will match with email.                                                                                                                                                                          |
| `phone`     | `string`  | **_Optional_**. Will match with phone number.                                                                                                                                                                   |
| `address`   | `string`  | **_Optional_**. Will match with address.                                                                                                                                                                        |
| -------     | -------   | **_--------------_**                                                                                                                                                                                            |
| `page`      | `integer` | **_Optional_**. The page number of selected contacts list.                                                                                                                                                      |
| `limit`     | `integer` | **_Optional_**. Number of contacts in a page.                                                                                                                                                                   |
| -------     | -------   | **_--------------_**                                                                                                                                                                                            |
| `sort`      | `string`  | **_Optional_**. Name of comma separated fields based on which sorting will be done. Ex: [ /contacts?sort=firstName,-LastName ] it will sort based on firstName first ascending and Last Name second descending. |
| `fields`    | `string`  | **_Optional_**. Name of comma separated fields which you want to get or don't want to get. Ex: [ /contacts?fields=email,-_id ] it will return you contacts only with email and there will be no \_id in those.  |

_JSON Response_

```
Matched Contacts List.
```

**_Example_**

```http
https://addressbookmaintenance.onrender.com/api/v1/contacts?page=2&limit=4&fields=email,phone,displayName,-id&sort=displayName
```

```output
The above request will return a JSON response where we will get 5th to 8th matched contacts because the requested page is 2 and the limit is 4, and those will be sorted by displayName in ascending order, and there will be only Email, Phone and Display Name on the contacts details.
```

#### Add a contacts information

```http
  POST live-link/api/v1/contacts
```

| Parameter   | Type     | Description                                               |
| :---------- | :------- | :-------------------------------------------------------- |
| `firstName` | `string` | **_Optional_**. First Name or Last Name should be filled. |
| `lastName`  | `string` | **_Optional_**. First Name or Last Name should be filled. |
| `email`     | `string` | **_Optional_**.                                           |
| `phone`     | `string` | **Required**.                                             |
| `address`   | `string` | **_Optional_**.                                           |

#### Update a contact

```http
  UPDATE live-link/api/v1/contacts/${id}
```

| Parameter   | Type     | Description                                               |
| :---------- | :------- | :-------------------------------------------------------- |
| `id`        | `string` | **Required**. ID of the contact                           |
| `firstName` | `string` | **_Optional_**. First Name or Last Name should be filled. |
| `lastName`  | `string` | **_Optional_**. First Name or Last Name should be filled. |
| `email`     | `string` | **_Optional_**.                                           |
| `phone`     | `string` | **_Optional_**.                                           |
| `address`   | `string` | **_Optional_**.                                           |

_JSON Response_

```
Updated Contact details.
```

#### Delete a contact

```http
  DELETE live-link/api/v1/contacts/${id}
```

| Parameter | Type     | Description                     |
| :-------- | :------- | :------------------------------ |
| `id`      | `string` | **Required**. ID of the contact |
