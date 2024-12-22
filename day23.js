var day23 = (() => {
    let findLANPartyPassword = rawInput => {
        let connectionPairs = rawInput.split(/\n/).filter(el => el).map(str => str.split('-'));
        let connectionsHash = {};
        connectionPairs.forEach(pair => {
            let [a, b] = pair;
            connectionsHash[a] = { [b]: true, ...(connectionsHash[a] || {}) };
            connectionsHash[b] = { [a]: true, ...(connectionsHash[b] || {}) };
        });

        let longest = Object.keys(connectionsHash).map(key => {
            let directs = Object.keys(connectionsHash[key]);
            // ab-bc ab-cd bc-cd cd-xy

            let pairs = directs.map(d => [key, d]);
            let connections = combinatorics(pairs, directs);
            connections = connections.filter(t => {
                return allPairsInterConnect(t, connectionsHash);
            });

            let result = null;
            while (connections.length) {
                result = connections;

                let directsHash = {};
                connections.forEach(c => c.forEach(el => directsHash[el] = true));
                directs = Object.keys(directsHash);

                connections = combinatorics(connections, directs);
                connections = connections.filter(c => {
                    return allPairsInterConnect(c, connectionsHash);
                });
                let connectionKeys = {};
                connections.forEach(c => connectionKeys[c.sort().join(',')] = true);
                connections = Object.keys(connectionKeys).map(str => str.split(','));
            }

            return result[0];
        });

        let longestConnectionLength = -1;
        let longestConnection = null;

        longest.forEach(l => {
            if (l.length > longestConnectionLength) {
                longestConnectionLength = l.length;
                longestConnection = l;
            }
        });


        return longestConnection.sort().join(',');
    };

    let allPairsInterConnect = (computers, connectionsHash) => {
        for (let i = 0; i < computers.length - 1; i++) {
            for (let j = i + 1; j < computers.length; j++) {
                let [a, b] = [computers[i], computers[j]];
                if (!connectionsHash[a] || !connectionsHash[a][b]) {
                    return false;
                }
            }
        }

        return true;
    };

    let combinatorics = (current, mixings) => {
        let result = [];
        current.forEach(c => {
            mixings.forEach(m => {
                if (c.indexOf(m) !== -1) {
                    return;
                }

                result.push([...c, m]);
            });
        });

        return result;
    };

    let findTripleConnectedTComputers = rawInput => {
        let connectionPairs = rawInput.split(/\n/).filter(el => el).map(str => str.split('-'));
        let connectionsHash = {};
        connectionPairs.forEach(pair => {
            let [a, b] = pair;
            connectionsHash[a] = { [b]: true, ...(connectionsHash[a] || {}) };
            connectionsHash[b] = { [a]: true, ...(connectionsHash[b] || {}) };
        });

        // { tc: {kh: true, xy: true, zz: true, } }
        let triplets = {};
        Object.keys(connectionsHash).forEach(key => {
            if (key[0] !== 't') {
                return;
            }

            // ....
            let connections = Object.keys(connectionsHash[key]);
            connections.forEach(c => {
                if (c === key) {
                    return;
                }

                Object.keys(connectionsHash[c]).forEach(lastConnection => {
                    if (lastConnection === key) {
                        return;
                    }

                    // each computer has to be connected to the other two...
                    if (!connectionsHash[key][c] || !connectionsHash[key][lastConnection] || !connectionsHash[c][lastConnection]) {
                        return;
                    }

                    let tripletKey = [key, c, lastConnection].sort().join(',');
                    triplets[tripletKey] = true;
                });
            });
        });

        return Object.keys(triplets).length;
    };

    return [findTripleConnectedTComputers, findLANPartyPassword];
})();
