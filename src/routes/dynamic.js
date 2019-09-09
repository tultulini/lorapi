import { HttpErrorCodes } from '../lib/http-utils';
import { HttpMethods } from '../lib/configuration';

const express = require('express');

//module.exports = { getRoute: function (config, adapter) { return getRoute(config, adapter) } };


export function getRoute(config, adapter) {
    const router = express.Router();

    /* GET home page. */
    router.get('/', function (req, res) {
        let items = adapter.getAll(config)
        res.send(items)
    });

    router.get('/:id', function (req, res) {
        let item = adapter.getById(config, req.params.id)
        if (!item) {
            res.status(404).send("couldn't find resource")
        }
        else {
            res.send(item)
        }
    });

    router.post('/', function (req, res) {
        let item = req.body
        if (!item) {
            res.status(400).send("missing item to update")
            return
        }

        if (!assertRequest(config, item, res, HttpMethods.Post)) {
            return
        }

        try {
            let addedItem = adapter.add(config, item)
            res.send(addedItem)
        }
        catch (error) {
            console.error(error)
            res.status(HttpErrorCodes.InternalServerError).send(`error occured: ${error}`)
        }
    })


    router.put('/:id', function (req, res) {
        try {
            let item = req.body
            if (!item) {
                res.status(HttpErrorCodes.BadRequest).send("missing item to update")
                return
            }

            if (!assertRequest(config, item, res, HttpMethods.Put)) {
                return
            }

            let existingItem = adapter.getById(config, req.params.id)
            if (!existingItem) {
                res.status(404).send("couldn't find resource")
                return
            }

            item[config.identifier] = req.params.id
            adapter.update(config, item, req.params.id)
            res.send(req.params.id)
        }
        catch (error) {
            res.status(500).send(error)

            console.error(error, error.stack)
        }

    })
    router.delete('/:id', (req, res) => {
        adapter.delete(config, req.params.id)
        res.send()

    })
    return router
}

function assertRequest(config, data, res, method) {
    try {
        if (config.assert) {
            config.assert(method, data)
        }

        return true
    }
    catch (error) {
        console.error(error)
        res.status(HttpErrorCodes.BadRequest).send(`${error}`)
        return false
    }

}