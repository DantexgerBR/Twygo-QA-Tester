---
name: twyg-app-dev
description: "Estado da montagem do ambiente de desenvolvimento do Twygo (repo Twygo/twyg-app, Ruby on Rails) em ~/twyg-app — em progresso 2026-05-20."
metadata: 
  node_type: memory
  type: project
  originSessionId: 016ef769-3cce-4a90-a74c-e8e60b0da3a4
---

Em 2026-05-20 começamos a montar o ambiente local de dev do **monolito Twygo** (`Twygo/twyg-app` — repo privado da org, Ruby on Rails) em `~/twyg-app`. Em progresso.

**Why:** o usuário pediu pra subir o ambiente seguindo o wiki `https://github.com/Twygo/twyg-app/wiki`. Não confundir com o repo `~/playwright-tests` que é a suíte de testes E2E.

**How to apply:** sessões futuras que continuarem esse trabalho devem seguir o estado abaixo. NÃO clonar de novo, NÃO sobrescrever os arquivos copiados.

## Estado atual

- Repo clonado em `~/twyg-app` (branch `master`)
- ✅ `yarn.lock` removido (wiki diz pra remover antes do build)
- ✅ `docker-compose.yml` criado a partir de `docker-compose.example.yml`
- ✅ `config/environments/.env.development` criado a partir do `.example`
- ✅ `config/environments/development.rb` linha 68: `perform_deliveries = false` (evita precisar de Mailtrap). Arquivo marcado como `git update-index --assume-unchanged` pra não poluir `git status`.
- ⏳ **Docker ainda não instalado** na máquina. Próximo passo manual: `sudo apt-get install -y docker.io docker-compose-v2`.

## Quando o docker estiver disponível

Rodar `cd ~/twyg-app && make setup` — esse alvo já automatiza:
1. `docker compose build`
2. `docker compose run app bundle`
3. `docker compose up -d`
4. `copy_config_files` (copia `configuration.example-docker.yml`, `database.example-docker.yml`, `smtp.example.yml`)
5. `db_setup` (drop, create, migrate test+dev, populate)
6. `runners` (lib/runners/*.rb)
7. `i18n` (pull + js setup + js export)
8. `start_app` (rails s -p 3000)

Depois: `cd ~/twyg-app && ./setup-network.sh` (configura network do docker pros microsserviços de IA — instrução do wiki).

App fica em `http://localhost:3000`. Login padrão de dev: `usuario@euax.com.br` / `123456`.

## Gotchas conhecidos (do wiki)

- Se `rails db:migrate` quebrar, apagar temporariamente `db/migrate/20141126180335_create_group_participant_levels.rb` e re-rodar.
- Se reclamar de `twyg_development.flipper_gates`, comentar temporariamente o método `can_see_new_learning_path` em `navigation.rb`.
- Se `rails db:create` quebrar por vite, rodar `bundle exec vite upgrade`.
- Se `bundle install` reclamar de permissão: `sudo chown -R twygo /usr/local/bundle` antes.

## Rodar testes localmente (CUIDADO)

O `CLAUDE.md` do repo avisa: rodar `rspec` ou `cucumber` localmente com a config default **apaga o banco de dev** (cleaner usa strategy=deletion + database.yml herda `DB_NAME=twyg_development` no bloco `test:`).

Pra rodar specs com segurança:
1. Editar `config/database.yml` apontando o bloco `test:` pra `twyg_test`, `twyg_historic_test`, `twygo_logs_test` (NÃO commitar)
2. `git update-index --assume-unchanged config/database.yml`
3. `docker exec twyg_app bash -lc "cd /var/www && RAILS_ENV=test bundle exec rake db:create db:schema:load"`
4. Confirmar isolamento: `docker exec twyg_app bash -lc "cd /var/www && RAILS_ENV=test bin/rails runner 'puts ActiveRecord::Base.connection_db_config.configuration_hash[:database]'"` — esperado `twyg_test` (NÃO `twyg_development`).

## Wiki

Wiki completo clonado em `/tmp/twyg-app.wiki/`. Páginas relevantes:
- `Como-montar-um-ambiente-de-desenvolvimento-do-Twygo.md` (a guia que estamos seguindo)
- `Como-montar-o-ambiente-de-Microserviços-local-com-desenvolvimento.md` (microsserviços de IA)
- `Adaptações-para-rodar-o-Twygo-(Ruby-3.3.1-|-Rails-7-|-Node-20)-no-Mac-M1.md`
- `Primeiros-passos-Twygo.md`
- `📦-Componentes-do-Twygo-(Ruby-on-Rails).md`

Pra atualizar o wiki: `cd /tmp/twyg-app.wiki && git pull`.
