---
description: Restrict ticket visibility for Medicos
---
1. Modify `src/app/interceptors/auth.interceptor.ts` to intercept GET requests to `/tickets`.
2. In the interceptor, check if the user has `ROLE_MEDICO` and does NOT have `ROLE_ADMINISTRADOR` using `AuthService`.
3. If the user matches the criteria, retrieve the `medicoId` from `AuthService.getUserId()`.
4. Clone the request and append `medicoId` as a query parameter.
5. Ensure the Authorization header is still added.
