fx_version "cerulean"
game "gta5"

title "LB Phone - App News"
description "A new apps for the LB Phone."
author "BadBrans"
shared_script 'config.lua'
client_scripts {
    'config.lua',
    "@vrp/lib/Utils.lua",
    "client.lua"
}
server_scripts {
    '@oxmysql/lib/MySQL.lua',
    "@vrp/lib/Utils.lua",
    "server.lua"
}
files {
    "web/**/*"
}

ui_page "web/index.html"
