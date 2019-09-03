import { setConfiguration, getConfigurationData, getConfiguration } from '../lib/configuration'
const express = require('express');
export function getResourcesRouter(addedRouteCallback) {
    const router = express.Router();
    router.get('/', (req, res) => {
        try {
            let result = getConfigurationData()
            res.send(result)
        } catch (error) {
            console.error(`error: ${error}`)
            res.status(500).send("Error occurred")
        }
    })


    router.post('/', function (req, res) {
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
            res.send({ "message": `${resource.resourceName} added successfully - noemon should reboot service` });
            if (addedRouteCallback !== undefined) {
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


