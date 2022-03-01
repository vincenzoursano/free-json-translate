## Free json translate

A script that gives you the ability to translate a i18n JSON nested for free without using any service keys.

## Project Status

This project is currently in development. 

TODO: Make the translation of the xlsx file automatic.

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`  

To Start Script:

`npm start`

## How does it work?

1. The json is transformed into an xlsx file.
2. Then you have to drag the generated xlsx file into Google Translate https://translate.google.com/?sl=it&tl=en&op=docs.
3. Select the desired language and download the file.
4. Place the xlsx into the project.
5. The original json is reconstructed with the new translations. (position of some keys may change)
