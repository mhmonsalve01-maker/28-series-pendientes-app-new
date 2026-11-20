# Evidencia: hook de pre-commit

El hook (.husky/pre-commit) ejecuta lint, typecheck y pruebas antes de cada commit.

Prueba: se agregó `const x: number = 'texto';` en src/services/decision.ts.
Resultado: el commit fue bloqueado por el typecheck (TS2322: Type 'string' is not assignable to type 'number'), husky: pre-commit script failed (code 2).
Se revirtió el cambio y el commit siguiente pasó.
