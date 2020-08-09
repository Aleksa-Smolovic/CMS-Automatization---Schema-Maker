# CMS Automatization - Schema Maker

## Description

CSM Automatization Generator helper client application for generating database schema.
Schema is exported in .json file which should be copied into `generator/generated-entities` folder in generator app.
Run the command for generating entities from schema: `php artisan entity:all` and specify name of the export file.

## Notes

- Since generator is built for CMS, models `User` and `Role` are already built, therefore are already reserved. Each new generated entity has `many-to-one` relation towards User entity.

- Curently supported relationship types: `many-to-one`
