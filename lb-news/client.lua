-- ESX = exports['es_extended']:getSharedObject()
local identifier = "lb-news-app"
CreateThread(function()
    while GetResourceState("lb-phone") ~= "started" do
        Wait(500)
    end

    local function AddApp()
        local added, errorMessage = exports["lb-phone"]:AddCustomApp({
            identifier = identifier,
            name = "USTD News",
            description = "As notícias da Cidade",
            developer = "Arcade",
            defaultApp = true,
            size = 59812,
            ui = GetCurrentResourceName() .. "/web/index.html",
            icon = "https://cfx-nui-" .. GetCurrentResourceName() .. "/web/assets/news.png"
        })

        if not added then
            print("Could not add app:", errorMessage)
        end
    end

    AddApp()

    AddEventHandler("onResourceStart", function(resource)
        if resource == "lb-phone" then
            AddApp()
        end
    end)
end)
RegisterNUICallback('getLocales', function(data, cb)
    local lang = Config.lang
    local locales = Config.locales[lang]
    cb(locales)
end)

RegisterNUICallback("close", function()
    vRP.removeObjects()
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "hide" })
end)


RegisterNUICallback('likeNews', function(data, cb)
    TriggerServerEvent('vrp:likeNews', data.id)
    RegisterNetEvent('vrp:returnLikeNews')
    AddEventHandler('vrp:returnLikeNews', function(liked)
        print(json.encode(liked))
        if liked ~= false and liked.affectedRows > 0 then
            TriggerEvent("Notify", "verde", Config.locales[Config.lang].LIKED, 5000)
            cb(true)
        else
            TriggerEvent("Notify", "vermelho", Config.locales[Config.lang].CANT_LIKE, 5000)
            cb(false)
        end
    end)
end)

RegisterNUICallback('getDatas', function(data, cb)
    TriggerServerEvent('vrp:getNews')
    RegisterNetEvent('vrp:returnNews')
    AddEventHandler('vrp:returnNews', function(news, job)
        cb({ canEdit = (job), news = news })
    end)
end)
RegisterNUICallback('refresh', function(data, cb)
    TriggerServerEvent('vrp:refreshNews')
    RegisterNetEvent('vrp:returnGetNews')
    AddEventHandler('vrp:returnGetNews', function(result)
        cb(result)
    end)
end)

RegisterNUICallback('addNews', function(data, cb)
    TriggerServerEvent('vrp:addNews', data)
    RegisterNetEvent('vrp:returnAddNews')
    AddEventHandler('vrp:returnAddNews', function(added)
        if added then
            cb(true)
        else
            cb(false)
        end
    end)
end)

RegisterNUICallback('deleteNews', function(data, cb)
    TriggerServerEvent('vrp:deleteNews', data["id"])
    RegisterNetEvent('vrp:returnDeleteNews')
    AddEventHandler('vrp:returnDeleteNews', function(deleted)
        if deleted then
            cb(true)
        else
            cb(false)
        end
    end)
end)

RegisterNUICallback('updateNews', function(data, cb)
    TriggerServerEvent('vrp:updateNews', data)
    RegisterNetEvent('vrp:returnUpdateNews')
    AddEventHandler('vrp:returnUpdateNews', function(updated)
        if updated then
            cb(true)
        else
            cb(false)
        end
    end)
end)

RegisterNUICallback('add-photos', function(data, cb)
    exports['screenshot-basic']:requestScreenshotUpload(
        'https://api.fivemanage.com/api/image?apiKey=' .. Config.APIKEYS.Photos, 'image', function(data)
            print(json.decode(data))
            local resp = json.decode(data)
            if resp then
                TriggerEvent("Notify", "vermelho", Config.locales[Config.lang].UPLOAD.SUCCESS, 5000)
                cb(resp.url)
            end
        end)
end)
