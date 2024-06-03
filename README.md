# Udemy Courses Coupons Free Scraper

This project is a web scraper that collects free Udemy courses and saves them in a JSON file. This scraper is designed to be used with a Discord bot named ChatGpt.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/udemy-courses-coupons-free-scraper.git
   cd udemy-courses-coupons-free-scraper
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

To start the scraper in development mode, run:

```bash
npm run dev
```

To build the project for deployment, run:

```bash
npm run build
```

The scraper will navigate to the specified URL, collect the free Udemy courses, and save them into a JSON file located in the output directory.

## Scripts

1. `npm run dev`: Starts the scraper in development mode.
2. `npm run build`: Builds the project for deployment.

## Configuration

The main configuration for the scraper can be found in the config.js file. Key variables include:

1. url: The URL of the Udemy courses page to scrape.

```javascript
URL_PAGE=https://xx.xxxxxx.com/xxxxx?xxxx=x;
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
