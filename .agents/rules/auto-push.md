---
trigger: always_on
description: Automatically commit and push changes to GitHub after every prompt that modifies files.
---

# Automatyczny Git Push po każdym prompcie

Po każdym prompcie użytkownika, w którym zostały zmodyfikowane lub dodane jakiekolwiek pliki projektu:
1. Zweryfikuj poprawność zmian (np. `next build` / `typecheck`), aby nie wypychać zepsutego kodu.
2. Wykonaj `git add` dla zmienionych plików (nigdy nie dodawaj `.env` ani plików z sekretami) oraz `git commit` z krótkim, jasnym opisem zmian.
3. Wykonaj `git push origin main` (jeśli zdalna gałąź ma nowe commity od współpracowników, wykonaj wcześniej bezpieczny `git pull --rebase origin main` i rozwiąż ewentualne konflikty bez utraty cudzej pracy).
