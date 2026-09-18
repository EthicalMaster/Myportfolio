# Taher Saifee — Creative Developer Portfolio

A modern, immersive portfolio built with **Next.js**, **React Three Fiber**, **Tailwind CSS**, and **Framer Motion**.

This portfolio focuses on an editorial, cinematic visual language rather than a standard card-based dashboard, featuring a custom 3D WebGL background and fluid typographic animations.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D / WebGL:** Three.js & React Three Fiber
- **Smooth Scrolling:** Lenis
- **Icons:** Lucide React

## Features

- **Custom 3D Environment:** A rotating, atmospheric 3D mesh built with React Three Fiber.
- **Cinematic Motion:** Advanced scroll-triggered animations and text reveals via Framer Motion.
- **Smooth Scrolling:** Hardware-accelerated smooth scrolling using Lenis.
- **Custom Cursor:** Integrated interactive custom cursor that responds to interactive elements.
- **Fully Responsive:** Optimized across desktop, tablet, and mobile devices.

## Running Locally

First, make sure you have [Node.js](https://nodejs.org/) installed, then run the following commands:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization

- **Content:** Update your personal information, skills, and social links in `data/about.ts`.
- **Projects:** Add or remove portfolio projects in `data/project.ts`.
- **Visuals:** The 3D background parameters (color, speed, density) can be adjusted inside `components/ScrollMesh.tsx`.

## License

Created by [Taher Saifee](https://www.linkedin.com/in/taher-saifee).
