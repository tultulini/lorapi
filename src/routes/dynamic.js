var express = require('express');

module.exports = { getRoute: function (config, adapter) { return getRoute(config, adapter) } };


function getRoute(config, adapter) {
    var router = express.Router();

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
        console.log('entered post')
        console.log(`req.body: ${req.body}`)
        let item = req.body
        console.log(`gonna post ${JSON.stringify(item)}`)
        if (!item) {
            res.status(500).send("missing item to update")
            return
        }

        let addedItem = adapter.add(item)
        res.send(addedItem)
    })


    router.put('/:id', function (req, res) {
        let item = JSON.parse(req.body)
        if (!item) {
            res.status(500).send("missing item to update")
            return
        }

        let existingItem = adapter.getById(config, req.params.id)
        if (!existingItem) {
            res.status(404).send("couldn't find resource")
            return
        }

        item[config.identifier] = req.params.id
        adapter.update(config, item)
        res.send(id)
    })
    return router
}