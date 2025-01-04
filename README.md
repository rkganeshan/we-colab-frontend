## WE COLAB

Steps to run this project locally.
Assumption: Node 16 or higher is a pre-requisite. Visit https://nodejs.org/en to get the package.

1. Clone the repository:

   ```bash
   git clone https://github.com/rkganeshan/we-colab-frontend.git
   cd we-colab-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or if using Yarn:

   ```bash
   yarn install
   ```

## Environment Variables

Add your environment variables in a `.env` file at the root of the project. Example:

```env
VITE_APP_MODE="prod"
```

OR

```env
VITE_APP_MODE="local"
```

If you point to local you need to run the server locally.
To setup the same you can visit : https://github.com/rkganeshan/we-colab-backend , and set it up from there.

## Usage

### Development

Run the development server:

```bash
npm run dev
```

or with Yarn:

```bash
yarn dev
```

### Build

Build the project for production:

```bash
npm run build
```

or with Yarn:

```bash
yarn build
```

## Scripts

Here is a list of common scripts for this project:

- `dev`: Starts the development server at port 5173.
- `build`: Builds the project for production.

## Assumptions made:

1. Eraser related code has been commented out, as eraser is currently not implemented for shapes.

2. The backend has been deployed on Render in a free tier, and since the app uses socket, there are chances that the backend service may go down.
