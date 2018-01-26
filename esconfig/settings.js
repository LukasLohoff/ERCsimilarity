const settings = {
    "settings": {
        "index": {
            "number_of_shards": 1
        },
        "similarity": {
            "my_DFR": {
                "type": "DFR",
                "basic_model": "g",
                "after_effect": "l",
                "normalization": "h2",
                "normalization.h2.c": "3.0"
            },
            "my_DFI": {
                "type": "DFI",
                "independence_measure": "standardized"
            },
            "my_IB": {
                "type": "IB",
                "distribution": "ll",
                "lambda": "df",
                "normalization": "h2"
            },
            "my_LMDirichlet": {
                "type": "LMDirichlet",
                "mu": "2000"
            },
            "my_classic": {
                "type": "classic",
                "discount_overlaps": false
            },
            "my_BM25": {
                "type": "BM25",
                "b": 1
            }
        }
    }
};



module.exports = settings;