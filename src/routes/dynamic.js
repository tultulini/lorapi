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

        let item = req.body
        console.log(`gonna post ${JSON.stringify(item)}`)
        if (!item) {
            res.status(500).send("missing item to update")
            return
        }

        let addedItem = adapter.add(config, item)
        res.send(addedItem)
    })


    router.put('/:id', function (req, res) {
        try {
            let item = req.body
            console.log(`item: ${JSON.stringify(item, null, '\t')} id:${req.params.id}`)
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
            adapter.update(config, item, req.params.id)
            res.send(req.params.id)
        }
        catch (error) {
            res.status(500).send(error)

            console.error(error, error.stack)
        }

    })
    router.delete('/:id', (req, res) => {
        console.log('enter delete')
        adapter.delete(config, req.params.id)
        res.send()

    })
    return router
}