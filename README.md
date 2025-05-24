# AnyDownloader Frontend

AnyDownloader is a React-based frontend application that provides utilities for downloading media from various websites and social media platforms such as Instagram, YouTube, and the internet. The app allows users to download reels, clips, images, albums, videos, subtitles, and entire playlists with ease. The project is actively maintained with plans to support additional platforms like Facebook and more.

## Features

- Download Instagram reels, clips, images, and albums by pasting the Instagram post URL.
- Download YouTube videos, subtitles, and entire playlists by pasting the video or playlist URL.
- Download openly available images and videos from the internet by providing media links.
- User-friendly interface with navigation and responsive design.
- Storybook integration for UI component development and testing.

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18.17.1 or higher recommended)
- npm (comes with Node.js)
- Need the AnyDownloader-backend to function: `https://github.com/namanthapliyal/AnyDownloader-backend`

### Installation

1. Clone the repository: `https://github.com/namanthapliyal/AnyDownloader-frontend` and navigate to the `AnyDownloader-frontend` directory.
2. Install the dependencies:

```bash
npm install
```

### Running the App

To start the development server and run the app locally:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app. The page will reload automatically when you make changes.

### Running Tests

To launch the test runner in interactive watch mode:

```bash
npm test
```

### Building for Production

To build the app for production, which bundles React in production mode and optimizes the build for best performance:

```bash
npm run build
```

The build output will be in the `build` folder, ready for deployment.

### Storybook

To run Storybook for UI component development and testing:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to view Storybook.

To build the static Storybook site:

```bash
npm run build-storybook
```

## Folder Structure

- `public/` - Static assets like images, icons, and the main HTML file.
- `src/` - Source code for the React app.
  - `components/` - React components such as Home, Instagram, Youtube, Internet, Playlist, Video, Navbar, and Footer.
  - `stories/` - Storybook stories and assets for UI components.
  - `App.js` - Main app component.
  - `index.js` - Entry point for React.
- `package.json` - Project metadata, dependencies, and scripts.

## Technologies Used

- React
- Create React App
- React Router DOM
- Axios
- Storybook
- Jest and React Testing Library

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact the project maintainer.

---

This README was generated based on the current frontend app structure and features.
