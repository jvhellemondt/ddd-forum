#!/bin/sh

BASE_URL='http://localhost:3000'

print_response() {
    response=$1
    code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d' | jq .)

    case $code in
        2*)
            tput setaf 2
            echo "Response Code: $code"
            ;;
        4*|5*)
            tput setaf 1
            echo "Response Code: $code"
            ;;
        *)
            tput setaf 3
            echo "Response Code: $code"
            ;;
    esac
    tput sgr0
    echo "$body"
}

echo "ERROR | it should return user not found / 404"
response=$(curl --silent --location --write-out "\n%{http_code}" "${BASE_URL}/users?email=john%40EXAMPLE.c")
print_response "$response"

echo "ERROR | it should return user not found / 404"
response=$(curl --silent --location --request PUT --write-out "\n%{http_code}" "${BASE_URL}/users/edit/101" \
--header 'Content-Type: application/json' \
--data '{
    "lastName": "Snow"
}')
print_response "$response"

echo "ERROR | it should throw a validation error / 400"
response=$(curl --silent --location --write-out "\n%{http_code}" "${BASE_URL}/users/new" \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "john",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "notValidField": "error"
}')
print_response "$response"

echo "SUCCESS | it should create the user / 201"
response=$(curl --silent --location --write-out "\n%{http_code}" "${BASE_URL}/users/new" \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "john",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
}')
print_response "$response"

echo "ERROR | it should return username already in use / 409"
response=$(curl --silent --location --write-out "\n%{http_code}" "${BASE_URL}/users/new" \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "john",
    "email": "john-snow@example.com",
    "firstName": "John",
    "lastName": "Doe"
}')
print_response "$response"

echo "ERROR | it should return email already in use / 409"
response=$(curl --silent --location --write-out "\n%{http_code}" "${BASE_URL}/users/new" \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "john-snow",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
}')
print_response "$response"

echo "SUCCESS | it should return the user / 200"
response=$(curl --silent --location --write-out "\n%{http_code}" "${BASE_URL}/users?email=john%40EXAMPLE.com")
print_response "$response"

echo "ERROR | it should return validation error / 400"
response=$(curl --silent --location --request PUT --write-out "\n%{http_code}" "${BASE_URL}/users/edit/101" \
--header 'Content-Type: application/json' \
--data '{
    "admin": true
}')
print_response "$response"

echo "SUCCESS | it should update the user / 201"
response=$(curl --silent --location --request PUT --write-out "\n%{http_code}" "${BASE_URL}/users/edit/101" \
--header 'Content-Type: application/json' \
--data '{
    "username": "winter-is-coming",
    "lastName": "Snow"
}')
print_response "$response"
