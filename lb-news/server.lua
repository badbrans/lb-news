local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")

vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP")


RegisterServerEvent('vrp:addNews')
AddEventHandler('vrp:addNews', function(news)
    local source = source
    local user_id = vRP.getUserId(source)
    if user_id then
        addNews(news, function(success)
            TriggerClientEvent('vrp:returnAddNews', source, success)
        end)
    end
end)

function addNews(news, cb)
    if news.image_url == nil then
        news.image_url = "null"
    end
    MySQL.Async.execute(
        'INSERT INTO `news` (`title`, `description`, `message`, `image_url`) VALUES (@title, @description, @message, @image_url)',
        {
            ['@title'] = news.title,
            ['@description'] = news.description,
            ['@message'] = news.message,
            ['@image_url'] = news.image_url
        }, function(rowsChanged)
            cb(rowsChanged > 0)
        end)
end

RegisterServerEvent('vrp:getNews')
AddEventHandler('vrp:getNews', function()
    local source = source
    local user_id = vRP.getUserId(source)
    local job = false

    getNews(function(news)
        if vRP.hasPermission(user_id, Config.Permission) then
            job = true
        else
            job = false
        end
        TriggerClientEvent('vrp:returnNews', source, news, job)
    end)
end)

function getNews(cb)
    MySQL.Async.fetchAll('SELECT * FROM `news` ORDER BY `id` DESC', {}, function(news)
        for i, v in ipairs(news) do
            MySQL.Async.fetchAll('SELECT * FROM `news_likes` WHERE `id_news` = @id_news', { ['@id_news'] = v.id },
                function(isLiked)
                    if #isLiked == 0 or isLiked == nil then
                        news[i].likes = 0
                    else
                        news[i].likes = #isLiked
                    end
                    if i == #news then
                        cb(news)
                    end
                end)
        end
    end)
end

RegisterServerEvent('vrp:deleteNews')
AddEventHandler('vrp:deleteNews', function(newsid)
    local source = source
    local user_id = vRP.getUserId(source)
    if user_id then
        deleteNews(user_id, newsid, function(success)
            TriggerClientEvent('vrp:returnDeleteNews', source, success)
        end)
    end
end)

function deleteNews(user_id, newsid, cb)
    MySQL.Async.execute('DELETE FROM `news` WHERE `id` = @id', { ['@id'] = newsid }, function(rowsChanged)
        cb(rowsChanged > 0)
    end)
end

RegisterServerEvent('vrp:updateNews')
AddEventHandler('vrp:updateNews', function(news)
    local source = source
    local user_id = vRP.getUserId(source)
    if user_id then
        updateNews(user_id, news, function(success)
            TriggerClientEvent('vrp:returnUpdateNews', source, success)
        end)
    end
end)

function updateNews(user_id, news, cb)
    MySQL.Async.execute(
        'UPDATE `news` SET `title` = @title, `description` = @description, `message` = @message WHERE `id` = @id', {
            ['@title'] = news.title,
            ['@description'] = news.description,
            ['@message'] = news.message,
            ['@id'] = news.id
        }, function(rowsChanged)
            cb(rowsChanged > 0)
        end)
end

function likeNews(user_id, id_news, cb)
    local source = source
    local player = vRP.getUserSource(user_id)
    MySQL.Async.fetchAll('SELECT * FROM `news_likes` WHERE `id_news` = @id_news AND `identifier` = @identifier', {
        ['@id_news'] = id_news,
        ['@identifier'] = user_id
    }, function(isLiked)
        if #isLiked == 0 or isLiked == nil then
            MySQL.Async.execute('INSERT INTO `news_likes` (`id_news`, `identifier`) VALUES (@id_news, @identifier)', {
                ['@id_news'] = id_news,
                ['@identifier'] = user_id
            }, function(rowsChanged)
                cb(rowsChanged > 0)
            end)
        else
            cb(false)
        end
    end)
end

RegisterServerEvent('vrp:likeNews')
AddEventHandler('vrp:likeNews', function(id_news)
    local source = source
    local user_id = vRP.getUserId(source)
    if user_id then
        MySQL.Async.fetchAll('SELECT * FROM `news_likes` WHERE `id_news` = @id_news AND `identifier` = @identifier', {
            ['@id_news'] = id_news,
            ['@identifier'] = user_id
        }, function(isLiked)
            if #isLiked == 0 or isLiked == nil then
                MySQL.Async.execute('INSERT INTO `news_likes` (`id_news`, `identifier`) VALUES (@id_news, @identifier)',
                    {
                        ['@id_news'] = id_news,
                        ['@identifier'] = user_id
                    }, function(rowsChanged)
                        TriggerClientEvent('vrp:returnLikeNews', source, { affectedRows = rowsChanged })
                    end)
            else
                TriggerClientEvent('vrp:returnLikeNews', source, false)
            end
        end)
    end
end)

RegisterServerEvent('vrp:refreshNews')
AddEventHandler('vrp:refreshNews', function()
    local source = source
    local user_id = vRP.getUserId(source)
    if user_id then
        if vRP.hasPermission(user_id, Config.Permission) then
            getNews(function(news)
                TriggerClientEvent('vrp:returnGetNews', source, { canEdit = true, news = news })
            end)
        else
            getNews(function(news)
                TriggerClientEvent('vrp:returnGetNews', source, { canEdit = false, news = news })
            end)
        end
    end
end)
