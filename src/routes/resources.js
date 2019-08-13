import { setConfiguration, getConfigurationData, getConfiguration } from '../resources'
var express = require('express');
export function getResourcesRouter(addedRouteCallback) {
    var router = express.Router();

    router.get('/', (req, res) => {
        console.log('resources get entered')
        try {
            let result = getConfigurationData()
            console.log(`result: ${JSON.stringify(result)}`)
            res.send(result)
        } catch (error) {
            console.error(`error: ${error}`)
        }

    })


    router.post('/', function (req, res) {
        console.log('entered post')

        let resource = req.body

        if (!resource) {
            res.status(500).send({ message: "missing resource" })
            return
        }
        if (!validateResource(resource)) {
            res.status(500).send({ message: "resource not valid" })
            return

        }
        try {
            setConfiguration(resource)
            res.send({"message":`${resource.resourceName} added successfully - please reboot service to use new resource`});
            if(addedRouteCallback!==undefined)
            {
                addedRouteCallback(getConfiguration(resource))

            }

        }
        catch (error) {
            console.error(error)
            res.status(500).send({ "message": error })
        }
    })

    return router
}
function validateResource(resource) {
    return resource.resourceName != undefined
        && resource.identifier != undefined
        && resource.idGenType != undefined
}


