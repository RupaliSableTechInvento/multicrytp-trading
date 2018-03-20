import postatrade from '../models/postatrade'

const tradeController = {

    getAll: async (req, res, next) => {
        postatrade.find({}, (err, trade) => {
            if (err) return res.json(err);
            res.json(trade);
        });
    },

    getOne: (req, res, next) => {
        postatrade.findById(req.params.id, (err, trade) => {
            res.json(trade || {});
        });
    },

    create: (req, res, next) => {
        postatrade.create(req.body, function (err, trade) {
            if (err) return res.json(err);
            res.json(trade)
        })
    },

    update: (req, res, next) => {
        postatrade.findOneAndUpdate(req.params.id, req.body, {new: true}, (err, trade) => {
            if (err) return res.json(err);
            res.json(trade)
        });
    },

    delete: (req, res, next) => {
        postatrade.remove({_id: req.params.id}, (err, ok) => {
            if (err) return res.json(err);
        });
        res.json(true)
    }
};

export default tradeController;
