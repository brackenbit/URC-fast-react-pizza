# Fast React Pizza Co.

Project built as part of "The Ultimate React Course 2024: React, Next.js, Redux & More" by Jonas Schmedtmann

Built to learn Tailwind CSS and newer React Router functions, and practice using modern Redux.

## Improvements made from tutorial project:

-   added geolocation timeout
-   improved userSlice error handling
-   simplified Button component
-   prevented position data being shared when user has manually overwritten address

## NB:

vite.config.js is configured to use self-signed certificates for HTTPS, which are omitted by gitignore.
To generate appropriate certificates, use e.g.:

```bash
openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 1095 -nodes -subj '/CN=localhost'
```

and place the resulting files in /cert.
